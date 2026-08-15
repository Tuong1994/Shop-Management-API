import { Product } from '@prisma/client';
import { EProductType, EStorageStatus } from '../../src/modules/product/product.enum';
import { ERecordStatus } from '../../src/common/enum/base';
import { productData } from './data/product';
import { furnitureData } from './data/furniture';
import { paintData } from './data/paint';
import { floorData } from './data/floor';
import { toolData } from './data/tool';
import { vehicleData } from './data/vehicle';

const items = [...productData, ...furnitureData, ...paintData, ...floorData, ...toolData, ...vehicleData];

const products: Product[] = [...items].map(
  ({ nameEn, nameVn, descriptionEn, descriptionVn, company, display, unit, items, categoryId, price, type }, idx) => {
    return {
      id: `P_${idx + 1}`,
      nameEn,
      nameVn,
      descriptionEn,
      descriptionVn,
      unit,
      display,
      type,
      items,
      categoryId,
      cost: type === EProductType.PRODUCT ? price : null,
      price: type === EProductType.PRODUCT ? price + 0.3 : price,
      boxes: type === EProductType.PRODUCT ? 10 : null,
      amount: items ? items * 10 : null,
      supplier: company,
      status: ERecordStatus.ACTIVE,
      storageStatus: EStorageStatus.IN_STOCK,
      isNew: false,
      isDelete: false,
      updatedAt: new Date(),
      createdAt: new Date(),
    };
  },
);

export default products;
