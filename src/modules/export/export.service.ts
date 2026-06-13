import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExcelService } from '../excel/excel.service';
import { QueryDto } from 'src/common/dto/query.dto';
import { WorkSheetColumns } from './export.type';
import { Response } from 'express';
import { ExportHelper } from './export.helper';
import { ELang } from 'src/common/enum/base';
import utils from 'src/utils';
import moment = require('moment');

@Injectable()
export class ExportService {
  constructor(
    private prisma: PrismaService,
    private excelService: ExcelService,
    private exportHelper: ExportHelper,
  ) {}

  private isNotDelete = { equals: false };

  async userExport(query: QueryDto, res: Response) {
    const { locale } = query;
    const lang = utils.getLang(locale);
    const users = await this.prisma.user.findMany({
      where: { isDelete: this.isNotDelete },
      include: { address: true },
    });
    const exportData = users.map((user) => ({
      ...user,
      birthday: moment(user.birthday).format('DD/MM/YYYY'),
      gender: this.exportHelper.getGender(user.gender, locale),
      role: this.exportHelper.getRole(user.role, locale),
      address: user.address ? this.exportHelper.getAddress(user.address, locale) : lang.excel.others.none,
    }));
    const columns: WorkSheetColumns = [
      { header: lang.excel.header.email, key: 'email' },
      { header: lang.excel.header.userName, key: 'fullName' },
      { header: lang.excel.header.phone, key: 'phone' },
      { header: lang.excel.header.gender, key: 'gender' },
      { header: lang.excel.header.birthday, key: 'birthday' },
      { header: lang.excel.header.role, key: 'role' },
      { header: lang.excel.header.address, key: 'address' },
    ];
    const { workBook } = this.excelService.generateExcel(exportData, columns, 'Users');
    const buffer = await workBook.xlsx.writeBuffer();
    this.exportHelper.responseFile(res, buffer, 'users');
  }

  async categoryExport(query: QueryDto, res: Response) {
    const { locale } = query;
    const lang = utils.getLang(locale);
    const categories = await this.prisma.category.findMany({
      where: { isDelete: this.isNotDelete },
    });
    const exportData = categories.map((category) => ({
      ...category,
      name: locale === ELang.EN ? category.nameEn : category.nameVn,
      status: this.exportHelper.getRecordStatus(category.status, locale),
    }));
    const columns: WorkSheetColumns = [
      { header: lang.excel.header.name, key: 'name' },
      { header: lang.excel.header.status, key: 'status' },
    ];
    const { workBook } = this.excelService.generateExcel(exportData, columns, 'Categories');
    const buffer = await workBook.xlsx.writeBuffer();
    this.exportHelper.responseFile(res, buffer, 'categories');
  }

  async productExport(query: QueryDto, res: Response) {
    const { locale } = query;
    const lang = utils.getLang(locale);
    const products = await this.prisma.product.findMany({
      where: { isDelete: this.isNotDelete },
      include: { category: true },
    });
    const exportData = products.map((product) => ({
      ...product,
      name: locale === ELang.EN ? product.nameEn : product.nameVn,
      category: locale === ELang.EN ? product.category.nameEn : product.category.nameVn,
      status: this.exportHelper.getRecordStatus(product.status, locale),
      unit: this.exportHelper.getProductUnit(product.unit, locale),
      display: this.exportHelper.getProductDisplay(product.display, locale),
      storageStatus: this.exportHelper.getStorageStatus(product.storageStatus, locale),
    }));
    const columns: WorkSheetColumns = [
      { header: lang.excel.header.productName, key: 'name' },
      { header: lang.excel.header.category, key: 'category' },
      { header: lang.excel.header.unit, key: 'unit' },
      { header: lang.excel.header.display, key: 'display' },
      { header: lang.excel.header.items, key: 'items' },
      { header: lang.excel.header.boxes, key: 'boxes' },
      { header: lang.excel.header.amount, key: 'amount' },
      { header: lang.excel.header.storageStatus, key: 'storageStatus' },
      { header: lang.excel.header.status, key: 'status' },
      { header: lang.excel.header.supplier, key: 'supplier' },
      { header: lang.excel.header.cost, key: 'cost' },
      { header: lang.excel.header.price, key: 'price' },
    ];
    const { workBook } = this.excelService.generateExcel(exportData, columns, 'Products');
    const buffer = await workBook.xlsx.writeBuffer();
    this.exportHelper.responseFile(res, buffer, 'products');
  }
}
