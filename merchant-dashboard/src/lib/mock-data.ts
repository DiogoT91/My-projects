import type { Product, Store } from "./types";

/** Dados de demonstração — substituir por API autenticada por merchant */
export const MOCK_MERCHANT_ID = 1;

export const mockStores: Store[] = [
  {
    id: 1,
    merchantId: MOCK_MERCHANT_ID,
    name: "Pizza do Bairro",
    street: "Rua das Flores, 120",
    city: "Lisboa",
    state: "Lisboa",
    zipCode: "1000-001",
    phoneNumber: "+351 912 345 678",
    timezone: "Europe/Lisbon",
    active: true,
  },
  {
    id: 2,
    merchantId: MOCK_MERCHANT_ID,
    name: "Sushi Express",
    street: "Av. da Liberdade, 45",
    city: "Porto",
    state: "Porto",
    zipCode: "4000-322",
    phoneNumber: "+351 923 456 789",
    timezone: "Europe/Lisbon",
    active: false,
  },
];

export const mockProducts: Product[] = [
  {
    id: 1,
    storeId: 1,
    name: "Pizza Margherita",
    description: "Molho de tomate, mozzarella e manjericão",
    price: 9.5,
    available: true,
  },
  {
    id: 2,
    storeId: 1,
    name: "Pizza Pepperoni",
    description: "Molho de tomate, mozzarella e pepperoni",
    price: 11.0,
    available: true,
  },
  {
    id: 3,
    storeId: 2,
    name: "Combo Sushi 12 peças",
    description: "Seleção do chef",
    price: 14.9,
    available: false,
  },
];

export function getStoresForMerchant(merchantId: number): Store[] {
  return mockStores.filter((s) => s.merchantId === merchantId);
}

export function getStoreById(id: number): Store | undefined {
  return mockStores.find((s) => s.id === id);
}

export function getProductsForStore(storeId: number): Product[] {
  return mockProducts.filter((p) => p.storeId === storeId);
}
