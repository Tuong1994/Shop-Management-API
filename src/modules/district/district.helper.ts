import { Injectable } from '@nestjs/common';
import { District, Prisma } from '@prisma/client';
import { ELang } from 'src/common/enum/base';
import utils from 'src/utils';

@Injectable()
export class DistrictHelper {
  getSelectFields(locale: ELang): Prisma.DistrictSelect {
    return {
      id: true,
      nameEn: locale === ELang.EN,
      nameVn: locale === ELang.VN,
      code: true,
      cityCode: true,
      isDelete: true,
      createdAt: true,
      updatedAt: true,
    };
  }

  convertCollection(districts: District[], locale: ELang) {
    return districts.map((district) => ({
      ...utils.convertRecordsName<District>(district, locale),
    }));
  }
}
