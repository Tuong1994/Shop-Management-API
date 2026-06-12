import { Injectable } from '@nestjs/common';
import { ELang, ERecordStatus } from 'src/common/enum/base';
import { EGender, ERole } from '../user/user.enum';
import { UserAddress } from '@prisma/client';
import { EProductDisplay, EProductUnit, EStorageStatus } from '../product/product.enum';
import { Response } from 'express';
import { Buffer } from 'exceljs';
import utils from 'src/utils';

@Injectable()
export class ExportHelper {
  private resHeaderContentTypeValue = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  private resHeaderContentDispositionValue = 'attachment; filename=';

  getRecordStatus(status: ERecordStatus, locale: ELang) {
    const lang = utils.getLang(locale);
    const statuses: Record<number, string> = {
      [ERecordStatus.DRAFT]: lang.excel.recordStatus.draft,
      [ERecordStatus.ACTIVE]: lang.excel.recordStatus.active,
    };
    return statuses[status];
  }

  getGender(gender: EGender, locale: ELang) {
    const lang = utils.getLang(locale);
    return gender === EGender.MALE ? lang.excel.gender.male : lang.excel.gender.female;
  }

  getRole(role: ERole, locale: ELang) {
    const lang = utils.getLang(locale);
    if (role === ERole.MANAGER) return lang.excel.role.manager;
    if (role === ERole.LEADER) return lang.excel.role.leader;
    return lang.excel.role.staff;
  }

  getAddress(address: UserAddress, locale: ELang) {
    return locale === ELang.EN ? address.fullAddressEn : address.fullAddressVn;
  }

  getStorageStatus(status: EStorageStatus, locale: ELang) {
    const lang = utils.getLang(locale);
    return status === EStorageStatus.IN_STOCK ? lang.excel.storageStatus.inStock : lang.excel.storageStatus.outOfStock;
  }

  getProductUnit(unit: EProductUnit, locale: ELang) {
    const lang = utils.getLang(locale);
    const units: Record<number, string> = {
      [EProductUnit.KG]: lang.excel.productUnit.kg,
      [EProductUnit.BOX]: lang.excel.productUnit.box,
      [EProductUnit.BOTTLE]: lang.excel.productUnit.bottle,
      [EProductUnit.PACK]: lang.excel.productUnit.pack,
      [EProductUnit.KEG]: lang.excel.productUnit.keg,
      [EProductUnit.PIECE]: lang.excel.productUnit.piece,
      [EProductUnit.CAN]: lang.excel.productUnit.can,
      [EProductUnit.BAG]: lang.excel.productUnit.bag,
      [EProductUnit.BAR]: lang.excel.productUnit.bar,
      [EProductUnit.JAR]: lang.excel.productUnit.jar,
      [EProductUnit.TUB]: lang.excel.productUnit.tub,
      [EProductUnit.SHAKER]: lang.excel.productUnit.shaker,
      [EProductUnit.LOAF]: lang.excel.productUnit.loaf,
      [EProductUnit.TUBE]: lang.excel.productUnit.tube,
    };
    return units[unit];
  }

  getProductDisplay(display: EProductDisplay, locale: ELang) {
    const lang = utils.getLang(locale);
    const displays: Record<number, string> = {
      [EProductDisplay.FREEZER]: lang.excel.productDisplay.freezer,
      [EProductDisplay.FRIDGE]: lang.excel.productDisplay.fridge,
      [EProductDisplay.SHELF]: lang.excel.productDisplay.shelf,
    };
    return displays[display];
  }

  responseFile(res: Response, buffer: Buffer, fileName: string) {
    res.setHeader('Content-Type', this.resHeaderContentTypeValue);
    res.setHeader('Content-Disposition', this.resHeaderContentDispositionValue + `${fileName}.xlsx`);
    res.send(buffer);
  }
}
