import { NextResponse } from "next/server";
import { createClient as createAuthClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

const serviceRoleClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.json();
  const { storeId, name, description, price, available } = body;

  const storeIdNumber = Number(storeId);
  if (
    Number.isNaN(storeIdNumber) ||
    !name ||
    typeof price !== "number" ||
    !Number.isFinite(price)
  ) {
    return NextResponse.json(
      { error: "Dados do produto inválidos." },
      { status: 400 }
    );
  }

  const authClient = await createAuthClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { data: merchant, error: merchantError } = await serviceRoleClient
    .from("merchant")
    .select("id")
    .eq("email", user.email)
    .single();

  if (merchantError || !merchant) {
    return NextResponse.json(
      { error: "Merchant não encontrado." },
      { status: 404 }
    );
  }

  const { data: store, error: storeError } = await serviceRoleClient
    .from("store")
    .select("merchant_id")
    .eq("id", storeIdNumber)
    .single();

  if (storeError || !store || store.merchant_id !== merchant.id) {
    return NextResponse.json(
      { error: "Loja não encontrada ou não pertence a este merchant." },
      { status: 404 }
    );
  }

  const { data, error } = await serviceRoleClient.from("product").insert([
    {
      store_id: storeIdNumber,
      name,
      description,
      price,
      availability_status: available,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
