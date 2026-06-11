import { Category } from '@prisma/client';
import { ERecordStatus } from '../../src/common/enum/base';

const items = [
  { nameEn: 'Groceries', nameVn: 'Tạp hóa / Đồ khô' },
  { nameEn: 'Breakfast & Sweets', nameVn: 'Đồ ăn sáng & Bánh kẹo' },
  { nameEn: 'Snacks & Sides', nameVn: 'Đồ ăn vặt & Món phụ' },
  { nameEn: 'Drinks & Beverages', nameVn: 'Nước giải khát' },
  { nameEn: 'Dairy & Chilled Products', nameVn: 'Sản phẩm từ sữa & Đồ mát' },
  { nameEn: 'Frozen Food', nameVn: 'Đồ đông lạnh' },
  { nameEn: 'Fresh Meat & Seafood', nameVn: 'Thịt tươi & Hải sản' },
  { nameEn: 'Ready Meals & Pastries', nameVn: 'Thức ăn nhanh & Bánh mặn' },
  { nameEn: 'Cleaning Supplies & Chemicals', nameVn: 'Chất tẩy rửa & Hóa chất' },
  { nameEn: 'Personal Care', nameVn: 'Chăm sóc cá nhân' },
  { nameEn: 'Alcohol & Liquor', nameVn: 'Đồ uống có cồn & Rượu mạnh' },
  { nameEn: 'Books & Stationery', nameVn: 'Sách & Văn phòng phẩm' },
  { nameEn: 'Pet Food', nameVn: 'Thức ăn thú cưng' },
];

const categories: Category[] = [...items].map(({ nameEn, nameVn }, idx) => ({
  id: `C_${idx + 1}`,
  nameEn,
  nameVn,
  isDelete: false,
  status: ERecordStatus.ACTIVE,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export default categories