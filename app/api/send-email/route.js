import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { nombre, email, mensaje } = body || {};

    if (!nombre || !email || !mensaje) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const endpoint = "https://indraservervps.com/webhook-test/rogelio-send-email";

    // Use server-side env vars (no NEXT_PUBLIC) for credentials
    const user = process.env.EMAIL_USER || "";
    const pass = process.env.EMAIL_PASS || "";
    const basicAuthEnv = process.env.BASIC_AUTH; // optional precomputed "Basic ..."

    let authHeader;
    if (basicAuthEnv) {
      authHeader = basicAuthEnv;
    } else if (user && pass) {
      authHeader = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
    } else {
      return NextResponse.json(
        { error: "Configuración del servidor incorrecta: faltan credenciales" },
        { status: 500 }
      );
    }

    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        nombre,
        email,
        mensaje,
        source: "server-proxy",
      }),
      // timeout/network options can be added if needed
    });

    const text = await upstream.text();

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Error desde el servidor de envío", details: text },
        { status: upstream.status }
      );
    }

    return NextResponse.json({ ok: true, result: text }, { status: 200 });
  } catch (err) {
    console.error("send-email route error:", err);
    return NextResponse.json({ error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}