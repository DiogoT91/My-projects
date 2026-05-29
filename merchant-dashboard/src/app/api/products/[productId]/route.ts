import { NextResponse } from "next/server";
import { createClient as createAuthClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

const serviceRoleClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(req: Request, context: any) {
  const productId = Number(context.params?.productId);
  if (Number.isNaN(productId)) {
    return NextResponse.json({ error: "ID de produto inválido." }, { status: 400 });
  }

  const body = await req.json();
  const { name, description, price, available, storeId } = body;
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

  const { data: product, error: productError } = await serviceRoleClient
    .from("product")
    .select("id,store_id")
    .eq("id", productId)
    .single();

  if (productError || !product) {
    return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
  }

  const { data: store, error: storeError } = await serviceRoleClient
    .from("store")
    .select("merchant_id")
    .eq("id", product.store_id)
    .single();

  if (storeError || !store || store.merchant_id !== merchant.id) {
    return NextResponse.json(
      { error: "Produto não pertence a este merchant." },
      { status: 404 }
    );
  }

  const { data, error } = await serviceRoleClient
    .from("product")
    .update({
      name,
      description,
      price,
      availability_status: available,
    })
    .eq("id", productId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(req: Request, context: any) {
  const productId = Number(context.params?.productId);
  if (Number.isNaN(productId)) {
    return NextResponse.json({ error: "ID de produto inválido." }, { status: 400 });
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
    return NextResponse.json({ error: "Merchant não encontrado." }, { status: 404 });
  }

  const { data: product, error: productError } = await serviceRoleClient
    .from("product")
    .select("id,store_id")
    .eq("id", productId)
    .single();

  if (productError || !product) {
    return NextResponse.json({ error: "Produto não encontrado." }, { status: 404 });
  }

  const { data: store, error: storeError } = await serviceRoleClient
    .from("store")
    .select("merchant_id")
    .eq("id", product.store_id)
    .single();

  if (storeError || !store || store.merchant_id !== merchant.id) {
    return NextResponse.json(
      { error: "Produto não pertence a este merchant." },
      { status: 404 }
    );
  }

  const { error } = await serviceRoleClient.from("product").delete().eq("id", productId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
