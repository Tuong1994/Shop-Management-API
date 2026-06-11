/*
  Warnings:

  - You are about to drop the `storage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `amount` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `boxes` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `items` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storageStatus` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `storage` DROP FOREIGN KEY `storage_productId_fkey`;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `amount` INTEGER NOT NULL,
    ADD COLUMN `boxes` INTEGER NOT NULL,
    ADD COLUMN `items` INTEGER NOT NULL,
    ADD COLUMN `storageStatus` INTEGER NOT NULL;

-- DropTable
DROP TABLE `storage`;
