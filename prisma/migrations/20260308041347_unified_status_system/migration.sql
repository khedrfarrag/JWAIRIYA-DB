/*
  Warnings:

  - You are about to drop the column `isActive` on the `products` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "VariantStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CategoryStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "status" "CategoryStatus" NOT NULL DEFAULT 'PUBLISHED';

-- AlterTable
ALTER TABLE "products" DROP COLUMN "isActive",
ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'PUBLISHED';

-- AlterTable
ALTER TABLE "variants" ADD COLUMN     "status" "VariantStatus" NOT NULL DEFAULT 'ACTIVE';
