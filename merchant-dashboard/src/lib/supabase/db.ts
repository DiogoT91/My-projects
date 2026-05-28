import { createClient as createAuthClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import type { Product, Store } from "@/lib/types";

const serviceRoleClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type Merchant = {
  id: number;
  email: string;
};

async function getCurrentMerchant(): Promise<Merchant | null> {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  const { data, error } = await serviceRoleClient
    .from("merchant")
    .select("id,email")
    .eq("email", user.email)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

function mapStoreRow(row: any): Store {
  return {
    id: row.id,
    merchantId: row.merchant_id,
    name: row.name,
    street: row.street,
    city: row.city,
    state: row.state,
    zipCode: row.zip_code,
    phoneNumber: row.phone_number,
    timezone: row.timezone,
    active: row.active_inactive_status,
  };
}

function mapProductRow(row: any): Product {
  return {
    id: row.id,
    storeId: row.store_id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    available: row.availability_status,
  };
}

export async function getStoresForMerchant(): Promise<Store[]> {
  const merchant = await getCurrentMerchant();
  if (!merchant) {
    return [];
  }

  const { data, error } = await serviceRoleClient
    .from("store")
    .select("id,merchant_id,name,street,city,state,zip_code,phone_number,timezone,active_inactive_status")
    .eq("merchant_id", merchant.id);

  if (error || !data) {
    return [];
  }

  return data.map(mapStoreRow);
}

export async function getStoreByIdForMerchant(storeId: number): Promise<Store | null> {
  const merchant = await getCurrentMerchant();
  if (!merchant) {
    return null;
  }

  const { data, error } = await serviceRoleClient
    .from("store")
    .select("id,merchant_id,name,street,city,state,zip_code,phone_number,timezone,active_inactive_status")
    .eq("id", storeId)
    .eq("merchant_id", merchant.id)
    .single();

  if (error || !data) {
    return null;
  }

  return mapStoreRow(data);
}

export async function getProductsForStore(storeId: number): Promise<Product[]> {
  const { data, error } = await serviceRoleClient
    .from("product")
    .select("id,store_id,name,description,price,availability_status")
    .eq("store_id", storeId);

  if (error || !data) {
    return [];
  }

  return data.map(mapProductRow);
}

export async function getProductById(storeId: number, productId: number): Promise<Product | null> {
  const { data, error } = await serviceRoleClient
    .from("product")
    .select("id,store_id,name,description,price,availability_status")
    .eq("store_id", storeId)
    .eq("id", productId)
    .single();

  if (error || !data) {
    return null;
  }

  return mapProductRow(data);
}
