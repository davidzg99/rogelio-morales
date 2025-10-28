"use client";
import React, { useState, useEffect, useRef } from "react";

// One‑page React site for psychologist Rogelio Morales
// TailwindCSS recommended. Drop this component into any Vite/Next/CRA project.
// Replace /rogelio.jpg with a real photo. Update the Google Maps embed if needed.

export default function RogelioMoralesSite() {
  const [form, setForm] = useState({ nombre: "", email: "", whatsapp: "", mensaje: "" });
  const [status, setStatus] = useState("idle");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Reseñas
  const reviews = [
    {
      name: "Marina R.",
      text: "La terapia con Rogelio me ha ayudado enormemente a gestionar mi ansiedad. Su enfoque es cercano y profesional.",
    },
    {
      name: "Carlos P.",
      text: "Después de meses sintiéndome perdido, las sesiones me dieron herramientas reales para superar mi depresión.",
    },
    {
      name: "Lucía G.",
      text: "Rogelio me acompañó en un proceso de duelo muy difícil. Su empatía y profesionalidad fueron fundamentales.",
    },
    {
      name: "Ana M.",
      text: "Profesional, empático y con un método que realmente funciona. He mejorado muchísimo mi autoestima.",
    },
    {
      name: "Javier S.",
      text: "Me ayudó a superar un momento muy complicado. Las sesiones online son muy cómodas y efectivas.",
    },
    {
      name: "Elena P.",
      text: "Recomiendo totalmente sus servicios. Me ha dado las herramientas para gestionar mejor mis emociones.",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.nombre || !form.email || !form.mensaje) {
      setStatus("error");
      return;
    }
    setStatus("loading");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          whatsapp: form.whatsapp,
          mensaje: form.mensaje,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} - ${text}`);
      }

      setStatus("success");
      setForm({ nombre: "", email: "", whatsapp: "", mensaje: "" });
    } catch (err) {
      console.error("Error sending form:", err);
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

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 palette">
      {/* Espaciador para el navbar fijo */}
      <div className="h-20"></div>
      {/* Estilos de animación locales */}
      <style>{`
         /* Palette variables — ajusta estos valores si quieres otro tono carne */
         .palette {
           --surface-white: #ffffff;
           --surface-warm: #f6ebe2; /* color "carne" suave */
           --card-bg: rgba(255,255,255,0.96);
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
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-lg shadow-lg shadow-black/5' 
            : 'bg-white/70 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand */}
            <a 
              href="#inicio" 
              className="flex items-center gap-3 group no-underline"
            >
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 text-xl tracking-tight leading-none">
                  Rogelio Morales
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Psicólogo Clínico
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { href: '#sobre-mi', label: 'Sobre mí', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                { href: '#titulaciones', label: 'Titulaciones', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
                { href: '#resenas', label: 'Reseñas', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
                { href: '#contacto', label: 'Contacto', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                { href: '#ubicacion', label: 'Ubicación', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' }
              ].map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  className="group px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-200 flex items-center gap-2"
                >
                  <svg 
                    className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                  {item.label}
                </a>
              ))}
            </nav>

            {/* CTA Button + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <a
                href="#contacto"
                className="hidden lg:inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-gray-800 to-gray-700 text-white hover:from-gray-900 hover:to-gray-800 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Pedir información
              </a>

              <button
                className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                aria-label="Abrir menú"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((s) => !s)}
              >
                <svg
                  className="w-6 h-6 text-gray-700 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ transform: mobileOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                >
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden border-t ${
            mobileOpen 
              ? 'max-h-[28rem] opacity-100 border-gray-100' 
              : 'max-h-0 opacity-0 border-transparent'
          }`}
          style={{ 
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.98), rgba(255,255,255,0.95))',
            backdropFilter: 'blur(12px)'
          }}
        >
          <div className="px-6 py-5 space-y-1">
            {[
              { href: '#sobre-mi', label: 'Sobre mí', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
              { href: '#titulaciones', label: 'Titulaciones', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
              { href: '#resenas', label: 'Reseñas', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
              { href: '#contacto', label: 'Contacto', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
              { href: '#ubicacion', label: 'Ubicación', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' }
            ].map(item => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 group"
              >
                <svg 
                  className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
            <div className="pt-3">
              <a
                href="#contacto"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-gradient-to-r from-gray-800 to-gray-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Pedir información
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="inicio" className="relative">
        <div className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-[1.2fr_.8fr] gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
              Psicología clínica en{" "}
              <span className="underline decoration-amber-400/60">
                Santa Catalina
              </span>
              , Palma
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-prose">
              Soy <strong>Rogelio Morales</strong>, psicólogo general sanitario.
              Te acompaño en tu proceso terapéutico con un enfoque integrador,
              basado en la evidencia científica y adaptado a tus necesidades personales.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#contacto"
                className="rounded-xl px-5 py-3 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800"
              >
                Solicitar primera consulta
              </a>
              <a
                href="#titulaciones"
                className="rounded-xl px-5 py-3 border text-sm font-medium hover:bg-gray-100"
              >
                Ver titulaciones
              </a>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              * Consultas presenciales in Santa Catalina y online.
            </p>
          </div>
          <div className="justify-self-center">
            {/* Replace with real photo */}
            <img
              src="/rogelio.jpg"
              alt="Foto de Rogelio Morales, psicólogo"
              className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl shadow"
            />
          </div>
        </div>
      </section>

      {/* SOBRE MI */}
      <section id="sobre-mi" className="bg-white border-y">
        <div className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">Sobre mí</h2>
            <p className="text-gray-700 leading-relaxed">
              Graduado en Psicología por la{" "}
              <strong>Universitat de les Illes Balears (UIB)</strong> y{" "}
              <strong>Máster en Psicología General Sanitaria</strong> por la{" "}
              Universidad Internacional de Valencia (VIU). Estoy habilitado para ejercer
              como psicólogo sanitario y ofrecer terapia psicológica.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Trabajo con un enfoque integrador que combina diferentes corrientes terapéuticas
              basadas en la evidencia científica. Realizo evaluación, diagnóstico, intervención
              y seguimiento personalizados. Atiendo problemáticas como ansiedad, depresión,
              trauma, duelo, trastornos de la conducta alimentaria, gestión emocional,
              autoestima y otros procesos de desarrollo personal.
            </p>
          </div>
          <ul className="bg-gray-50 rounded-2xl p-6 border space-y-3 text-sm">
            <li className="flex gap-3">
              <span>🗓️</span>
              <span>
                <strong>Horario:</strong> L–V 10:00–19:00 (cita previa)
              </span>
            </li>
            <li className="flex gap-3">
              <span>📍</span>
              <span>
                <strong>Zona:</strong> Santa Catalina, Palma
              </span>
            </li>
            <li className="flex gap-3">
              <span>🌐</span>
              <span>
                <strong>Atención:</strong> Presencial y online
              </span>
            </li>
            <li className="flex gap-3">
              <span>🧾</span>
              <span>
                <strong>Nº colegiado:</strong> B-03993
              </span>
            </li>
            <li className="flex gap-3">
              <span>✉️</span>
              <span>
                <strong>Email:</strong>{" "}
                <a
                  className="underline"
                  href="mailto:rogemorales98@gmail.com"
                >
                  rogemorales98@gmail.com
                </a>
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* TITULACIONES */}
      <section id="titulaciones">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">
            Titulaciones
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border bg-white p-6">
              <h3 className="font-medium text-lg mb-2">Grado en Psicología</h3>
              <p className="text-sm text-gray-600">
                Universitat de les Illes Balears (UIB)
              </p>
            </div>
            <div className="rounded-2xl border bg-white p-6">
              <h3 className="font-medium text-lg mb-2">Máster en Psicología General Sanitaria</h3>
              <p className="text-sm text-gray-600">Universidad Internacional de Valencia (VIU)</p>
              <p className="text-xs text-gray-500 mt-2">Habilitación sanitaria para ejercer como psicólogo clínico</p>
            </div>
          </div>
          
          <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
            <h3 className="font-semibold text-lg mb-3">Áreas de intervención</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">✓</span>
                <span>Trastornos de ansiedad y estrés</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">✓</span>
                <span>Depresión y trastornos del estado de ánimo</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">✓</span>
                <span>Trauma y duelo</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">✓</span>
                <span>Trastornos de la conducta alimentaria</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">✓</span>
                <span>Autoestima y desarrollo personal</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">✓</span>
                <span>Gestión emocional y habilidades sociales</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">✓</span>
                <span>Problemas de pareja y relaciones</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">✓</span>
                <span>Trastornos del sueño</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESEÑAS */}
      <section id="resenas" className="bg-white border-y">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">
              Lo que dicen mis pacientes
            </h2>
            <p className="text-gray-600 text-sm">
              Testimonios reales de personas que han confiado en mi trabajo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-amber-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed text-sm mb-4 italic">
                  "{review.text}"
                </p>
                
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 font-semibold text-sm">
                      {review.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                    <p className="text-xs text-gray-500">Paciente verificado</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-10">Contáctame</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Formulario (izquierda) */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                  <input type="text" name="nombre" id="nombre" value={form.nombre} onChange={handleChange} className="block w-full p-3 border rounded-lg focus:ring-amber-500 focus:border-amber-500" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input type="email" name="email" id="email" value={form.email} onChange={handleChange} className="block w-full p-3 border rounded-lg focus:ring-amber-500 focus:border-amber-500" required />
                </div>
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-sm font-semibold text-gray-700 mb-2">
                  WhatsApp <span className="text-gray-500 font-normal">(opcional)</span>
                </label>
                <input 
                  type="tel" 
                  name="whatsapp" 
                  id="whatsapp" 
                  value={form.whatsapp} 
                  onChange={handleChange} 
                  placeholder="+34 600 000 000"
                  className="block w-full p-3 border rounded-lg focus:ring-amber-500 focus:border-amber-500" 
                />
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-semibold text-gray-700 mb-2">Mensaje</label>
                <textarea name="mensaje" id="mensaje" value={form.mensaje} onChange={handleChange} className="block w-full p-3 border rounded-lg focus:ring-amber-500 focus:border-amber-500 resize-y" rows={5} required />
              </div>

              <div className="mt-2 flex flex-col sm:flex-row gap-3">
                <button type="submit" className="flex-1 bg-amber-600 text-white rounded-full px-6 py-3 text-lg font-semibold shadow-md hover:bg-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  {status === "loading" ? "Enviando..." : status === "success" ? "✓ Mensaje Enviado" : "Enviar Mensaje"}
                </button>

                <a
                  href="https://wa.me/34680385739?text=Hola%20Rogelio%2C%20me%20gustar%C3%ADa%20solicitar%20informaci%C3%B3n"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white justify-center font-semibold"
                  aria-label="Abrir chat de WhatsApp"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 10-9 9v-2.2A6.8 6.8 0 0121 12z" />
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M17 7.5l-5 5m0 0L9 9.5m3 3.0L7.5 9" />
                  </svg>
                  WhatsApp
                </a>
              </div>

              {status === "success" && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-green-800">¡Mensaje enviado correctamente!</p>
                      <p className="text-sm text-green-700 mt-1">Gracias por contactarme. Te responderé lo antes posible.</p>
                    </div>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-red-800">Error al enviar el mensaje</p>
                      <p className="text-sm text-red-700 mt-1">Por favor, inténtalo de nuevo o contáctame por WhatsApp.</p>
                    </div>
                  </div>
                </div>
              )}

              <p className="mt-4 text-xs text-gray-500">Al enviar tus datos aceptarás la política de privacidad. Responderé en 24–48h laborables.</p>
            </form>

            {/* Tarjeta de contacto (derecha) */}
            <aside className="rounded-2xl p-6 sm:p-8 shadow-lg h-full flex flex-col justify-between"
                   style={{ background: "linear-gradient(135deg, rgba(246,235,226,0.42), rgba(255,255,255,0.9))", border: "1px solid rgba(231,216,207,0.9)" }}>
              <div>
                <h3 className="text-xl font-semibold mb-2">Contacto directo</h3>
                <p className="text-sm text-gray-700 mb-4">Teléfono, email y acceso directo al mapa. También puedes abrir el chat por WhatsApp.</p>

                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 10.5V6a3 3 0 013-3h4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <div>
                      <div className="text-xs text-gray-500">Teléfono</div>
                      <a href="tel:+34680385739" className="font-medium text-gray-800">+34 680 38 57 39</a>
                    </div>
                  </li>

                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8.5V6a3 3 0 013-3h12a3 3 0 013 3v8a3 3 0 01-3 3h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <a href="mailto:rogemorales98@gmail.com" className="font-medium text-gray-800">rogemorales98@gmail.com</a>
                    </div>
                  </li>

                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12a9 9 0 10-9 9v-2.2A6.8 6.8 0 0121 12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <div>
                      <div className="text-xs text-gray-500">WhatsApp</div>
                      <a href="https://wa.me/34680385739" target="_blank" rel="noopener noreferrer" className="font-medium text-gray-800">Abrir chat</a>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <div className="rounded-lg overflow-hidden border shadow-sm">
                  <iframe
                    title="Mini-mapa Santa Catalina"
                    src="https://www.google.com/maps?q=39.5718664,2.6312768&z=16&output=embed"
                    width="100%"
                    height="140"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    aria-hidden="false"
                  />
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <a href="https://www.google.com/maps?q=39.5718664,2.6312768" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-sm font-medium shadow-sm hover:bg-gray-50">
                    Ver en Maps
                  </a>

                  <a href="tel:+34680385739" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-500">
                    Llamar
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* UBICACIÓN / MAPS */}
      <section id="ubicacion" className="bg-white border-t">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Ubicación</h2>
          <p className="text-gray-600 mb-6">
            Consulta in el barrio de Santa Catalina, Palma. Fácil acceso y opciones
            de aparcamiento cercanas.
          </p>
          <div className="rounded-2xl overflow-hidden border">
            <iframe
              title="Mapa — Santa Catalina (ubicación exacta)"
              src="https://www.google.com/maps?q=39.5718664,2.6312768&z=17&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-600">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-4">
            <p className="text-center md:text-left">© {new Date().getFullYear()} Rogelio Morales – Psicólogo</p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
                <a id="privacidad" href="#" className="underline text-sm px-2 py-1 rounded hover:bg-gray-50">Privacidad</a>
                <a href="#" className="underline text-sm px-2 py-1 rounded hover:bg-gray-50">Aviso legal</a>
              </div>

              <a
                href="https://ainnovar-systems.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
                aria-label="AInnovation Systems"
              >
                <img
                  src="https://ainnovar-systems.com/ainnorvar_logo_sin_fondo.png"
                  alt="AInnovation Systems"
                  className="h-6 md:h-7"
                />
                <span className="text-xs text-gray-500 hidden sm:inline">
                  Desarrollado por AInnovation Systems
                </span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
