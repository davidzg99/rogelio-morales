"use client";
import React, { useState, useEffect } from "react";

// One‑page React site for psychologist Rogelio Morales
// TailwindCSS recommended. Drop this component into any Vite/Next/CRA project.
// Replace /rogelio.jpg with a real photo. Update the Google Maps embed if needed.

export default function RogelioMoralesSite() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    // Front‑end validation
    if (!form.nombre || !form.email || !form.mensaje) {
      setStatus("error");
      return;
    }
    setStatus("loading");

    try {
      // TODO: Wire to backend (e.g., n8n webhook, Formspree, Airtable, email API)
      // For now we simulate a successful submission.
      await new Promise((res) => setTimeout(res, 900));
      setStatus("success");
      setForm({ nombre: "", email: "", mensaje: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("section[id]"));
    sections.forEach((el, i) => {
      el.classList.add("reveal");
      // stagger
      el.style.transitionDelay = `${i * 90}ms`;
    });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            // comentar la siguiente línea si no quieres que desaparezcan al salir
            // entry.target.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0.12 }
    );

    sections.forEach((s) => obs.observe(s));
    return () => {
      obs.disconnect();
      sections.forEach((s) => {
        s.classList.remove("reveal", "is-visible");
        s.style.transitionDelay = "";
      });
    };
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 palette">
      {/* Estilos de animación locales */}
      <style>{`
        /* Palette variables — ajusta estos valores si quieres otro tono carne */
        .palette {
          --surface-white: #ffffff;
          --surface-warm: #f6ebe2; /* color "carne" suave */
          --card-bg: rgba(255,255,255,0.92);
          --border-soft: #e7d8cf;
          --muted: #6b6b6b;
          --heading: #111827;
        }

        /* Fondo principal: sutil degradado blanco -> carne */
        .palette {
          background: linear-gradient(180deg, var(--surface-white) 0%, var(--surface-warm) 100%);
        }

        /* Reemplaza visualmente los utilitarios bg-white / bg-gray-50 para armonizar la paleta */
        .palette .bg-white { background-color: var(--card-bg) !important; }
        .palette .bg-gray-50 { background-color: rgba(246,235,226,0.6) !important; }

        /* Bordes más cálidos */
        .palette .border, .palette .border-t, .palette .border-y {
          border-color: var(--border-soft) !important;
        }

        /* Texto: encabezados y muted */
        .palette .text-gray-700 { color: var(--muted) !important; }
        .palette h1, .palette h2, .palette h3 { color: var(--heading) !important; }

        /* Cards y contenedores: ligero blur + sombra y fondo cálido */
        .palette .rounded-2xl.border, .palette .rounded-2xl.overflow-hidden {
          background-color: var(--card-bg) !important;
          box-shadow: 0 6px 18px rgba(20,20,20,0.04);
        }

        /* Enlaces y botones: opción para usar un acento cálido si deseas */
        .palette a:hover { opacity: 0.92; }

        /* Animación de reveal */
        .reveal { opacity: 0; transform: translateY(18px); transition: opacity .65s cubic-bezier(.2,.9,.2,1), transform .65s cubic-bezier(.2,.9,.2,1); }
        .reveal.is-visible { opacity: 1; transform: translateY(0); }
        @media (prefers-reduced-motion: reduce) { .reveal { transition: none !important; transform: none !important; } }
      `}</style>

      {/* NAVBAR */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b">
        <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#inicio" className="font-semibold tracking-tight text-xl">Rogelio Morales</a>
          <ul className="hidden md:flex items-center gap-6 text-sm">
            <li><a className="hover:opacity-80" href="#sobre-mi">Sobre mí</a></li>
            <li><a className="hover:opacity-80" href="#titulaciones">Titulaciones</a></li>
            <li><a className="hover:opacity-80" href="#resenas">Reseñas</a></li>
            <li><a className="hover:opacity-80" href="#contacto">Contacto</a></li>
            <li><a className="hover:opacity-80" href="#ubicacion">Ubicación</a></li>
          </ul>
          <a href="#contacto" className="ml-4 inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 active:scale-[.99]">Pedir información</a>
        </nav>
      </header>

      {/* HERO */}
      <section id="inicio" className="relative">
        <div className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-[1.2fr_.8fr] gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
              Psicología cercana en <span className="underline decoration-amber-400/60">Santa Catalina</span>, Palma
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-prose">
              Soy <strong>Rogelio Morales</strong>, psicólogo general sanitario. Acompaño a personas y equipos con un enfoque práctico y humano, combinando intervención psicológica, pedagógica y gestión de RR. HH.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#contacto" className="rounded-xl px-5 py-3 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800">Solicitar primera consulta</a>
              <a href="#titulaciones" className="rounded-xl px-5 py-3 border text-sm font-medium hover:bg-gray-100">Ver titulaciones</a>
            </div>
            <p className="mt-3 text-xs text-gray-500">* Consultas presenciales en Santa Catalina y online.</p>
          </div>
          <div className="justify-self-center">
            {/* Replace with real photo */}
            <img src="/rogelio.jpg" alt="Foto de Rogelio Morales, psicólogo" className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl shadow" />
          </div>
        </div>
      </section>

      {/* SOBRE MI */}
      <section id="sobre-mi" className="bg-white border-y">
        <div className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Sobre mí</h2>
            <p className="text-gray-700 leading-relaxed">
              Graduado en Psicología por la <strong>Universitat de les Illes Balears (UIB)</strong>. Cuento con un <strong>Máster en Gestión de Recursos Humanos, Intervención Psicológica y Pedagógica</strong> y un <strong>Máster en Psicología General Sanitaria</strong>.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Trabajo con enfoque integrador: evaluación, intervención y seguimiento, con herramientas basadas en evidencia adaptadas a cada persona. Atiendo ansiedad, estrés laboral, autoestima, habilidades sociales, duelo y otros procesos vitales.
            </p>
          </div>
          <ul className="bg-gray-50 rounded-2xl p-6 border space-y-3 text-sm">
            <li className="flex gap-3"><span>🗓️</span><span><strong>Horario:</strong> L–V 10:00–19:00 (cita previa)</span></li>
            <li className="flex gap-3"><span>📍</span><span><strong>Zona:</strong> Santa Catalina, Palma</span></li>
            <li className="flex gap-3"><span>🌐</span><span><strong>Atención:</strong> Presencial y online</span></li>
            <li className="flex gap-3"><span>🧾</span><span><strong>Nº colegiado:</strong> (añadir)</span></li>
            <li className="flex gap-3"><span>✉️</span><span><strong>Email:</strong> <a className="underline" href="mailto:contacto@rogeliomorales.es">contacto@rogeliomorales.es</a></span></li>
          </ul>
        </div>
      </section>

      {/* TITULACIONES */}
      <section id="titulaciones">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Titulaciones</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border bg-white p-6">
              <h3 className="font-medium">Grado en Psicología</h3>
              <p className="text-sm text-gray-600 mt-1">Universitat de les Illes Balears (UIB)</p>
            </div>
            <div className="rounded-2xl border bg-white p-6">
              <h3 className="font-medium">Máster en Gestión de RR. HH., Intervención Psicológica y Pedagógica</h3>
              <p className="text-sm text-gray-600 mt-1">(indicar centro)</p>
            </div>
            <div className="rounded-2xl border bg-white p-6">
              <h3 className="font-medium">Máster en Psicología General Sanitaria</h3>
              <p className="text-sm text-gray-600 mt-1">(indicar centro)</p>
            </div>
          </div>
        </div>
      </section>

      {/* RESEÑAS */}
      <section id="resenas" className="bg-white border-y">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Reseñas</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[

              {
                name: "Marina R.",
                text:
                  "Muy profesional y cercano. Noté cambios desde las primeras sesiones.",
              },
              {
                name: "Carlos P.",
                text:
                  "Me ayudó a gestionar el estrés del trabajo con herramientas prácticas.",
              },
              {
                name: "Lucía G.",
                text:
                  "La terapia con Rogelio ha sido un antes y un después en mi vida. Muy recomendable.",
              },
            ].map((r, i) => (
              <div key={i} className="rounded-2xl border bg-gray-50 p-6">
                <p className="text-gray-700 italic">"{r.text}"</p>
                <p className="mt-4 font-medium">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Contacto</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Tu mejor email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Mensaje</label>
                <textarea
                  name="mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  rows={5}
                  className="mt-1 w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Cuéntame brevemente tu consulta"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl px-5 py-3 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Enviando…" : "Enviar"}
              </button>
              {status === "success" && (
                <p className="text-sm text-green-600">¡Mensaje enviado! Te contactaré pronto.</p>
              )}
              {status === "error" && (
                <p className="text-sm text-red-600">Revisa los campos o inténtalo de nuevo.</p>
              )}
              <p className="text-[11px] text-gray-500">
                Al enviar aceptas nuestra <a href="#privacidad" className="underline">política de privacidad</a>. Tus datos solo se usarán para responder a tu consulta.
              </p>
            </form>
          </div>

          <div className="bg-white rounded-2xl border p-6">
            <h3 className="font-medium">Contacto directo</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li><strong>Tel:</strong> <a className="underline" href="tel:+34XXXXXXXXX">+34 XXX XX XX XX</a></li>
              <li><strong>Email:</strong> <a className="underline" href="mailto:contacto@rogeliomorales.es">contacto@rogeliomorales.es</a></li>
              <li><strong>Dirección:</strong> Santa Catalina, 07013 Palma</li>
            </ul>
            <a href="#ubicacion" className="mt-4 inline-flex items-center justify-center rounded-xl px-4 py-2 border text-sm font-medium hover:bg-gray-50">Ver mapa</a>
          </div>
        </div>
      </section>

      {/* UBICACIÓN / MAPS */}
      <section id="ubicacion" className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Ubicación</h2>
          <p className="text-gray-600 mb-6">Consulta en el barrio de Santa Catalina, Palma. Fácil acceso y opciones de aparcamiento cercanas.</p>
          <div className="rounded-2xl overflow-hidden border">
            <iframe
              title="Mapa Santa Catalina Palma"
              src="https://www.google.com/maps?q=Santa%20Catalina%2C%20Palma%20de%20Mallorca&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-gray-600 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Rogelio Morales – Psicólogo</p>
          <div className="flex items-center gap-4">
            <div className="flex gap-4">
              <a id="privacidad" href="#" className="underline">Privacidad</a>
              <a href="#" className="underline">Aviso legal</a>
            </div>
            <a
              href="https://ainnovar-systems.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3"
              aria-label="AInnovation Systems"
            >
              <img
                src="https://ainnovar-systems.com/ainnorvar_logo_sin_fondo.png"
                alt="AInnovation Systems"
                className="h-7"
              />
              <span className="text-xs text-gray-500">Desarrollado por AInnovation Systems</span>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
