"use client";
import React, { useState, useEffect, useRef } from "react";

// One‑page React site for psychologist Rogelio Morales
// TailwindCSS recommended. Drop this component into any Vite/Next/CRA project.
// Replace /rogelio.jpg with a real photo. Update the Google Maps embed if needed.

export default function RogelioMoralesSite() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [status, setStatus] = useState("idle");
  const [mobileOpen, setMobileOpen] = useState(false);
  // Carrusel de reseñas
  const reviews = [
    {
      name: "Marina R.",
      text: "Muy profesional y cercano. Noté cambios desde las primeras sesiones.",
    },
    {
      name: "Carlos P.",
      text: "Me ayudó a gestionar el estrés del trabajo con herramientas prácticas.",
    },
    {
      name: "Lucía G.",
      text:
        "La terapia con Rogelio ha sido un antes y un después en mi vida. Muy recomendable.",
    },
  ];
  const [currentReview, setCurrentReview] = useState(0);
  const isInteractingRef = useRef(false);
  const intervalRef = useRef(null);
  const pauseTimeoutRef = useRef(null);
  // Slider refs / estado para drag/swipe
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const startXRef = useRef(0);
  const deltaXRef = useRef(0);
  const isDraggingRef = useRef(false);
  // Modal para ver reseña completa
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

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
          mensaje: form.mensaje,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status} - ${text}`);
      }

      setStatus("success");
      setForm({ nombre: "", email: "", mensaje: "" });
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

  useEffect(() => {
    // autoplay cada 4s salvo interacción del usuario
    intervalRef.current = setInterval(() => {
      if (!isInteractingRef.current) {
        setCurrentReview((s) => (s + 1) % reviews.length);
      }
    }, 4000);
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  const markUserInteracted = (actionIndex = null) => {
    isInteractingRef.current = true;
    if (actionIndex !== null) setCurrentReview(actionIndex);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    // reanudar autoplay tras 6s de inactividad
    pauseTimeoutRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 6000);
  };

  const prevReview = () => {
    markUserInteracted();
    setCurrentReview((s) => (s - 1 + reviews.length) % reviews.length);
  };
  const nextReview = () => {
    markUserInteracted();
    setCurrentReview((s) => (s + 1) % reviews.length);
  };

  // Pointer / touch handlers para swipe (funcionan en desktop y móvil)
  const onPointerDown = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX ?? (e.touches && e.touches[0].clientX) ?? 0;
    deltaXRef.current = 0;
    if (trackRef.current) trackRef.current.style.transition = "none";
    markUserInteracted();
  };

  const onPointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.clientX ?? (e.touches && e.touches[0].clientX) ?? 0;
    deltaXRef.current = clientX - startXRef.current;
    if (trackRef.current && containerRef.current) {
      const containerW = containerRef.current.clientWidth || 1;
      const movementPercent = (deltaXRef.current / containerW) * 100;
      const offsetPercent = -currentReview * 100 + movementPercent;
      trackRef.current.style.transform = `translateX(${offsetPercent}%)`;
    }
  };

  const onPointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const containerW = containerRef.current?.clientWidth || 1;
    const moved = deltaXRef.current;
    // Umbral: 25% ancho para cambiar slide
    if (Math.abs(moved) > containerW * 0.25) {
      if (moved < 0) setCurrentReview((s) => (s + 1) % reviews.length);
      else setCurrentReview((s) => (s - 1 + reviews.length) % reviews.length);
    } else {
      // volver al slide actual (usar % para evitar gaps)
      if (trackRef.current) {
        trackRef.current.style.transition = "transform 420ms cubic-bezier(.2,.9,.2,1)";
        trackRef.current.style.transform = `translateX(${-currentReview * 100}%)`;
      }
    }
    deltaXRef.current = 0;

    // permitir que la altura vuelva a auto tras la animación (evitar "saltos")
    if (containerRef.current) {
      setTimeout(() => {
        try { containerRef.current.style.height = "auto"; } catch (e) {}
      }, 420);
    }
  };
  
  // Asegurarse que el track se reposiciona cuando cambia currentReview (autoplay o manual)
  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transition = "transform 420ms cubic-bezier(.2,.9,.2,1)";
      trackRef.current.style.transform = `translateX(${-currentReview * 100}%)`;
    }
  }, [currentReview]);

  // Ajustar la altura del contenedor al slide activo para evitar recortes en móvil
  useEffect(() => {
    const adjustHeight = () => {
      const container = containerRef.current;
      const track = trackRef.current;
      if (!container || !track) return;
      const active = track.children[currentReview];
      if (active) {
        // usar scrollHeight para contar todo el contenido y evitar recortes
        const h = active.scrollHeight;
        container.style.height = `${h}px`;
      } else {
        container.style.height = "auto";
      }
    };

    // Ajustar inmediatamente y cuando cambie tamaño del slide
    adjustHeight();

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(adjustHeight) : null;
    if (ro && trackRef.current) {
      Array.from(trackRef.current.children).forEach((child) => ro.observe(child));
    }
    window.addEventListener("resize", adjustHeight);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", adjustHeight);
    };
  }, [currentReview, reviews.length]);

  // cerrar modal con Escape y bloquear scroll mientras está abierto
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") closeModal(); };
    if (modalOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const openModal = (i) => {
    markUserInteracted(i);
    setModalIndex(i);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 palette">
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
        
        /* Fix reseñas (móvil): garantizar altura mínima y evitar overflow de texto */
        .reviews-container { min-height: 8rem; /* algo más grande para móviles */ }
        @media (min-width: 768px) { .reviews-container { min-height: 11rem; } } /* desktop */
        .reviews-track { align-items: stretch; }
        .reviews-article { box-sizing: border-box; min-height: 100%; overflow-wrap: anywhere; word-break: break-word; }
        .reviews-article p { white-space: normal; line-height: 1.35; }
        /* Suavizar transiciones de altura */
        .reviews-container { transition: height 260ms ease; will-change: height; }
        /* Modal (reseña expandida) */
        .review-modal-backdrop { background: rgba(0,0,0,0.55); }
        .review-modal { max-width: 720px; width: calc(100% - 2rem); border-radius: 12px; }
       `}</style>

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b palette">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo / Brand */}
            <a href="#inicio" className="flex items-center gap-3 no-underline">
              <span className="font-semibold tracking-tight text-lg">
                Rogelio Morales
              </span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#sobre-mi"
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sobre mí
              </a>
              <a
                href="#titulaciones"
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                Titulaciones
              </a>
              <a
                href="#resenas"
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                Reseñas
              </a>
              <a
                href="#contacto"
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                Contacto
              </a>
              <a
                href="#ubicacion"
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                Ubicación
              </a>
            </nav>

            {/* Actions: CTA + Mobile toggle */}
            <div className="flex items-center gap-3">
              <a
                href="#contacto"
                className="hidden md:inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                Pedir información
              </a>

              <button
                className="md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300"
                aria-label="Abrir menú"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((s) => !s)}
              >
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  {mobileOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile panel */}
        <div
          className={`md:hidden transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden bg-white/95 border-t ${
            mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 py-4 space-y-2">
            <a
              href="#sobre-mi"
              onClick={() => setMobileOpen(false)}
              className="block px-2 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Sobre mí
            </a>
            <a
              href="#titulaciones"
              onClick={() => setMobileOpen(false)}
              className="block px-2 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Titulaciones
            </a>
            <a
              href="#resenas"
              onClick={() => setMobileOpen(false)}
              className="block px-2 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Reseñas
            </a>
            <a
              href="#contacto"
              onClick={() => setMobileOpen(false)}
              className="block px-2 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Contacto
            </a>
            <a
              href="#ubicacion"
              onClick={() => setMobileOpen(false)}
              className="block px-2 py-2 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Ubicación
            </a>
            <a
              href="#contacto"
              onClick={() => setMobileOpen(false)}
              className="block mt-2 px-4 py-2 rounded-xl bg-gray-900 text-white text-center"
            >
              Pedir información
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="inicio" className="relative">
        <div className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-[1.2fr_.8fr] gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
              Psicología cercana en{" "}
              <span className="underline decoration-amber-400/60">
                Santa Catalina
              </span>
              , Palma
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-prose">
              Soy <strong>Rogelio Morales</strong>, psicólogo general sanitario.
              Acompaño a personas y equipos con un enfoque práctico y humano,
              combinando intervención psicológica, pedagógica y gestión de RR. HH.
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
              <strong>Universitat de les Illes Balears (UIB)</strong>. Cuento con un{" "}
              <strong>
                Máster en Gestión de Recursos Humanos, Intervención Psicológica y
                Pedagógica
              </strong>{" "}
              y un <strong>Máster en Psicología General Sanitaria</strong>.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Trabajo con enfoque integrador: evaluación, intervención y seguimiento,
              con herramientas basadas en evidencia adaptadas a cada persona. Atiendo
              ansiedad, estrés laboral, autoestima, habilidades sociales, duelo y
              otros procesos vitales.
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
                <strong>Nº colegiado:</strong> (añadir)
              </span>
            </li>
            <li className="flex gap-3">
              <span>✉️</span>
              <span>
                <strong>Email:</strong>{" "}
                <a
                  className="underline"
                  href="mailto:contacto@rogeliomorales.es"
                >
                  contacto@rogeliomorales.es
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
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border bg-white p-6">
              <h3 className="font-medium">Grado en Psicología</h3>
              <p className="text-sm text-gray-600 mt-1">
                Universitat de les Illes Balears (UIB)
              </p>
            </div>
            <div className="rounded-2xl border bg-white p-6">
              <h3 className="font-medium">
                Máster en Gestión de RR. HH., Intervención Psicológica y
                Pedagógica
              </h3>
              <p className="text-sm text-gray-600 mt-1">Universitat de les Illes Balears (UIB)</p>
            </div>
            <div className="rounded-2xl border bg-white p-6">
              <h3 className="font-medium">Máster en Psicología General Sanitaria</h3>
              <p className="text-sm text-gray-600 mt-1">Universidad Internacional de Valencia (UIV)</p>
            </div>
          </div>
        </div>
      </section>

      {/* RESEÑAS */}
      <section id="resenas" className="bg-white border-y">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Reseñas</h2>

          <div className="rounded-2xl border bg-gray-50 p-2 md:p-6">
            {/* Contenedor del slider */}
            <div
              ref={containerRef}
              className="relative overflow-hidden touch-pan-y reviews-container"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              onPointerLeave={onPointerUp}
              style={{ height: "auto", transition: "height 280ms ease" }}
            >
               {/* Track: ancho = n * 100% */}
               <div
                 ref={trackRef}
                 style={{ width: `${reviews.length * 100}%`, transform: `translateX(${-currentReview * 100}%)` }}
                 className="flex transition-transform duration-500 ease-in-out reviews-track"
               >
                 {reviews.map((r, i) => (
                  <article
                    key={i}
                    className="flex-shrink-0 w-full px-6 py-6 md:px-12 md:py-14 reviews-article flex flex-col justify-center cursor-pointer"
                    onMouseEnter={() => markUserInteracted()}
                    onFocus={() => markUserInteracted()}
                    onClick={() => openModal(i)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openModal(i); }}
                  >
                    <p className="text-gray-700 italic text-lg md:text-xl">"{r.text}"</p>
                    <p className="mt-4 font-medium">{r.name}</p>
                  </article>
                 ))}
               </div>
             </div>

            {/* Controles y puntos — estilo más discreto y profesional */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={prevReview}
                  className="rounded-lg p-2 border bg-white hover:bg-gray-100 shadow-sm"
                  aria-label="Anterior reseña"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={nextReview}
                  className="rounded-lg p-2 border bg-white hover:bg-gray-100 shadow-sm"
                  aria-label="Siguiente reseña"
                >
                  ›
                </button>
              </div>

              <div className="flex items-center gap-3">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { markUserInteracted(i); setCurrentReview(i); }}
                    aria-label={`Ver reseña ${i + 1}`}
                    className={`w-3.5 h-3.5 rounded-full ${i === currentReview ? "bg-gray-900" : "bg-gray-300"} transition`}
                  />
                ))}
              </div>
            </div>

            <div className="sr-only" aria-live="polite">
              {reviews[currentReview].name}: {reviews[currentReview].text}
            </div>
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
                <label htmlFor="mensaje" className="block text-sm font-semibold text-gray-700 mb-2">Mensaje</label>
                <textarea name="mensaje" id="mensaje" value={form.mensaje} onChange={handleChange} className="block w-full p-3 border rounded-lg focus:ring-amber-500 focus:border-amber-500 resize-y" rows={5} required />
              </div>

              <div className="mt-2 flex flex-col sm:flex-row gap-3">
                <button type="submit" className="flex-1 bg-amber-600 text-white rounded-full px-6 py-3 text-lg font-semibold shadow-md hover:bg-amber-500 transition">
                  {status === "loading" ? "Enviando..." : status === "success" ? "Mensaje Enviado" : "Enviar Mensaje"}
                </button>

                <a
                  href="https://wa.me/34680385739?text=Hola%20Rogelio%2C%20me%20gustar%C3%ADa%20solicitar%20informaci%C3%B3n"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-green-600 hover:bg-green-700 text-white"
                  aria-label="Abrir chat de WhatsApp"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 10-9 9v-2.2A6.8 6.8 0 0121 12z" />
                    <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M17 7.5l-5 5m0 0L9 9.5m3 3.0L7.5 9" />
                  </svg>
                  WhatsApp
                </a>
              </div>

              {status === "error" && <p className="mt-3 text-red-600 text-center">Ocurrió un error. Por favor, inténtalo de nuevo.</p>}

              <p className="mt-4 text-xs text-gray-500">Al enviar tus datos aceptarás la política de privacidad. Responderé en 24–48h laborables.</p>
            </form>

            {/* Tarjeta de contacto (derecha) */}
            <aside className="rounded-2xl p-6 sm:p-8 shadow-lg h-full flex flex-col justify-between"
                   style={{ background: "linear-gradient(135deg, rgba(246,235,226,0.42), rgba(255,255,255,0.9))", border: "1px solid rgba(231,216,207,0.9)" }}>
              <div>
                <h3 className="text-xl font-semibold mb-3">Contacto directo</h3>
                <p className="text-sm text-gray-700 mb-4">Teléfono, email y acceso directo al mapa. También puedes abrir el chat por WhatsApp.</p>

                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-rose-600 mt-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 10.5V6a3 3 0 013-3h4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <div>
                      <div className="text-xs text-gray-500">Teléfono</div>
                      <a href="tel:+34680385739" className="font-medium text-gray-800">+34 680 38 57 39</a>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-600 mt-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8.5V6a3 3 0 013-3h12a3 3 0 013 3v8a3 3 0 01-3 3h-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <a href="mailto:contacto@rogeliomorales.es" className="font-medium text-gray-800">contacto@rogeliomorales.es</a>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12a9 9 0 10-9 9v-2.2A6.8 6.8 0 0121 12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
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

      {/* Modal para reseña expandida */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center review-modal-backdrop" role="dialog" aria-modal="true">
          <div className="review-modal bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-semibold">Reseña de {reviews[modalIndex].name}</h3>
              <button onClick={closeModal} aria-label="Cerrar" className="text-gray-500 hover:text-gray-800">✕</button>
            </div>
            <div className="mt-4 text-gray-700">
              <p className="italic text-base">"{reviews[modalIndex].text}"</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
