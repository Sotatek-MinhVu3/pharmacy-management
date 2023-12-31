import { AdminEntity } from './admin.entity';
import { BranchAdminEntity } from './branch-admin.entity';
import { BranchEntity } from './branch.entity';
import { CategoryEntity } from './category.entity';
import { CustomerEntity } from './customer.entity';
import { DrugTypeEntity } from './drug-type.entity';
import { DrugEntity } from './drug.entity';
import { OrderDrugEntity } from './order-drug.entity';
import { OrderEntity } from './order.entity';
import { RackDrugEntity } from './rack-drug.entity';
import { RackEntity } from './rack.entity';
import { StaffEntity } from './staff.entity';
import { SupplierEntity } from './supplier.entity';
import { UserEntity } from './user.entity';

export const entities = [
  BranchEntity,
  UserEntity,
  SupplierEntity,
  DrugEntity,
  CategoryEntity,
  DrugTypeEntity,
  AdminEntity,
  BranchAdminEntity,
  StaffEntity,
  CustomerEntity,
  RackEntity,
  RackDrugEntity,
  OrderEntity,
  OrderDrugEntity,
];
