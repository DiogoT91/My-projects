import { NextResponse } from "next/server";
import { createClient as createAuthClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

const serviceRoleClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(req: Request, context: any) {
  const storeId = Number(context.params?.storeId);
  if (Number.isNaN(storeId)) {
    return NextResponse.json({ error: "ID de loja inválido." }, { status: 400 });
  }

  const body = await req.json();
  const {
    name,
    street,
    city,
    state,
    zipCode,
    phoneNumber,
    timezone,
    active,
  } = body;

  if (!name || !street || !city || !state || !zipCode || !phoneNumber) {
    return NextResponse.json(
      { error: "Todos os campos obrigatórios devem ser preenchidos." },
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

  const { data, error } = await serviceRoleClient
    .from("store")
    .update({
      name,
      street,
      city,
      state,
      zip_code: zipCode,
      phone_number: phoneNumber,
      timezone,
      active_inactive_status: active,
    })
    .eq("id", storeId)
    .eq("merchant_id", merchant.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json(
      { error: "Loja não encontrada ou não pertence a este merchant." },
      { status: 404 }
    );
  }

  return NextResponse.json({ data });
}
