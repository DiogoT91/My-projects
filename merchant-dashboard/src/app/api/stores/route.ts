import { NextResponse } from "next/server";
import { createClient as createAuthClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

const serviceRoleClient = createServiceClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
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

  const { data, error } = await serviceRoleClient.from("store").insert([
    {
      name,
      street,
      city,
      state,
      zip_code: zipCode,
      phone_number: phoneNumber,
      timezone,
      active_inactive_status: active,
      merchant_id: merchant.id,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data }, { status: 201 });
}
