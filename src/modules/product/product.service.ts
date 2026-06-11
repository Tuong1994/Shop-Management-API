import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ProductHelper } from './product.helper';
import { QueryDto } from 'src/common/dto/query.dto';
import { Product } from '@prisma/client';
import { ELang } from 'src/common/enum/base';
import { Paging } from 'src/common/type/base';
import { ProductDto } from './product.dto';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { CREATE_ERROR, UPDATE_SUCCESS, REMOVE_SUCCESS, NOT_FOUND, NO_DATA_RESTORE, RESTORE_SUCCESS } =
  responseMessage;

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
    private productHelper: ProductHelper,
  ) {}

  async getProducts(query: QueryDto) {
    const { keywords, sortBy, locale } = query;
    const products = await this.prisma.product.findMany({
      where: this.productHelper.filterProducts(query),
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.productHelper.getSelectFields(locale) },
    });
    let filterProducts: Product[] = [];
    if (keywords)
      filterProducts = products.filter((product) =>
        locale === ELang.EN
          ? utils.filterByKeywords(product.nameEn, locale)
          : utils.filterByKeywords(product.nameVn, locale),
      );
    const items = this.productHelper.convertCollection(keywords ? filterProducts : products, locale);
    return { totalItems: keywords ? filterProducts.length : products.length, items };
  }

  async getProductsPaging(query: QueryDto) {
    const { page, limit, keywords, sortBy, locale } = query;
    let collection: Paging<Product> = utils.defaultCollection();
    const products = await this.prisma.product.findMany({
      where: this.productHelper.filterProducts(query),
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.productHelper.getSelectFields(locale) },
    });
    if (keywords) {
      const filterProducts = products.filter((product) =>
        locale === ELang.EN
          ? utils.filterByKeywords(product.nameEn, locale)
          : utils.filterByKeywords(product.nameVn, locale),
      );
      collection = utils.paging<Product>(filterProducts, page, limit);
    } else collection = utils.paging<Product>(products, page, limit);
    const items = this.productHelper.convertCollection(collection.items, locale);
    return { ...collection, items };
  }

  async getProduct(query: QueryDto) {
    const { productId, locale } = query;
    const product = await this.prisma.product.findUnique({
      where: { id: productId, isDelete: this.productHelper.isNotDelete },
      select: { ...this.productHelper.getSelectFields(locale) },
    });
    const convertProduct = utils.convertRecordsName<Product>(product, locale);
    return convertProduct;
  }

  async createProduct(file: Express.Multer.File, product: ProductDto) {
    const newProduct = await this.prisma.product.create({
      data: {
        ...this.productHelper.createUpdateData(product),
        isNew: true,
        isDelete: false,
      },
    });
    if (newProduct) {
      if (!file) return newProduct;
      const result = await this.cloudinary.upload(utils.getFileUrl(file));
      const image = utils.generateImage(result, { productId: newProduct.id });
      const newProductImage = await this.prisma.image.create({ data: { ...image, isDelete: false } });
      return { ...newProduct, image: newProductImage };
    }
    throw new HttpException(CREATE_ERROR, HttpStatus.BAD_REQUEST);
  }

  async updateProduct(query: QueryDto, file: Express.Multer.File, product: ProductDto) {
    const { productId } = query;
    await this.prisma.product.update({
      where: { id: productId },
      data: this.productHelper.createUpdateData(product),
    });
    if (file) {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        select: { id: true, image: true },
      });
      const result = await this.cloudinary.upload(utils.getFileUrl(file));
      const image = utils.generateImage(result, { productId });
      if (product && product.image) {
        await this.cloudinary.destroy(product.image.publicId);
        await this.prisma.image.update({ where: { productId }, data: image });
      } else await this.prisma.image.create({ data: { ...image, isDelete: false } });
    }
    throw new HttpException(UPDATE_SUCCESS, HttpStatus.OK);
  }

  async removeProducts(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const products = await this.prisma.product.findMany({
      where: { id: { in: listIds } },
      select: { id: true, image: true },
    });
    if (products && !products.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.product.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    await Promise.all(
      products.map(async (product) => {
        if (product.image) await this.productHelper.handleUpdateIsDeleteImage(product, true);
      }),
    );
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async removeProductsPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const products = await this.prisma.product.findMany({
      where: { id: { in: listIds } },
      select: { id: true, image: true },
    });
    if (products && !products.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await Promise.all(
      products.map(async (product) => {
        if (product.image) await this.cloudinary.destroy(product.image.publicId);
      }),
    );
    await this.prisma.product.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async restoreProducts() {
    const products = await this.prisma.product.findMany({
      where: { isDelete: { equals: true } },
      select: { id: true, image: true },
    });
    if (products && !products.length) throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await Promise.all(
      products.map(async (product) => {
        await this.productHelper.handleRestoreProduct(product);
        if(product.image) await this.productHelper.handleUpdateIsDeleteImage(product, false)
      }),
    );
    throw new HttpException(RESTORE_SUCCESS, HttpStatus.OK)
  }
}
