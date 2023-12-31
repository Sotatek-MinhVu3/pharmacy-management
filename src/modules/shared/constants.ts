export enum ERole {
  ADMIN = 'admin',
  BRANCH_ADMIN = 'branch_admin',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

export enum EUserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum EDrugUnit {
  BOTTLE = 'bottle',
  BOX = 'box',
  TUBE = 'tube',
  PELLET = 'pellet',
  BLISTER = 'blister',
}

export enum ERackType {
  TOTAL = 'total',
  BRANCH = 'branch',
  BRANCH_WAREHOUSE = 'branch_warehouse',
}

export enum EOrderStatus {
  CREATED = 'created',
  APPROVED = 'approved',
  DELIVERED = 'delivered',
  DONE = 'done',
  REJECTED = 'rejected',
}
