import { NextResponse } from "next/server";

const tableName = "incomemate_snapshots";

const getSupabaseConfig = () => {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return { url, key };
};

const missingConfig = () => NextResponse.json({
  enabled: false,
  message: "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
}, { status: 503 });

export async function GET(request: Request) {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return missingConfig();

  const requestUrl = new URL(request.url);
  const email = requestUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const response = await fetch(`${url}/rest/v1/${tableName}?user_email=eq.${encodeURIComponent(email)}&select=payload,updated_at`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to read Supabase snapshot" }, { status: response.status });
  }

  const rows = await response.json() as Array<{ payload: unknown; updated_at: string }>;
  return NextResponse.json({
    enabled: true,
    snapshot: rows[0]?.payload ?? null,
    updatedAt: rows[0]?.updated_at ?? null,
  });
}

export async function PUT(request: Request) {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return missingConfig();

  const body = await request.json() as { email?: string; snapshot?: unknown };
  if (!body.email || !body.snapshot) {
    return NextResponse.json({ error: "email and snapshot are required" }, { status: 400 });
  }

  const response = await fetch(`${url}/rest/v1/${tableName}?on_conflict=user_email`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({
      user_email: body.email,
      payload: body.snapshot,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to save Supabase snapshot" }, { status: response.status });
  }

  const rows = await response.json() as Array<{ updated_at: string }>;
  return NextResponse.json({ enabled: true, updatedAt: rows[0]?.updated_at ?? new Date().toISOString() });
}
