import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryHelper } from './category.helper';
import { QueryDto } from 'src/common/dto/query.dto';
import { Category } from '@prisma/client';
import { ELang, ERecordStatus } from 'src/common/enum/base';
import { Paging } from 'src/common/type/base';
import { CategoryDto } from './category.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import responseMessage from 'src/common/message';
import utils from 'src/utils';

const { UPDATE_SUCCESS, REMOVE_SUCCESS, RESTORE_SUCCESS, CREATE_ERROR, NOT_FOUND, NO_DATA_RESTORE } = responseMessage;

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
    private categoryHelper: CategoryHelper,
  ) {}

  private isNotDelete = { equals: false };

  async getCategories(query: QueryDto) {
    const { keywords, sortBy, locale } = query;
    const categories = await this.prisma.category.findMany({
      where: { isDelete: this.isNotDelete },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.categoryHelper.getSelectFields(locale) },
    });
    let filterCategories: Category[] = [];
    if (keywords)
      filterCategories = categories.filter((category) =>
        locale === ELang.EN
          ? utils.filterByKeywords(category.nameEn, keywords)
          : utils.filterByKeywords(category.nameVn, keywords),
      );
    const items = this.categoryHelper.convertCollection(keywords ? filterCategories : categories, locale);
    return { totalItems: keywords ? filterCategories.length : categories.length, items };
  }

  async getCategoriesPaging(query: QueryDto) {
    const { page, limit, keywords, sortBy, locale } = query;
    let collection: Paging<Category> = utils.defaultCollection();
    const categories = await this.prisma.category.findMany({
      where: { isDelete: this.isNotDelete, status: { equals: ERecordStatus.ACTIVE } },
      orderBy: [{ updatedAt: utils.getSortBy(sortBy) ?? 'desc' }],
      select: { ...this.categoryHelper.getSelectFields(locale) },
    });
    if (keywords) {
      const filterCategories = categories.filter((category) =>
        locale === ELang.EN
          ? utils.filterByKeywords(category.nameEn, keywords)
          : utils.filterByKeywords(category.nameVn, keywords),
      );
      collection = utils.paging<Category>(filterCategories, page, limit);
    } else collection = utils.paging<Category>(categories, page, limit);
    const items = this.categoryHelper.convertCollection(collection.items, locale);
    return { ...collection, items };
  }

  async getCategory(query: QueryDto) {
    const { categoryId, locale } = query;
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId, isDelete: this.isNotDelete },
      select: { ...this.categoryHelper.getSelectFields(locale) },
    });
    const convertCategory = utils.convertRecordsName<Category>(category, locale);
    return convertCategory;
  }

  async createCategory(file: Express.Multer.File, category: CategoryDto) {
    const { nameEn, nameVn, status } = category;
    const newCategory = await this.prisma.category.create({
      data: { nameEn, nameVn, isDelete: false, status: Number(status) },
    });
    if (newCategory) {
      if (!file) return newCategory;
      const result = await this.cloudinary.upload(utils.getFileUrl(file));
      const image = utils.generateImage(result, { categoryId: newCategory.id });
      await this.prisma.image.create({ data: { ...image, isDelete: false } });
      const resCategory = await this.prisma.category.findUnique({
        where: { id: newCategory.id },
        include: { image: true },
      });
      return resCategory;
    }
    throw new HttpException(CREATE_ERROR, HttpStatus.BAD_REQUEST);
  }

  async updateCategory(query: QueryDto, file: Express.Multer.File, category: CategoryDto) {
    const { categoryId } = query;
    const { nameEn, nameVn, status } = category;
    await this.prisma.category.update({ where: { id: categoryId }, data: { nameEn, nameVn, status: Number(status) } });
    if (file) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
        select: { id: true, image: true },
      });
      const result = await this.cloudinary.upload(utils.getFileUrl(file));
      const image = utils.generateImage(result, { categoryId });
      if (category && category.image) {
        await this.cloudinary.destroy(category.image.publicId);
        await this.prisma.image.update({ where: { categoryId }, data: image });
      } else {
        await this.prisma.image.create({ data: { ...image, isDelete: false } });
      }
    }
    throw new HttpException(UPDATE_SUCCESS, HttpStatus.OK);
  }

  async removeCategories(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const categories = await this.prisma.category.findMany({
      where: { id: { in: listIds } },
      select: { id: true, image: true },
    });
    if (categories && !categories.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await this.prisma.category.updateMany({ where: { id: { in: listIds } }, data: { isDelete: true } });
    await Promise.all(
      categories.map(async (category) => {
        if (category.image) await this.categoryHelper.handleUpdateIsDeleteImage(category, true);
      }),
    );
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async removeCategoriesPermanent(query: QueryDto) {
    const { ids } = query;
    const listIds = ids.split(',');
    const categories = await this.prisma.category.findMany({
      where: { id: { in: listIds } },
      select: { image: true },
    });
    if (categories && !categories.length) throw new HttpException(NOT_FOUND, HttpStatus.NOT_FOUND);
    await Promise.all(
      categories.map(async (category) => {
        if (category.image) await this.cloudinary.destroy(category.image.publicId);
      }),
    );
    await this.prisma.category.deleteMany({ where: { id: { in: listIds } } });
    throw new HttpException(REMOVE_SUCCESS, HttpStatus.OK);
  }

  async restoreCategories() {
    const categories = await this.prisma.category.findMany({
      where: { isDelete: { equals: true } },
      select: { id: true, image: true },
    });
    if (categories && !categories.length) throw new HttpException(NO_DATA_RESTORE, HttpStatus.OK);
    await Promise.all(
      categories.map(async (category) => {
        await this.categoryHelper.handleRestoreCategory(category);
        if (category.image) await this.categoryHelper.handleUpdateIsDeleteImage(category, false);
      }),
    );
    throw new HttpException(RESTORE_SUCCESS, HttpStatus.OK);
  }
}
