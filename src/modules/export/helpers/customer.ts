import { UserAddress } from '@prisma/client';
import { ELang } from 'src/common/enum/base';
import { EGender, ERole } from 'src/modules/user/user.enum';
import utils from 'src/utils';

export const getGender = (gender: EGender, locale: ELang) => {
  const lang = utils.getLang(locale);
  return gender === EGender.MALE ? lang.excel.gender.male : lang.excel.gender.female;
};

export const getRole = (role: ERole, locale: ELang) => {
  const lang = utils.getLang(locale);
  if (role === ERole.MANAGER) return lang.excel.role.manager;
  if (role === ERole.LEADER) return lang.excel.role.leader;
  if (role === ERole.STAFF) return lang.excel.role.staff;
  return lang.excel.role.customer;
};

export const getAddress = (address: UserAddress, locale: ELang) => {
  const lang = utils.getLang(locale);
  return locale === ELang.EN ? address.fullAddressEn : address.fullAddressVn;
};
