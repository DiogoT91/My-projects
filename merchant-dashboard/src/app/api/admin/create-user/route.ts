import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let email = body?.email;
    const password = body?.password;
    const name = body?.name;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    if (typeof email === "string") {
      email = email.trim().toLowerCase();
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Endereço de email inválido" }, { status: 400 });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true,
    });

    if (error) {
      console.error("createUser error:", error);
      return NextResponse.json(
        { error: JSON.stringify(error) || error.message || "Erro ao criar utilizador" },
        { status: 400 }
      );
    }

    const { error: merchantError } = await supabaseAdmin.from("merchant").insert([
      {
        email,
        password: passwordHash,
      },
    ]);

    if (merchantError) {
      console.error("merchant insert error:", merchantError);
      const userId = data?.user?.id;
      if (userId) {
        const { error: cleanupError } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (cleanupError) {
          console.error("cleanup deleteUser error:", cleanupError);
        }
      }

      return NextResponse.json(
        { error: JSON.stringify(merchantError) || merchantError.message || "Erro ao gravar merchant" },
        { status: 500 }
      );
    }

    console.log("createUser success:", data);
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || "Server error" }, { status: 500 });
  }
}
