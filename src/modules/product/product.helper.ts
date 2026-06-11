import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { QueryDto } from 'src/common/dto/query.dto';
import { ELang, ERecordStatus } from 'src/common/enum/base';
import utils from 'src/utils';
import { ProductDto } from './product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ProductWithImage } from './product.type';

@Injectable()
export class ProductHelper {
  constructor(private prisma: PrismaService) {}

  isNotDelete = { equals: false };

  getSelectFields(locale: ELang): Prisma.ProductSelect {
    return {
      id: true,
      nameEn: locale === ELang.EN,
      nameVn: locale === ELang.VN,
      unit: true,
      display: true,
      cost: true,
      price: true,
      status: true,
      items: true,
      boxes: true,
      amount: true,
      storageStatus: true,
      supplier: true,
      isNew: true,
      isDelete: true,
      categoryId: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  filterProducts(query: QueryDto): Prisma.ProductWhereInput {
    const { unit, status, storageStatus, supplier, display, categoryId } = query;
    return {
      AND: [
        { categoryId },
        { supplier },
        { isDelete: this.isNotDelete },
        { unit: unit && Number(unit) },
        { storageStatus: storageStatus && Number(storageStatus) },
        { display: display && Number(display) },
        status
          ? Number(status) !== ERecordStatus.ALL
            ? { status: Number(status) }
            : {}
          : { status: ERecordStatus.ACTIVE },
      ],
    };
  }

  convertCollection(products: Product[], locale: ELang) {
    return products.map((product) => ({
      ...utils.convertRecordsName<Product>(product, locale),
    }));
  }

  createUpdateData(product: ProductDto) {
    const {
      nameEn,
      nameVn,
      cost,
      price,
      unit,
      display,
      supplier,
      boxes,
      items,
      status,
      storageStatus,
      amount,
      categoryId,
    } = product;
    return {
      nameEn,
      nameVn,
      cost: Number(cost),
      price: Number(price),
      unit: Number(unit),
      display: Number(display),
      boxes: Number(boxes),
      items: Number(items),
      status: Number(status),
      storageStatus: Number(storageStatus),
      amount: Number(amount),
      supplier,
      categoryId,
    };
  }

  async handleUpdateIsDeleteImage(product: ProductWithImage, isDelete: boolean) {
    await this.prisma.image.update({ where: { productId: product.id }, data: { isDelete } });
  }

  async handleRestoreProduct(product: ProductWithImage) {
    await this.prisma.product.update({ where: { id: product.id }, data: { isDelete: false } });
  }
}
