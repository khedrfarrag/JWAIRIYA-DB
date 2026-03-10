import { ProductRepository } from '../repositories/product.repository';
import slugify from 'slugify';
import { uploadToCloudinary, removeFromCloudinary } from '../utils/cloudinary';
import prisma from '../config/database';

const productRepository = new ProductRepository();

export class ProductService {
  async createProduct(data: any, files?: Express.Multer.File[]) {
    const { attributes, initialStock, lowStockThreshold, ...productData } = data;
    const slug = slugify(productData.name, { lower: true });
    
    // Check slug uniqueness
    const existing = await productRepository.findBySlug(slug);
    if (existing) throw new Error('Product with this name already exists');

    return await prisma.$transaction(async (tx) => {
      // 1. Create Product
      const product = await tx.product.create({
        data: {
          ...productData,
          slug,
          tags: data.tags || [],
          status: data.status || 'PUBLISHED',
          lowStockThreshold: lowStockThreshold || 5,
        },
      });

      // 2. Upload and Add Images if provided
      if (files && files.length > 0) {
        const imagesData = await Promise.all(
          files.map(async (file, index) => {
            const result = await uploadToCloudinary(file.buffer, 'products');
            return {
              productId: product.id,
              url: result.secure_url,
              publicId: result.public_id,
              isMain: index === 0,
              order: index, // Track ordering
            };
          })
        );
        await tx.productImage.createMany({ data: imagesData });
      }

      // 3. Generate and Add Variants
      const generatedVariants = this.generateVariants(
        product.id,
        attributes || {},
        productData.basePrice,
        initialStock || 0
      );
      
      // Safety Guard: Limit variants
      if (generatedVariants.length > 100) {
        throw new Error('Too many variants generated (max 100). Please reduce attributes.');
      }

      if (generatedVariants.length > 0) {
        await tx.variant.createMany({ data: generatedVariants });
      }

      return tx.product.findUnique({
        where: { id: product.id },
        include: { images: true, variants: true, category: true },
      });
    });
  }

  private generateVariants(productId: string, attributes: any, basePrice: number, initialStock: number) {
    const { colors, sizes, materials } = attributes;
    const variants: any[] = [];

    const colorsList = colors?.length > 0 ? colors : [null];
    const sizesList = sizes?.length > 0 ? sizes : [null];
    const materialsList = materials?.length > 0 ? materials : [null];

    for (const color of colorsList) {
      for (const size of sizesList) {
        for (const material of materialsList) {
          variants.push({
            productId,
            color,
            size,
            material,
            sku: `${productId.substring(0, 5)}-${color || 'X'}-${size || 'X'}-${material || 'X'}`.toUpperCase(),
            price: basePrice, 
            stock: initialStock, 
          });
        }
      }
    }

    return variants;
  }

  async getProducts(filters: any) {
    return productRepository.findMany(filters);
  }

  async getProductBySlug(slug: string) {
    const product = await productRepository.findBySlug(slug);
    if (!product) throw new Error('Product not found');
    return product;
  }

  async updateProduct(id: string, data: any, files?: Express.Multer.File[]) {
    const { attributes, deleteImages, ...updateData } = data;

    // 1. Fetch current product to check existence and handle slug
    const currentProduct = await productRepository.findById(id);
    if (!currentProduct) throw new Error('Product not found');

    if (updateData.name && updateData.name !== currentProduct.name) {
      updateData.slug = slugify(updateData.name, { lower: true });
      const existing = await productRepository.findBySlug(updateData.slug);
      if (existing && existing.id !== id) {
        throw new Error('Another product with this name already exists');
      }
    }

    return await prisma.$transaction(async (tx) => {
      // 2. Handle Image Deletions
      if (deleteImages && Array.isArray(deleteImages) && deleteImages.length > 0) {
        const imagesToDelete = await tx.productImage.findMany({
          where: {
            productId: id,
            publicId: { in: deleteImages },
          },
        });

        await Promise.all(
          imagesToDelete.map(async (img) => {
            if (img.publicId) await removeFromCloudinary(img.publicId);
          })
        );

        await tx.productImage.deleteMany({
          where: { publicId: { in: deleteImages } },
        });
      }

      // 3. Handle New Image Uploads
      if (files && files.length > 0) {
        const imagesData = await Promise.all(
          files.map(async (file, index) => {
            const result = await uploadToCloudinary(file.buffer, 'products');
            return {
              productId: id,
              url: result.secure_url,
              publicId: result.public_id,
              isMain: false, // Default to false for updates
              order: (currentProduct as any).images.length + index,
            };
          })
        );
        await tx.productImage.createMany({ data: imagesData });
      }

      // 4. Handle Smart Variant Sync (Only if attributes are provided)
      if (attributes) {
        const newVariants = this.generateVariants(
          id,
          attributes,
          updateData.basePrice || currentProduct.basePrice,
          0 // Use 0 for newly discovered variants via update
        );

        // Fetch current active variants
        const currentVariants = await tx.variant.findMany({
          where: { productId: id },
        });

        // Determine which ones to Archive and which to Create
        for (const existing of currentVariants) {
          const isStillValid = newVariants.some(
            (nv) => nv.color === existing.color && nv.size === existing.size && nv.material === existing.material
          );
          if (!isStillValid) {
            await tx.variant.update({
              where: { id: existing.id },
              data: { status: 'ARCHIVED' as any },
            });
          }
        }

        for (const nv of newVariants) {
          const alreadyExists = currentVariants.find(
            (ev) => ev.color === nv.color && ev.size === nv.size && ev.material === nv.material
          );
          if (!alreadyExists) {
            await tx.variant.create({ data: nv });
          } else if (alreadyExists.status === ('ARCHIVED' as any)) {
            // Reactivate if it was archived before
            await tx.variant.update({
              where: { id: alreadyExists.id },
              data: { status: 'ACTIVE' as any },
            });
          }
        }
      }

      // 5. Update main product details
      return await tx.product.update({
        where: { id },
        data: updateData,
        include: { images: true, variants: true, category: true },
      });
    });
  }

  async updateVariant(variantId: string, data: any) {
    const variant = await productRepository.findVariantById(variantId);
    if (!variant) throw new Error('Variant not found');
    
    return productRepository.updateVariant(variantId, data);
  }

  async deleteProduct(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) throw new Error('Product not found');

    // Delete images from Cloudinary
    await Promise.all(
      product.images.map(async (img) => {
        if (img.publicId) {
          await removeFromCloudinary(img.publicId);
        }
      })
    );

    return productRepository.deleteProduct(id);
  }

  async getRelatedProducts(productId: string) {
    const product = await productRepository.findById(productId);
    if (!product) throw new Error('Product not found');

    return productRepository.findRelated(
      productId,
      product.categoryId,
      product.tags,
      4 // Limit to 4 products
    );
  }
}
