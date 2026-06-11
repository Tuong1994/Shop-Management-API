import { ELang, ERecordStatus } from 'src/common/enum/base';
import utils from 'src/utils';

export const getRecordStatus = (status: ERecordStatus, locale: ELang) => {
  const lang = utils.getLang(locale);
  const statuses: Record<number, string> = {
    [ERecordStatus.DRAFT]: lang.excel.recordStatus.draft,
    [ERecordStatus.ACTIVE]: lang.excel.recordStatus.active,
  };
  return statuses[status];
};
