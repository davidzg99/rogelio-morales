import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { nombre, email, whatsapp, mensaje } = body || {};

    if (!nombre || !email || !mensaje) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    // N8N webhook endpoint
    const endpoint = process.env.N8N_WEBHOOK_URL || "https://indraservervps.com/webhook/rogelio-send-email";

    // Basic Auth credentials for N8N
    const user = process.env.N8N_BASIC_AUTH_USER || "ainnovarsystems";
    const pass = process.env.N8N_BASIC_AUTH_PASS || "X9f@V7p!kD34qL8zR22hT6mW";

    const authHeader = "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");

    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        name: nombre,
        email: email,
        phone: whatsapp || "",
        message: mensaje,
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