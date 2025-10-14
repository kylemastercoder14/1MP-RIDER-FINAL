import {
  Address,
  Order,
  OrderItem,
  Product,
  Vendor,
  VendorAddress,
} from "@prisma/client";

export interface OrderWithProps extends Order {
  orderItem: (OrderItem & {
    product: Product;
    vendor: Vendor & {
      vendorAddress: VendorAddress[];
    };
  })[];
  address: Address;
}
