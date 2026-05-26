export type Merchant = {
  id: number;
  email: string;
};

export type Store = {
  id: number;
  merchantId: number;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  timezone: string;
  active: boolean;
};

export type Product = {
  id: number;
  storeId: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
};
