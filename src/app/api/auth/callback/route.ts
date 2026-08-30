import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // On user creation, insert into users table and check if first-time user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, onboarding_completed")
      .eq("id", user.id)
      .single();

    if (!existingUser) {
      // First-time user — insert into users table and redirect to onboarding
      await supabase.from("users").insert({
        id: user.id,
        email: user.email,
        onboarding_completed: false,
      });
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    if (!existingUser.onboarding_completed) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  const redirectUrl = new URL(next, request.url);
  return NextResponse.redirect(redirectUrl);
}