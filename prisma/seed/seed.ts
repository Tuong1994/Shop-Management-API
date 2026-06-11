import { prisma } from '../../src/lib/prisma';
import users from './user.seed';
import userAddresses from './user-address.seed';
import userPermissions from './user-permission';
import cities from './city.seed';
import districts from './district.seed';
import wards from './ward.seed';
import categories from './category.seed';
import products from './product.seed';

const main = async () => {
  console.log("Deleting old data...")

  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.ward.deleteMany();
  await prisma.district.deleteMany();
  await prisma.city.deleteMany();
  await prisma.userPermission.deleteMany();
  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();

  console.log("Creating new data...")

  await prisma.user.createMany({ data: users });
  await prisma.userAddress.createMany({ data: userAddresses });
  await prisma.userPermission.createMany({ data: userPermissions });
  await prisma.city.createMany({ data: cities });
  await prisma.district.createMany({ data: districts });
  await prisma.ward.createMany({ data: wards });
  await prisma.category.createMany({ data: categories });
  await prisma.product.createMany({ data: products });
};

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.log(error);
    prisma.$disconnect();
  })
  .finally(() => prisma.$disconnect());
