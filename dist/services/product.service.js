"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const product_repository_1 = require("../repositories/product.repository");
const slugify_1 = __importDefault(require("slugify"));
const cloudinary_1 = require("../utils/cloudinary");
const productRepository = new product_repository_1.ProductRepository();
class ProductService {
    async createProduct(data, files) {
        const { attributes, ...productData } = data;
        const slug = (0, slugify_1.default)(productData.name, { lower: true });
        // Check slug uniqueness
        const existing = await productRepository.findBySlug(slug);
        if (existing)
            throw new Error('Product with this name already exists');
        const product = await productRepository.createProduct({
            ...productData,
            slug,
        });
        // If files are provided, upload to Cloudinary
        if (files && files.length > 0) {
            const imagesData = await Promise.all(files.map(async (file, index) => {
                const result = await (0, cloudinary_1.uploadToCloudinary)(file.buffer, 'products');
                return {
                    productId: product.id,
                    url: result.secure_url,
                    publicId: result.public_id,
                    isMain: index === 0, // Set first image as main
                };
            }));
            await productRepository.addImages(imagesData);
        }
        // Automated Variant Generation Logic (Cartesian Product)
        if (data.attributes) {
            const generatedVariants = this.generateVariants(product.id, data.attributes, productData.basePrice);
            if (generatedVariants.length > 0) {
                await productRepository.createVariants(generatedVariants);
            }
        }
        return productRepository.findById(product.id);
    }
    generateVariants(productId, attributes, basePrice) {
        const { colors, sizes, materials } = attributes;
        const variants = [];
        // Helper to generate SKU: NAME-COLOR-SIZE-MAT
        // This is a basic implementation of Cartesian Product
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
                        price: basePrice, // Default to base price
                        stock: 0, // Default to 0 stock
                    });
                }
            }
        }
        return variants;
    }
    async getProducts(filters) {
        return productRepository.findMany(filters);
    }
    async getProductBySlug(slug) {
        const product = await productRepository.findBySlug(slug);
        if (!product)
            throw new Error('Product not found');
        return product;
    }
    async updateProduct(id, data) {
        if (data.name) {
            data.slug = (0, slugify_1.default)(data.name, { lower: true });
        }
        return productRepository.updateProduct(id, data);
    }
    async deleteProduct(id) {
        return productRepository.deleteProduct(id);
    }
}
exports.ProductService = ProductService;
