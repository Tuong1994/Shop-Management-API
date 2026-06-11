import { Injectable } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { ELang } from 'src/common/enum/base';
import { CategoryWithImage } from './category.type';
import { PrismaService } from '../prisma/prisma.service';
import utils from 'src/utils';

@Injectable()
export class CategoryHelper {
  constructor(private prisma: PrismaService) {}

  getSelectFields(locale: ELang): Prisma.CategorySelect {
    return {
      id: true,
      nameEn: locale === ELang.EN,
      nameVn: locale === ELang.VN,
      status: true,
      isDelete: true,
      createdAt: true,
      updatedAt: true,
      image: true,
    };
  }

  convertCollection(categories: Category[], locale: ELang) {
    return categories.map((category) => ({
      ...utils.convertRecordsName<Category>(category, locale),
    }));
  }

  async handleUpdateIsDeleteImage(category: CategoryWithImage, isDelete: boolean) {
    await this.prisma.image.update({ where: { id: category.id }, data: { isDelete } });
  }

  async handleRestoreCategory(category: CategoryWithImage) {
    await this.prisma.category.update({ where: { id: category.id }, data: { isDelete: false } });
  }
}
