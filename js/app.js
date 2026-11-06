// ============================================================================
// MOTOR INTERACTIVO V4 "CIENCIALAB / ASTRONAUTA" — FISICOQUÍMICA UNAJ
// - Transición de navegación al scroll con despliegue de partículas atómicas
// - Barra superior sticky minimalista mostrando solo el título de la unidad activa
// - Reproductor Híbrido Integrado Anti-Error 153 (YouTube HD + Clase Interactiva)
// - 6 Simuladores Interactivos Neon de Alta Precisión en HTML5 Canvas
// ============================================================================

(function () {
  "use strict";

  var currentAtmosphere = "u6";
  var activeSectionId = "parcial";

  // Metadatos e iconos SVG modernos para cada sección/unidad
  var SECTION_META = {
    parcial: {
      title: "Estructura y Modelo 2º Parcial",
      badge: "Hoja de Ruta · 10 Pts",
      color: "#a855f7",
      atmo: "u6",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg>'
    },
    formulas: {
      title: "Hoja de Fórmulas Maestra",
      badge: "Ecuaciones y Despejes",
      color: "#22d3ee",
      atmo: "u7",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="3"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="11" x2="10" y2="11"/><line x1="14" y1="11" x2="16" y2="11"/><line x1="8" y1="16" x2="16" y2="16"/></svg>'
    },
    unidad6: {
      title: "Unidad 6: Electricidad y Bioelectricidad",
      badge: "Unidad 6 · 2 Puntos",
      color: "#38bdf8",
      atmo: "u6",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
    },
    unidad7: {
      title: "Unidad 7: Soluciones, pH y Buffers",
      badge: "Unidad 7 · 6 Puntos",
      color: "#34d399",
      atmo: "u7",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v7.31L4.72 18.55A2 2 0 0 0 6.46 21.5h11.08a2 2 0 0 0 1.74-2.95L14 9.31V2"/><line x1="8.5" y1="2" x2="15.5" y2="2"/><path d="M7 15h10"/></svg>'
    },
    unidad8: {
      title: "Unidad 8: Fluidos, Circulación y Edema",
      badge: "Unidad 8 · 2 Puntos",
      color: "#fb7185",
      atmo: "u8",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l1.5-3 2 4.5 1.5-1.5h5.27"/></svg>'
    },
    laboratorio: {
      title: "Simuladores Interactivos y Calculadoras",
      badge: "6 Simuladores en Vivo",
      color: "#c084fc",
      atmo: "u6",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)"/></svg>'
    },
    ejercicios: {
      title: "Prácticas Resueltas",
      badge: "Campus + Guía",
      color: "#fbbf24",
      atmo: "u8",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>'
    },
    autoevaluacion: {
      title: "Autoevaluación Interactiva",
      badge: "Práctica de Examen",
      color: "#34d399",
      atmo: "u7",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>'
    }
  };

  var SECTION_ORDER = ["parcial", "formulas", "unidad6", "unidad7", "unidad8", "laboratorio", "ejercicios", "autoevaluacion"];

  // Helper seguro para rectángulos redondeados en cualquier navegador
  function drawRoundRect(ctx, x, y, w, h, r, fill, stroke) {
    var radius = Math.min(r, w * 0.5, h * 0.5);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  // Helper para dibujar flechas vectoriales luminosas estilo CienciaLab (Imagen 3)
  function drawNeonVector(ctx, x1, y1, x2, y2, color, lineWidth, label) {
    var headLen = 9;
    var angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth || 2.5;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    if (label) {
      ctx.font = "bold 11px Outfit, Space Grotesk, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, (x1 + x2) * 0.5, Math.min(y1, y2) - 8);
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------------------
  // 1. NAVEGACIÓN, TRANSICIÓN LATERAL CON SCROLL Y PARTÍCULAS ATÓMICAS
  // ---------------------------------------------------------------------------
  var scrollMorphTarget = 0;
  var scrollMorphCurrent = 0;
  var lastScrollY = 0;
  var scrollVelocity = 0;
  var activeUnitProgress = 0;

  function navigateToSection(secId) {
    var target = document.getElementById("sec-" + secId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setActiveTabButton(secId);
    updateAtmosphereForSection(secId);
  }
  window.navigateToSection = navigateToSection;

  function setActiveTabButton(secId) {
    activeSectionId = secId;
    var buttons = document.querySelectorAll("[data-tab]");
    for (var j = 0; j < buttons.length; j++) {
      if (buttons[j].getAttribute("data-tab") === secId) {
        buttons[j].classList.add("active");
      } else {
        buttons[j].classList.remove("active");
      }
    }

    // Actualizar el título de la unidad activa en la barra superior sticky
    var meta = SECTION_META[secId] || SECTION_META.parcial;
    var stickyTitleEl = document.getElementById("stickyActiveUnitTitle");
    var stickyBadgeEl = document.getElementById("stickyActiveUnitBadge");
    var stickyIconEl = document.getElementById("stickyActiveUnitIcon");
    if (stickyTitleEl && stickyTitleEl.innerText !== meta.title) {
      stickyTitleEl.style.opacity = "0";
      stickyTitleEl.style.transform = "translateY(5px)";
      setTimeout(function () {
        stickyTitleEl.innerText = meta.title;
        if (stickyBadgeEl) stickyBadgeEl.innerText = meta.badge;
        if (stickyIconEl) stickyIconEl.innerHTML = meta.icon;
        stickyTitleEl.style.opacity = "1";
        stickyTitleEl.style.transform = "translateY(0)";
      }, 110);
    }

    // Actualizar posición del nodo atómico en el sidebar izquierdo
    var idx = SECTION_ORDER.indexOf(secId);
    var spineNode = document.getElementById("atomicSpineNode");
    if (spineNode && idx !== -1) {
      var pct = (idx / Math.max(1, SECTION_ORDER.length - 1)) * 88 + 4;
      spineNode.style.top = pct + "%";
    }
  }

  function updateAtmosphereForSection(secId) {
    var bg6 = document.getElementById("bg-layer-u6");
    var bg7 = document.getElementById("bg-layer-u7");
    var bg8 = document.getElementById("bg-layer-u8");
    var badge = document.getElementById("atmosphereBadge");
    if (!bg6 || !bg7 || !bg8) return;

    bg6.classList.remove("active");
    bg7.classList.remove("active");
    bg8.classList.remove("active");

    if (secId === "unidad7" || secId === "formulas" || secId === "autoevaluacion") {
      bg7.classList.add("active");
      currentAtmosphere = "u7";
      if (badge) {
        badge.innerHTML = '<svg class="w-3.5 h-3.5 inline mr-1 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v7.31L4.72 18.55A2 2 0 0 0 6.46 21.5h11.08a2 2 0 0 0 1.74-2.95L14 9.31V2"/><line x1="8.5" y1="2" x2="15.5" y2="2"/></svg> Atmósfera: Soluciones, pH y Equilibrio Molecular';
      }
    } else if (secId === "unidad8" || secId === "ejercicios") {
      bg8.classList.add("active");
      currentAtmosphere = "u8";
      if (badge) {
        badge.innerHTML = '<svg class="w-3.5 h-3.5 inline mr-1 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg> Atmósfera: Dinámica de Fluidos y Microcirculación';
      }
    } else {
      bg6.classList.add("active");
      currentAtmosphere = "u6";
      if (badge) {
        badge.innerHTML = '<svg class="w-3.5 h-3.5 inline mr-1 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Atmósfera: Bioelectricidad y Sinapsis Neuronal';
      }
    }
  }

  function onScrollUpdate() {
    var sy = window.scrollY || window.pageYOffset || 0;
    var dy = sy - lastScrollY;
    lastScrollY = sy;
    scrollVelocity = Math.max(-45, Math.min(45, scrollVelocity * 0.6 + dy * 0.4));

    // Progreso de transición (0 = barra arriba, 1 = barra desplegada en lateral izquierdo)
    scrollMorphTarget = Math.min(1, Math.max(0, (sy - 75) / 260));

    // Detectar qué sección se está mirando actualmente
    var checkPos = sy + window.innerHeight * 0.30;
    var activeSec = "parcial";
    var activeEl = null;
    for (var i = 0; i < SECTION_ORDER.length; i++) {
      var el = document.getElementById("sec-" + SECTION_ORDER[i]);
      if (el && el.offsetTop <= checkPos) {
        activeSec = SECTION_ORDER[i];
        activeEl = el;
      }
    }

    if (activeEl) {
      var secTop = activeEl.offsetTop;
      var secHeight = Math.max(200, activeEl.offsetHeight);
      activeUnitProgress = Math.min(100, Math.max(5, ((checkPos - secTop) / secHeight) * 100));
      var progBar = document.getElementById("unitProgressBar");
      if (progBar) progBar.style.width = activeUnitProgress.toFixed(1) + "%";
    }

    if (activeSec !== activeSectionId) {
      setActiveTabButton(activeSec);
      updateAtmosphereForSection(activeSec);
    }
  }

  // Partículas atómicas de transición entre la barra superior y la barra lateral izquierda
  var transitionAtoms = [];
  for (var ta = 0; ta < 52; ta++) {
    transitionAtoms.push({
      idx: ta % 8,
      offset: (ta / 52) * 0.38,
      orbitR: 5 + (ta % 4) * 4,
      orbitSpeed: (ta % 2 === 0 ? 1 : -1) * (0.004 + (ta % 5) * 0.0012),
      size: 2.2 + (ta % 3) * 1.3,
      curveSpread: ((ta % 7) - 3) * 28,
      hue: ta % 3 === 0 ? "34, 211, 238" : (ta % 3 === 1 ? "168, 85, 247" : "99, 102, 241")
    });
  }

  function updateScrollMorphAndAtoms(timeMs) {
    scrollMorphCurrent += (scrollMorphTarget - scrollMorphCurrent) * 0.13;
    if (Math.abs(scrollMorphTarget - scrollMorphCurrent) < 0.001) {
      scrollMorphCurrent = scrollMorphTarget;
    }
    scrollVelocity *= 0.91;

    var p = scrollMorphCurrent;
    var topNav = document.getElementById("topNavBar");
    var leftSidebar = document.getElementById("leftStickySidebar");
    var stickyTopBar = document.getElementById("stickyUnitTopBar");

    if (topNav) {
      topNav.style.opacity = Math.max(0, 1 - p * 1.25).toFixed(3);
      topNav.style.transform = "translate3d(" + (-p * 48).toFixed(1) + "px, " + (-p * 14).toFixed(1) + "px, 0) scale(" + (1 - p * 0.1).toFixed(3) + ")";
      topNav.style.pointerEvents = p > 0.65 ? "none" : "auto";
    }

    if (stickyTopBar) {
      if (p > 0.22) {
        stickyTopBar.classList.add("visible");
      } else {
        stickyTopBar.classList.remove("visible");
      }
    }

    if (p > 0.35) {
      document.body.classList.add("sidebar-docked");
    } else {
      document.body.classList.remove("sidebar-docked");
    }

    if (leftSidebar) {
      leftSidebar.style.opacity = Math.min(1, Math.max(0, (p - 0.08) / 0.75)).toFixed(3);
      leftSidebar.style.pointerEvents = p > 0.25 ? "auto" : "none";
      var sideBtns = leftSidebar.querySelectorAll(".sidebar-tab-btn");
      for (var sb = 0; sb < sideBtns.length; sb++) {
        var staggerP = Math.min(1, Math.max(0, (p - sb * 0.055) / 0.55));
        var easeOut = 1 - Math.pow(1 - staggerP, 3);
        var fromX = (1 - easeOut) * (120 + sb * 26);
        var fromY = (1 - easeOut) * (-45 - sb * 18);
        var scaleVal = 0.72 + 0.28 * easeOut;
        sideBtns[sb].style.opacity = easeOut.toFixed(3);
        sideBtns[sb].style.transform = "translate3d(" + fromX.toFixed(1) + "px, " + fromY.toFixed(1) + "px, 0) scale(" + scaleVal.toFixed(3) + ")";
      }
    }

    // Dibujar átomos desplegándose/replegándose en #scrollAtomCanvas
    var canvas = document.getElementById("scrollAtomCanvas");
    if (!canvas) return;
    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    var isTransitioning = p > 0.01 && p < 0.99;
    var speedFactor = Math.min(1, Math.abs(scrollVelocity) / 14);
    var visAlpha = isTransitioning ? Math.sin(p * Math.PI) * 0.95 : (p >= 0.99 ? speedFactor * 0.65 : 0);

    if (visAlpha <= 0.02) return;

    var activeIdx = Math.max(0, SECTION_ORDER.indexOf(activeSectionId));
    for (var i = 0; i < transitionAtoms.length; i++) {
      var atom = transitionAtoms[i];
      var localT = Math.min(1, Math.max(0, (p * 1.35) - atom.offset));
      var easeT = localT < 0.5 ? 2 * localT * localT : 1 - Math.pow(-2 * localT + 2, 2) / 2;

      // Posición de origen en la barra superior
      var startX = w * 0.22 + (atom.idx / 7) * (w * 0.56);
      var startY = 86 + (atom.idx % 2) * 28;

      // Posición destino en el sidebar lateral izquierdo
      var endX = 36 + (w >= 1280 ? 95 : 12);
      var endY = 105 + atom.idx * 46;

      // Punto de control Bézier que se abre como una órbita atómica
      var ctrlX = (startX + endX) * 0.35 + atom.curveSpread;
      var ctrlY = (startY + endY) * 0.5 + atom.curveSpread * 0.8 + scrollVelocity * 1.5;

      var invT = 1 - easeT;
      var bx = invT * invT * startX + 2 * invT * easeT * ctrlX + easeT * easeT * endX;
      var by = invT * invT * startY + 2 * invT * easeT * ctrlY + easeT * easeT * endY;

      // Si ya está acoplado a la izquierda y el usuario scrollea, los átomos orbitan hacia la unidad activa
      if (p >= 0.98) {
        var targetUnitY = 105 + activeIdx * 46;
        bx = 26 + Math.sin(timeMs * 0.003 + i) * 14;
        by = endY + Math.sin(timeMs * 0.004 + i) * 18 + (targetUnitY - endY) * 0.35;
      }

      var ang = timeMs * atom.orbitSpeed + i + scrollVelocity * 0.08;
      var ex = bx + Math.cos(ang) * atom.orbitR;
      var ey = by + Math.sin(ang) * (atom.orbitR * 0.55);

      ctx.save();
      // Anillo orbital del átomo
      ctx.strokeStyle = "rgba(" + atom.hue + ", " + (visAlpha * 0.42).toFixed(2) + ")";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.ellipse(bx, by, atom.orbitR, atom.orbitR * 0.55, (i % 3) * 0.6, 0, Math.PI * 2);
      ctx.stroke();

      // Núcleo luminoso
      ctx.fillStyle = "rgba(" + atom.hue + ", " + (visAlpha * 0.9).toFixed(2) + ")";
      ctx.shadowColor = "rgb(" + atom.hue + ")";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(bx, by, atom.size, 0, Math.PI * 2);
      ctx.fill();

      // Electrón en órbita
      ctx.fillStyle = "rgba(255, 255, 255, " + (visAlpha * 0.95).toFixed(2) + ")";
      ctx.beginPath();
      ctx.arc(ex, ey, 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // ---------------------------------------------------------------------------
  // 2. FONDO CÓSMICO ANIMADO (ESTRELLAS, NEBULOSAS Y ÁTOMOS FLOTANTES)
  // ---------------------------------------------------------------------------
  var bgStars = [];
  for (var sIdx = 0; sIdx < 65; sIdx++) {
    bgStars.push({
      x: Math.random(),
      y: Math.random(),
      r: 0.9 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 0.00022,
      vy: (Math.random() - 0.5) * 0.00022,
      phase: Math.random() * Math.PI * 2,
      isAtom: sIdx < 7
    });
  }

  function drawAmbientParticles(timeMs) {
    var canvas = document.getElementById("ambientParticles");
    if (!canvas) return;
    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    var primaryRgb = "34, 211, 238";
    var secondaryRgb = "168, 85, 247";
    if (currentAtmosphere === "u7") {
      primaryRgb = "52, 211, 153";
      secondaryRgb = "34, 211, 238";
    } else if (currentAtmosphere === "u8") {
      primaryRgb = "251, 113, 133";
      secondaryRgb = "168, 85, 247";
    }

    for (var i = 0; i < bgStars.length; i++) {
      var p = bgStars[i];
      p.x += p.vx;
      p.y += p.vy - scrollVelocity * 0.00004;
      if (p.x < 0) p.x = 1;
      if (p.x > 1) p.x = 0;
      if (p.y < 0) p.y = 1;
      if (p.y > 1) p.y = 0;

      var px = p.x * w;
      var py = p.y * h;
      var alpha = 0.25 + 0.3 * Math.sin(timeMs * 0.0018 + p.phase);
      var col = (i % 2 === 0) ? primaryRgb : secondaryRgb;

      if (p.isAtom) {
        ctx.save();
        ctx.strokeStyle = "rgba(" + col + ", " + (alpha * 0.35).toFixed(2) + ")";
        ctx.lineWidth = 1;
        var rot = timeMs * 0.0008 + p.phase;
        ctx.beginPath();
        ctx.ellipse(px, py, 16, 6, rot, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(px, py, 16, 6, rot + Math.PI / 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(" + col + ", " + (alpha * 0.85).toFixed(2) + ")";
        ctx.beginPath();
        ctx.arc(px, py, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = "rgba(" + col + ", " + alpha.toFixed(2) + ")";
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // ---------------------------------------------------------------------------
  // 3. FILTRO DE LA HOJA DE FÓRMULAS
  // ---------------------------------------------------------------------------
  function filterFormulas(cat) {
    var cards = document.querySelectorAll(".formula-sheet-item");
    var btns = document.querySelectorAll(".formula-filter-btn");
    for (var b = 0; b < btns.length; b++) {
      if (btns[b].getAttribute("data-fcat") === cat) {
        btns[b].classList.add("active");
      } else {
        btns[b].classList.remove("active");
      }
    }
    for (var i = 0; i < cards.length; i++) {
      var itemCat = cards[i].getAttribute("data-fcat");
      if (cat === "all" || itemCat === cat) {
        cards[i].style.display = "";
      } else {
        cards[i].style.display = "none";
      }
    }
  }
  window.filterFormulas = filterFormulas;

  // ---------------------------------------------------------------------------
  // 4. SISTEMA DE VIDEO INTEGRADO EN LA WEB (ANTI-ERROR 153)
  // ---------------------------------------------------------------------------
  // Mapeo de cada tarjeta a videos reales de 11 caracteres de cátedra + diapositivas
  var UNIT_VIDEOS_MAP = {
    "u6": [
      { id: "OEXlybwJ5BQ", title: "Unidad 6 — Práctica 1: Carga Eléctrica y Ley de Coulomb (Cátedra UNAJ)" },
      { id: "5tpWTUlveOo", title: "Unidad 6 — Práctica 2: Corriente Eléctrica y Ley de Ohm (Cátedra UNAJ)" },
      { id: "dDSeIDw2DAA", title: "Unidad 6 — Práctica 3: Circuitos, Potencia y Efecto Joule (Cátedra UNAJ)" }
    ],
    "u7": [
      { id: "7ODSHGz0XXM", title: "Unidad 7 — Teórica 1: Electrolitos, Ácidos/Bases, Escala de pH y Buffers" },
      { id: "I9tgAqgN6dk", title: "Unidad 7 — Teórica 2: Soluciones, %P/P, %P/V, Densidad, Molaridad y Ósmosis" },
      { id: "ycH1LVjm8ok", title: "Unidad 7 — Práctica 1: Problemas de Soluciones y Concentraciones" },
      { id: "o8fK_cEYDcg", title: "Unidad 7 — Práctica 2: Ejercicios 7, 8, 9 y 10a (Densidad, Amoxicilina, Nistatina)" },
      { id: "UFoHLUotGpE", title: "Unidad 7 — Práctica 3: Ejercicios 10b, 11 y 12 (Molaridad y Claritromicina)" }
    ],
    "u8": [
      { id: "Nw8OLWB_HnM", title: "Unidad 8 — Práctica 1: Hidrostática, Presión y Manometría" },
      { id: "iXYrRSZleKQ", title: "Unidad 8 — Práctica: Gasto Cardíaco, Continuidad y Áreas Vasculares (Ej. 4)" },
      { id: "pVOVQHih9sE", title: "Unidad 8 — Práctica: Velocidad Sanguínea y Caudal en Vasos (Ej. 6)" },
      { id: "xh1rgF_vbdU", title: "Unidad 8 — Práctica: Vasoconstricción y Fuerza Hidrostática en Tímpano (Ej. 7 y 8)" }
    ]
  };

  // Mapeo de Playlists Oficiales por Unidad (soporta tanto playlists con index exacto como videos individuales)
  var PLAYLIST_IDS = {
    u6: "PLcAZSZcl9wSA",
    u7: "PLFhwGyO8AyTM",
    u8_pt1: "PLZG0-Ct9AdJ0",
    u8_pt2: "PLZNt-1Ehj2cs"
  };

  // Resuelve cada tarjeta de las grillas respetando su playlist (list=...) y su posición exacta (index=0, 1, 2...),
  // sin pisar ni repetir el mismo video en tarjetas distintas.
  function resolveCleanEmbedUrl(rawUrl) {
    if (!rawUrl) return "";

    var listMatch = rawUrl.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    var indexMatch = rawUrl.match(/[?&]index=(\d+)/);
    var videoIdMatch = rawUrl.match(/\/embed\/([a-zA-Z0-9_-]{11})/) || rawUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);

    // Caso 1: Video individual con ID de 11 caracteres
    if (videoIdMatch && videoIdMatch[1] !== "videoseries") {
      var vidId = videoIdMatch[1];
      var extraList = listMatch ? "&list=" + listMatch[1] : "";
      var extraIdx = indexMatch ? "&index=" + indexMatch[1] : "";
      return "https://www.youtube.com/embed/" + vidId + "?rel=0&playsinline=1&autoplay=1" + extraList + extraIdx;
    }

    // Caso 2: Playlist de Unidad (U6, U7, U8 PT1, U8 PT2) con el índice específico de esa tarjeta en la grilla
    if (listMatch) {
      var listId = listMatch[1];
      var idx = indexMatch ? parseInt(indexMatch[1], 10) : 0;
      return "https://www.youtube.com/embed/videoseries?list=" + listId + "&index=" + idx + "&rel=0&playsinline=1&autoplay=1";
    }

    if (rawUrl.indexOf("playsinline=1") === -1) {
      rawUrl += (rawUrl.indexOf("?") === -1 ? "?" : "&") + "playsinline=1&autoplay=1";
    }
    return rawUrl;
  }

  // Genera la URL directa para abrir el video o playlist en el índice exacto correspondiente
  function buildDirectWatchUrl(rawUrl) {
    if (!rawUrl) return "https://www.youtube.com";
    var listMatch = rawUrl.match(/[?&]list=([a-zA-Z0-9_-]+)/);
    var indexMatch = rawUrl.match(/[?&]index=(\d+)/);
    var videoIdMatch = rawUrl.match(/\/embed\/([a-zA-Z0-9_-]{11})/) || rawUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/);

    if (videoIdMatch && videoIdMatch[1] !== "videoseries") {
      return "https://www.youtube.com/watch?v=" + videoIdMatch[1];
    }
    if (listMatch) {
      var listId = listMatch[1];
      var idx1Based = indexMatch ? (parseInt(indexMatch[1], 10) + 1) : 1;
      return "https://www.youtube.com/playlist?list=" + listId + "&index=" + idx1Based;
    }
    return rawUrl;
  }

  var savedCardThumbs = {};
  var activeSlideShowIntervals = {};

  function stopSlideShow(wrapId) {
    if (activeSlideShowIntervals[wrapId]) {
      clearInterval(activeSlideShowIntervals[wrapId]);
      delete activeSlideShowIntervals[wrapId];
    }
    if (window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
  }

  // Cambiar video o playlist en los reproductores principales de Unidad 6, 7 y 8
  function loadUnitVideo(iframeId, videoIdOrUrl, btnEl) {
    var ifr = document.getElementById(iframeId);
    if (ifr) {
      ifr.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      if (videoIdOrUrl && videoIdOrUrl.indexOf("http") === 0) {
        ifr.src = resolveCleanEmbedUrl(videoIdOrUrl);
      } else {
        ifr.src = "https://www.youtube.com/embed/" + videoIdOrUrl + "?rel=0&playsinline=1&autoplay=1";
      }
    }
    if (btnEl && btnEl.parentElement) {
      var btns = btnEl.parentElement.querySelectorAll(".unit-vid-btn");
      for (var i = 0; i < btns.length; i++) btns[i].classList.remove("active");
      btnEl.classList.add("active");
    }
  }
  window.loadUnitVideo = loadUnitVideo;

  // Ventana reproductor flotante integrada (respeta playlist + index o ID de video individual)
  function openFloatingPlayerWindow(videoIdOrUrl, title) {
    var watchUrl = (videoIdOrUrl && videoIdOrUrl.length === 11 && videoIdOrUrl.indexOf("/") === -1)
      ? "https://www.youtube.com/watch?v=" + videoIdOrUrl
      : buildDirectWatchUrl(videoIdOrUrl);
    var w = 980;
    var h = 580;
    var left = Math.max(20, Math.round((window.screen.width - w) * 0.5));
    var top = Math.max(20, Math.round((window.screen.height - h) * 0.5));
    window.open(
      watchUrl,
      "CienciaLabPlayer",
      "width=" + w + ",height=" + h + ",left=" + left + ",top=" + top + ",menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes"
    );
  }
  window.openFloatingPlayerWindow = openFloatingPlayerWindow;

  // Reproductor Interactivo Nativo de Diapositivas + Explicación en el navegador
  function startInteractiveSlideClass(wrapId) {
    var wrap = document.getElementById(wrapId);
    if (!wrap) return;
    stopSlideShow(wrapId);
    if (!savedCardThumbs[wrapId]) {
      savedCardThumbs[wrapId] = wrap.innerHTML;
    }

    var card = wrap.closest(".video-card");
    var titleEl = card ? card.querySelector("h4") : null;
    var title = titleEl ? titleEl.innerText : "Clase Interactiva";
    var detailsEl = card ? card.querySelector(".video-details-body") : null;
    var points = [];
    if (detailsEl) {
      var divs = detailsEl.querySelectorAll("div");
      for (var d = 0; d < divs.length; d++) {
        var txt = divs[d].innerText.trim();
        if (txt.length > 10) points.push(txt);
      }
    }
    if (points.length === 0) {
      points.push(title + ": Revisá las diapositivas oficiales y las fórmulas clave de la unidad.");
    }

    var slide1Src = "";
    var slide2Src = "";
    var tempDiv = document.createElement("div");
    tempDiv.innerHTML = savedCardThumbs[wrapId];
    var origImg = tempDiv.querySelector("img");
    if (origImg) {
      slide1Src = origImg.getAttribute("src") || "";
      slide2Src = slide1Src.replace(".jpg", "_b.jpg");
    }

    var stepIdx = 0;
    function renderStep() {
      var curSlide = (stepIdx % 2 === 0 || !slide2Src) ? slide1Src : slide2Src;
      var curText = points[stepIdx % points.length];
      wrap.innerHTML =
        '<div class="relative w-full h-full bg-slate-950 flex flex-col justify-between overflow-hidden select-none">' +
          '<img src="' + curSlide + '" alt="Diapositiva" class="w-full h-full object-contain opacity-90 transition-all duration-500">' +
          '<div class="absolute top-2 left-2 right-2 flex items-center justify-between gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-full border border-cyan-500/40">' +
            '<span class="text-[11px] font-bold text-cyan-300 truncate">🎞️ Clase Interactiva · Diapositiva ' + ((stepIdx % 2) + 1) + '/2</span>' +
            '<div class="flex items-center gap-1">' +
              '<button type="button" class="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 text-[10px] font-bold hover:bg-cyan-500/40" id="prevSlideStep_' + wrapId + '">◀ Ant</button>' +
              '<button type="button" class="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 text-[10px] font-bold hover:bg-cyan-500/40" id="nextSlideStep_' + wrapId + '">Sig ▶</button>' +
              '<button type="button" class="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-[10px] font-bold hover:bg-purple-500/50" id="speakSlideStep_' + wrapId + '">🔊 Narrar</button>' +
            '</div>' +
          '</div>' +
          '<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent p-3 pt-6">' +
            '<div class="text-[11.5px] text-slate-100 leading-snug line-clamp-3 bg-slate-900/90 border border-indigo-500/40 rounded-xl p-2 shadow-lg">' +
              curText +
            '</div>' +
          '</div>' +
        '</div>';

      var prevBtn = document.getElementById("prevSlideStep_" + wrapId);
      var nextBtn = document.getElementById("nextSlideStep_" + wrapId);
      var speakBtn = document.getElementById("speakSlideStep_" + wrapId);
      if (prevBtn) {
        prevBtn.onclick = function (ev) {
          ev.stopPropagation();
          stepIdx = (stepIdx - 1 + points.length * 2) % (points.length * 2);
          renderStep();
        };
      }
      if (nextBtn) {
        nextBtn.onclick = function (ev) {
          ev.stopPropagation();
          stepIdx = (stepIdx + 1) % (points.length * 2);
          renderStep();
        };
      }
      if (speakBtn) {
        speakBtn.onclick = function (ev) {
          ev.stopPropagation();
          if (window.speechSynthesis) {
            try {
              window.speechSynthesis.cancel();
              var u = new SpeechSynthesisUtterance(curText);
              u.lang = "es-AR";
              u.rate = 1.02;
              window.speechSynthesis.speak(u);
            } catch (e) {}
          }
        };
      }
    }

    renderStep();
    activeSlideShowIntervals[wrapId] = setInterval(function () {
      stepIdx = (stepIdx + 1) % (points.length * 2);
      renderStep();
    }, 6500);
  }
  window.startInteractiveSlideClass = startInteractiveSlideClass;

  function playYoutubeInCard(wrapId, embedUrl) {
    var wrap = document.getElementById(wrapId);
    if (!wrap) return;
    stopSlideShow(wrapId);
    if (!savedCardThumbs[wrapId]) {
      savedCardThumbs[wrapId] = wrap.innerHTML;
    }

    var finalSrc = resolveCleanEmbedUrl(embedUrl);
    var safeRawUrl = (embedUrl || "").replace(/'/g, "\\'");

    wrap.innerHTML =
      '<div class="relative w-full h-full bg-black flex flex-col">' +
        '<iframe class="w-full flex-1" src="' + finalSrc + '" title="Reproductor de Video" frameborder="0" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>' +
        '<div class="bg-slate-950/95 px-2.5 py-1 flex flex-wrap items-center justify-between gap-1 border-t border-indigo-500/30 text-[10.5px]">' +
          '<button type="button" class="text-cyan-300 hover:text-white font-semibold" onclick="startInteractiveSlideClass(\'' + wrapId + '\')">🎞️ Modo Clase Interactiva (Diapositivas)</button>' +
          '<button type="button" class="text-purple-300 hover:text-white font-semibold" onclick="openFloatingPlayerWindow(\'' + safeRawUrl + '\', \'Video\')">🪟 Abrir Video / Playlist en Ventana</button>' +
        '</div>' +
      '</div>';
  }
  window.playYoutubeInCard = playYoutubeInCard;

  function restoreCardSlide(wrapId, imgId, slideSrc, btnEl) {
    stopSlideShow(wrapId);
    var wrap = document.getElementById(wrapId);
    if (wrap && savedCardThumbs[wrapId]) {
      wrap.innerHTML = savedCardThumbs[wrapId];
    }
    var img = document.getElementById(imgId);
    if (img && slideSrc) {
      img.src = slideSrc;
    }
    if (btnEl && btnEl.parentElement) {
      var siblings = btnEl.parentElement.querySelectorAll(".slide-pill-btn");
      for (var i = 0; i < siblings.length; i++) {
        siblings[i].classList.remove("active");
      }
      btnEl.classList.add("active");
    }
  }
  window.restoreCardSlide = restoreCardSlide;

  function openTheaterModal(title, embedUrl, imgSrc) {
    var modal = document.getElementById("videoModal");
    var mTitle = document.getElementById("videoModalTitle");
    var mBody = document.getElementById("videoModalBody");
    if (!modal || !mTitle || !mBody) return;
    mTitle.innerText = title;

    var finalSrc = resolveCleanEmbedUrl(embedUrl);
    var noCookieSrc = finalSrc.replace("www.youtube.com", "www.youtube-nocookie.com");
    var safeRawUrl = (embedUrl || "").replace(/'/g, "\\'");

    mBody.innerHTML =
      '<div class="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-cyan-500/40 shadow-2xl">' +
        '<iframe id="modalYoutubeIframe" class="w-full h-full" src="' + finalSrc + '" title="' + title + '" frameborder="0" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>' +
      '</div>' +
      '<div class="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-indigo-500/30">' +
        '<span>⚡ Reproduciendo el índice exacto de la playlist / unidad seleccionada.</span>' +
        '<div class="flex flex-wrap gap-2">' +
          '<button type="button" class="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold hover:bg-cyan-500/35" onclick="document.getElementById(\'modalYoutubeIframe\').src=\'' + noCookieSrc + '\'">Servidor Alternativo NoCookie</button>' +
          '<button type="button" class="px-3 py-1 rounded-full bg-purple-500/25 text-purple-200 font-bold hover:bg-purple-500/40" onclick="openFloatingPlayerWindow(\'' + safeRawUrl + '\', \'' + title.replace(/'/g, "") + '\')">🪟 Reproductor en Ventana Flotante</button>' +
        '</div>' +
      '</div>';

    modal.classList.remove("hidden");
  }
  window.openTheaterModal = openTheaterModal;

  function closeVideoModal() {
    var modal = document.getElementById("videoModal");
    var mBody = document.getElementById("videoModalBody");
    if (modal) modal.classList.add("hidden");
    if (mBody) mBody.innerHTML = "";
  }
  window.closeVideoModal = closeVideoModal;

  function toggleVideoDetails(btnEl) {
    var card = btnEl.closest(".video-card");
    if (!card) return;
    var body = card.querySelector(".video-details-body");
    var icon = btnEl.querySelector(".toggle-arrow");
    if (!body) return;
    var isOpen = body.classList.contains("open");
    if (isOpen) {
      body.classList.remove("open");
      if (icon) icon.innerText = "▼";
    } else {
      body.classList.add("open");
      if (icon) icon.innerText = "▲";
    }
  }
  window.toggleVideoDetails = toggleVideoDetails;

  function toggleAllVideoDetails(unitClass, expand) {
    var container = document.getElementById(unitClass);
    if (!container) return;
    var bodies = container.querySelectorAll(".video-details-body");
    var arrows = container.querySelectorAll(".toggle-arrow");
    for (var i = 0; i < bodies.length; i++) {
      if (expand) bodies[i].classList.add("open");
      else bodies[i].classList.remove("open");
    }
    for (var j = 0; j < arrows.length; j++) {
      arrows[j].innerText = expand ? "▲" : "▼";
    }
  }
  window.toggleAllVideoDetails = toggleAllVideoDetails;

  // ---------------------------------------------------------------------------
  // 5. BUSCADOR GLOBAL INSTANTÁNEO (SOPORTA HEADER Y BARRA STICKY)
  // ---------------------------------------------------------------------------
  function runGlobalSearch(inputEl, panelId, listId) {
    var resultsBox = document.getElementById(panelId);
    var resultsList = document.getElementById(listId);
    if (!inputEl || !resultsBox || !resultsList) return;
    var q = inputEl.value.trim().toLowerCase();
    if (q.length < 2) {
      resultsBox.classList.add("hidden");
      resultsList.innerHTML = "";
      return;
    }
    var cards = document.querySelectorAll("[data-search]");
    var matches = [];
    for (var i = 0; i < cards.length; i++) {
      var text = (cards[i].getAttribute("data-search") + " " + cards[i].innerText).toLowerCase();
      if (text.indexOf(q) !== -1) {
        var titleEl = cards[i].querySelector("h2, h3, h4");
        var title = titleEl ? titleEl.innerText : "Contenido de estudio";
        var tabSec = cards[i].closest(".view-section");
        var tabId = tabSec ? tabSec.id.replace("sec-", "") : "parcial";
        var snippet = cards[i].innerText.replace(/\s+/g, " ").substring(0, 130) + "...";
        matches.push({ title: title, tabId: tabId, snippet: snippet, el: cards[i] });
      }
    }
    resultsBox.classList.remove("hidden");
    if (matches.length === 0) {
      resultsList.innerHTML = '<div class="text-xs text-slate-400 py-2">No se encontraron resultados para "' + q + '". Probá con Ohm, Joule, Mielina, pH, Molaridad, Starling, Edema o Reynolds.</div>';
      return;
    }
    var html = "";
    for (var k = 0; k < Math.min(matches.length, 8); k++) {
      var m = matches[k];
      html += '<button type="button" class="w-full text-left p-2.5 rounded-xl bg-slate-900/90 hover:bg-indigo-950/90 border border-indigo-500/30 mb-1.5 block transition" data-goto-idx="' + k + '">' +
        '<div class="text-xs font-bold text-cyan-400">' + m.title + '</div>' +
        '<div class="text-[11px] text-slate-300 mt-0.5">' + m.snippet + '</div>' +
        '</button>';
    }
    resultsList.innerHTML = html;
    var gotoBtns = resultsList.querySelectorAll("[data-goto-idx]");
    for (var b = 0; b < gotoBtns.length; b++) {
      gotoBtns[b].addEventListener("click", function () {
        var idx = parseInt(this.getAttribute("data-goto-idx"), 10);
        resultsBox.classList.add("hidden");
        if (matches[idx] && matches[idx].el) {
          matches[idx].el.scrollIntoView({ behavior: "smooth", block: "center" });
          setActiveTabButton(matches[idx].tabId);
        }
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 6. SEIS SIMULADORES INTERACTIVOS ESTILO COSMIC NEON "CIENCIALAB" (IMAGEN 3)
  // ---------------------------------------------------------------------------

  // --- SIMULADOR 1: LEY DE OHM, EFECTO JOULE Y DISYUNTOR DIFERENCIAL ---
  var ohmState = { V: 220, R: 2000, t: 2, mode: "AC", pulseBoost: 0, particles: [] };
  for (var eIdx = 0; eIdx < 14; eIdx++) {
    ohmState.particles.push({
      x: eIdx / 14,
      lane: (eIdx % 3 - 1) * 0.55,
      size: 4.5 + (eIdx % 2) * 1.5
    });
  }

  function updateOhmSimulator() {
    var vSlider = document.getElementById("simOhmV");
    var rSlider = document.getElementById("simOhmR");
    var tSlider = document.getElementById("simOhmT");
    var modeSel = document.getElementById("simOhmMode");
    if (!vSlider || !rSlider || !tSlider || !modeSel) return;

    ohmState.V = parseFloat(vSlider.value);
    ohmState.R = parseFloat(rSlider.value);
    ohmState.t = parseFloat(tSlider.value);
    ohmState.mode = modeSel.value;

    document.getElementById("simOhmVVal").innerText = ohmState.V + " V";
    document.getElementById("simOhmRVal").innerText = ohmState.R + " Ω";
    document.getElementById("simOhmTVal").innerText = ohmState.t + " s";

    var I_amp = ohmState.V / ohmState.R;
    var I_mA = I_amp * 1000;
    var P_watt = ohmState.V * I_amp;
    var E_joule = ohmState.R * I_amp * I_amp * ohmState.t;

    document.getElementById("simOhmOutI").innerText = I_amp.toFixed(4) + " A (" + I_mA.toFixed(1) + " mA)";
    document.getElementById("simOhmOutP").innerText = P_watt.toFixed(2) + " W";
    document.getElementById("simOhmOutE").innerText = E_joule.toFixed(2) + " J";

    var effectText = "";
    var disyuntorText = "";
    if (ohmState.mode === "DC") {
      if (I_mA <= 3.5) effectText = "Corriente Continua (0 a 3,5 mA): Sin sensaciones ni efectos.";
      else if (I_mA <= 41) effectText = "Corriente Continua (3,6 a 41 mA): Choque doloroso sin perder control muscular.";
      else if (I_mA <= 51) effectText = "Corriente Continua (42 a 51 mA): Agarrotamiento muscular (tetanización).";
      else if (I_mA <= 60) effectText = "Corriente Continua (52 a 60 mA): Fuerte dificultad respiratoria.";
      else effectText = "Corriente Continua (> 60 mA): Parálisis respiratoria / Fibrilación.";
      disyuntorText = "Modo Corriente Continua (DC): Flujo electrónico unidireccional constante.";
    } else {
      if (I_mA <= 0.5) effectText = "Corriente Alterna (0 a 0,5 mA): Sin sensaciones ni efectos.";
      else if (I_mA <= 6) effectText = "Corriente Alterna (0,6 a 6 mA): Choque con control muscular conservado.";
      else if (I_mA <= 10) effectText = "Corriente Alterna (7 a 10 mA): Agarrotamiento muscular (tetanización).";
      else if (I_mA <= 15) effectText = "Corriente Alterna (11 a 15 mA): Fuerte dificultad respiratoria.";
      else if (I_mA <= 45) effectText = "Corriente Alterna (16 a 45 mA): Parálisis respiratoria.";
      else if (I_mA <= 75) effectText = "Corriente Alterna (46 a 75 mA): Fibrilación cardíaca irreversible.";
      else effectText = "Corriente Alterna (> 75 mA): ¡PELIGRO DE PARO CARDÍACO!";

      if (I_mA > 40) {
        disyuntorText = "⚡ Escudo Disyuntor Diferencial (40 mA) ACTIVADO: Corta el suministro en milisegundos y salva la vida.";
      } else {
        disyuntorText = "✓ Corriente < 40 mA: El Disyuntor Diferencial monitorea en estado normal.";
      }
    }
    document.getElementById("simOhmBioEffect").innerText = effectText;
    document.getElementById("simOhmDisyuntor").innerText = disyuntorText;
  }

  function drawOhmCanvas(timeMs) {
    var canvas = document.getElementById("canvasOhm");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    ohmState.pulseBoost *= 0.92;
    var I_amp = ohmState.V / ohmState.R;
    var I_mA = I_amp * 1000;
    var E_joule = ohmState.R * I_amp * I_amp * ohmState.t;
    var midY = h * 0.54;
    var squeeze = Math.min(30, (ohmState.R / 6000) * 30);

    // Fondo de grilla cuántica sutil
    ctx.strokeStyle = "rgba(99, 102, 241, 0.12)";
    ctx.lineWidth = 1;
    for (var gx = 30; gx < w; gx += 40) {
      ctx.beginPath(); ctx.moveTo(gx, 10); ctx.lineTo(gx, h - 10); ctx.stroke();
    }

    // Aura térmica por Efecto Joule en el centro
    var heatGlow = Math.min(1, (I_amp * ohmState.V) / 85 + ohmState.pulseBoost * 0.4);
    if (heatGlow > 0.04) {
      var radGrad = ctx.createRadialGradient(w * 0.5, midY, 6, w * 0.5, midY, 72);
      radGrad.addColorStop(0, "rgba(244, 63, 94, " + (heatGlow * 0.65).toFixed(2) + ")");
      radGrad.addColorStop(0.5, "rgba(168, 85, 247, " + (heatGlow * 0.35).toFixed(2) + ")");
      radGrad.addColorStop(1, "rgba(168, 85, 247, 0)");
      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(w * 0.5, midY, 72, 0, Math.PI * 2);
      ctx.fill();
    }

    // Conducto cuántico con estrechamiento por Resistencia R
    ctx.save();
    ctx.fillStyle = "rgba(12, 19, 56, 0.88)";
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = "#22d3ee";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(88, midY - 40);
    ctx.quadraticCurveTo(w * 0.5, midY - 40 + squeeze * 1.35, w - 88, midY - 40);
    ctx.lineTo(w - 88, midY + 40);
    ctx.quadraticCurveTo(w * 0.5, midY + 40 - squeeze * 1.35, 88, midY + 40);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Vectores luminosos de empuje de Voltaje (estilo Imagen 3)
    drawNeonVector(ctx, 98, midY - 52, 195, midY - 52, "#22d3ee", 2.5, "V = " + ohmState.V + " V");
    drawNeonVector(ctx, w - 195, midY - 52, w - 98, midY - 52, "#a855f7", 2.5, "I = " + I_mA.toFixed(1) + " mA");

    // 1. Núcleo Generador de Tensión V (Izquierda)
    var voltX = 48;
    var voltR = 24 + (ohmState.V / 240) * 5;
    var vGrad = ctx.createRadialGradient(voltX - 5, midY - 5, 3, voltX, midY, voltR);
    vGrad.addColorStop(0, "#67e8f9");
    vGrad.addColorStop(0.6, "#0284c7");
    vGrad.addColorStop(1, "#1e1b4b");
    ctx.fillStyle = vGrad;
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(voltX, midY, voltR, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(ohmState.V + "V", voltX, midY + 4);
    ctx.fillStyle = "#7dd3fc";
    ctx.font = "bold 10.5px Outfit, sans-serif";
    ctx.fillText("TENSIÓN (V)", voltX, midY - voltR - 9);

    // 2. Anillo de Oposición / Resistencia R en el centro
    var ohmX = w * 0.5;
    var ringH = Math.max(12, 40 - squeeze * 0.68);
    ctx.save();
    ctx.strokeStyle = "#c084fc";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#a855f7";
    ctx.shadowBlur = 10;
    drawRoundRect(ctx, ohmX - 24, midY - ringH, 48, ringH * 2, 10, false, true);
    ctx.restore();
    ctx.fillStyle = "#e9d5ff";
    ctx.font = "bold 11px Outfit, sans-serif";
    ctx.fillText("Resistencia R = " + ohmState.R + " Ω", ohmX, 24);
    ctx.fillStyle = "#fda4af";
    ctx.font = "10.5px Plus Jakarta Sans, sans-serif";
    ctx.fillText("Calor Joule: " + E_joule.toFixed(1) + " J", ohmX, 40);

    // 3. Esferas cuánticas de corriente (Electrones / Iones) con estelas de neón
    var speed = Math.min(0.018, Math.max(0.0012, I_amp * 0.04 + ohmState.pulseBoost * 0.01));
    var dir = ohmState.mode === "AC" ? Math.sin(timeMs * 0.0055) : 1;
    var tripped = ohmState.mode === "AC" && I_mA > 40;

    for (var i = 0; i < ohmState.particles.length; i++) {
      var pt = ohmState.particles[i];
      if (!tripped) {
        pt.x = (pt.x + speed * dir + 1) % 1;
      }
      var px = 98 + pt.x * (w - 196);
      var localHalfH = 32 - squeeze * 0.65 * Math.sin(pt.x * Math.PI);
      var py = midY + pt.lane * localHalfH + Math.sin(timeMs * 0.008 + i) * 2.5;

      ctx.save();
      var pCol = heatGlow > 0.45 ? "#fb7185" : "#22d3ee";
      ctx.fillStyle = pCol;
      ctx.shadowColor = pCol;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(px, py, pt.size, 0, Math.PI * 2);
      ctx.fill();
      // Vector velocidad sobre la esfera
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + (dir >= 0 ? 9 : -9), py);
      ctx.stroke();
      ctx.restore();
    }

    // 4. Escudo Disyuntor Diferencial (40 mA) a la derecha
    var disX = w - 48;
    ctx.save();
    ctx.fillStyle = tripped ? "rgba(16, 185, 129, 0.28)" : "rgba(30, 41, 82, 0.75)";
    ctx.strokeStyle = tripped ? "#34d399" : "#818cf8";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = tripped ? "#34d399" : "#6366f1";
    ctx.shadowBlur = tripped ? 16 : 6;
    ctx.beginPath();
    ctx.arc(disX, midY, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = tripped ? "#6ee7b7" : "#c7d2fe";
    ctx.font = "bold 10px Outfit, sans-serif";
    ctx.fillText(tripped ? "CORTÓ >40mA" : "DISYUNTOR", disX, midY - 31);
    ctx.fillText("40 mA", disX, midY + 4);

    // Pie informativo interactivo
    ctx.fillStyle = "#94a3b8";
    ctx.font = "10.5px Plus Jakarta Sans, sans-serif";
    ctx.fillText("💡 Hacé clic en el simulador para inyectar un pulso de tensión · V = I · R", w * 0.5, h - 10);
  }

  // --- SIMULADOR 2: BIOELECTRICIDAD, CONDUCCIÓN SALTATORIA Y POTENCIAL DE ACCIÓN ---
  var neuroState = { stimulus: -50, manualSpikeTime: 0 };
  function updateNeuroSimulator() {
    var stimSlider = document.getElementById("simNeuroStim");
    if (!stimSlider) return;
    neuroState.stimulus = parseFloat(stimSlider.value);
    document.getElementById("simNeuroStimVal").innerText = neuroState.stimulus + " mV";
    var statusEl = document.getElementById("simNeuroStatus");
    if (neuroState.stimulus >= -55) {
      statusEl.innerText = "⚡ ¡Supera el umbral (-55 mV)! Se dispara el Potencial de Acción (+30 mV) por Ley de Todo o Nada.";
      statusEl.className = "text-xs font-bold text-cyan-300 mt-1";
    } else {
      statusEl.innerText = "🛑 Estímulo subumbral (< -55 mV): No alcanza el umbral; la membrana permanece en reposo (-70 mV).";
      statusEl.className = "text-xs font-bold text-amber-300 mt-1";
    }
  }

  function drawNeuroCanvas(timeMs) {
    var canvas = document.getElementById("canvasNeuro");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    var fires = neuroState.stimulus >= -55;
    var cycle = (timeMs * 0.00048) % 1;

    // Pista 1: Axón Amielínico (Conducción Continua 10 m/s)
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 11px Outfit, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("1. Axón Amielínico (Sin mielina — Conducción Continua punto a punto: ~10 m/s)", 18, 22);

    ctx.fillStyle = "rgba(15, 23, 62, 0.9)";
    ctx.strokeStyle = "rgba(99, 102, 241, 0.5)";
    ctx.lineWidth = 1.5;
    drawRoundRect(ctx, 18, 30, w - 36, 18, 9, true, true);

    var contX = fires ? 28 + ((cycle * 0.65) % 1) * (w - 56) : 28;
    ctx.save();
    ctx.fillStyle = "#34d399";
    ctx.shadowColor = "#34d399";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(contX, 39, 8.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    if (fires) {
      drawNeonVector(ctx, contX + 10, 39, contX + 34, 39, "#34d399", 2, "");
    }

    // Pista 2: Axón Mielínico (Conducción Saltatoria 100 m/s en Nodos de Ranvier)
    ctx.fillStyle = "#22d3ee";
    ctx.font = "bold 11px Outfit, sans-serif";
    ctx.fillText("2. Axón Mielínico (Vaina de Mielina aislante — Conducción Saltatoria en Nodos: ~100 m/s)", 18, 72);

    ctx.fillStyle = "rgba(15, 23, 62, 0.9)";
    ctx.strokeStyle = "rgba(56, 189, 248, 0.45)";
    drawRoundRect(ctx, 18, 102, w - 36, 18, 9, true, true);

    var nodes = 5;
    var trackW = w - 48;
    var segW = trackW / nodes;
    for (var n = 0; n < nodes; n++) {
      var mx = 24 + n * segW;
      ctx.save();
      var mGrad = ctx.createLinearGradient(mx, 92, mx, 130);
      mGrad.addColorStop(0, "rgba(168, 85, 247, 0.85)");
      mGrad.addColorStop(1, "rgba(99, 102, 241, 0.85)");
      ctx.fillStyle = mGrad;
      ctx.strokeStyle = "#e9d5ff";
      ctx.lineWidth = 1.5;
      drawRoundRect(ctx, mx + 7, 94, segW - 16, 34, 8, true, true);
      ctx.restore();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 9px Outfit, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Mielina", mx + segW * 0.5 - 1, 114);
    }

    if (fires) {
      var jumpPhase = (cycle * 2.8) % 1;
      var totalJumpX = 24 + jumpPhase * trackW;
      var localArc = Math.abs(Math.sin(jumpPhase * nodes * Math.PI));
      var sparkY = 102 - localArc * 28;

      // Trazar arcos saltatorios punteados
      ctx.save();
      ctx.strokeStyle = "rgba(34, 211, 238, 0.45)";
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1.5;
      for (var a = 0; a < nodes; a++) {
        var sx = 24 + a * segW + 2;
        var ex = 24 + (a + 1) * segW - 2;
        ctx.beginPath();
        ctx.moveTo(sx, 96);
        ctx.quadraticCurveTo((sx + ex) * 0.5, 66, ex, 96);
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.fillStyle = "#22d3ee";
      ctx.shadowColor = "#22d3ee";
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(totalJumpX, sparkY, 9.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Panel inferior: Osciloscopio en vivo de la curva de Potencial de Acción (-70 mV a +30 mV)
    var boxY = 142;
    var boxH = h - boxY - 8;
    ctx.fillStyle = "rgba(6, 10, 32, 0.92)";
    ctx.strokeStyle = "rgba(99, 102, 241, 0.45)";
    drawRoundRect(ctx, 18, boxY, w - 36, boxH, 12, true, true);

    // Línea de umbral -55 mV
    ctx.save();
    ctx.strokeStyle = "rgba(251, 191, 36, 0.5)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(80, boxY + boxH * 0.58);
    ctx.lineTo(w - 30, boxY + boxH * 0.58);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 9.5px Outfit, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Umbral -55mV", 24, boxY + boxH * 0.58 + 3);
    ctx.fillStyle = "#34d399";
    ctx.fillText("+30mV", 24, boxY + 22);
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("-70mV", 24, boxY + boxH - 14);

    // Curva del potencial de acción
    ctx.save();
    ctx.strokeStyle = fires ? "#22d3ee" : "#fbbf24";
    ctx.lineWidth = 2.5;
    ctx.shadowColor = fires ? "#22d3ee" : "#fbbf24";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    var startCurveX = 88;
    var endCurveX = w - 36;
    var spanW = endCurveX - startCurveX;
    for (var s = 0; s <= 60; s++) {
      var u = s / 60;
      var cx = startCurveX + u * spanW;
      var cy = boxY + boxH - 16;
      if (fires) {
        if (u > 0.18 && u < 0.42) {
          var up = (u - 0.18) / 0.24;
          cy = (boxY + boxH - 16) - Math.sin(up * Math.PI * 0.5) * (boxH - 34);
        } else if (u >= 0.42 && u < 0.72) {
          var down = (u - 0.42) / 0.30;
          cy = (boxY + 18) + Math.sin(down * Math.PI * 0.5) * (boxH - 28);
        } else if (u >= 0.72 && u < 0.85) {
          cy = (boxY + boxH - 10) - ((u - 0.72) / 0.13) * 6;
        }
      } else {
        if (u > 0.2 && u < 0.5) {
          cy -= Math.sin(((u - 0.2) / 0.3) * Math.PI) * 14;
        }
      }
      if (s === 0) ctx.moveTo(cx, cy);
      else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "bold 10px Outfit, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(fires ? "Despolarización: Entra Na⁺ (+30mV) | Repolarización: Sale K⁺" : "Subumbral: No se abren canales de Na⁺ masivos", w - 30, boxY + 20);
  }

  // --- SIMULADOR 3: ÓSMOSIS Y TONICIDAD EN GLÓBULOS ROJOS ---
  var osmoState = { mode: "iso" };
  function setOsmosisMode(m) {
    osmoState.mode = m;
    var btns = document.querySelectorAll(".osmo-mode-btn");
    for (var i = 0; i < btns.length; i++) {
      if (btns[i].getAttribute("data-omode") === m) btns[i].classList.add("active");
      else btns[i].classList.remove("active");
    }
    var desc = document.getElementById("simOsmoDesc");
    if (desc) {
      if (m === "iso") {
        desc.innerHTML = "<strong class='text-emerald-300'>✓ Solución Isotónica (Suero Fisiológico NaCl 0,9% P/V ≈ 0,15 M):</strong> Igual concentración osmótica afuera y adentro del eritrocito. El flujo neto de agua es cero y el glóbulo rojo conserva su morfología bicóncava normal.";
      } else if (m === "hiper") {
        desc.innerHTML = "<strong class='text-amber-300'>⚠ Solución Hipertónica (&gt; 0,9% NaCl — Mayor concentración afuera):</strong> El agua viaja por ósmosis hacia el exterior más concentrado. El eritrocito se deshidrata, pierde volumen y se arruga (<strong>Crenación</strong>).";
      } else {
        desc.innerHTML = "<strong class='text-cyan-300'>⚡ Solución Hipotónica (&lt; 0,9% NaCl / Agua destilada):</strong> El agua ingresa masivamente hacia el citoplasma más concentrado. La célula se hincha hasta estallar su membrana (<strong>Hemólisis</strong>).";
      }
    }
  }
  window.setOsmosisMode = setOsmosisMode;

  function drawOsmosisCanvas(timeMs) {
    var canvas = document.getElementById("canvasOsmosis");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    var cx = w * 0.5;
    var cy = h * 0.55;
    var pulse = Math.sin(timeMs * 0.004);

    // Cámara de solución acuosa con gradiente cósmico
    var chGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, w * 0.48);
    chGrad.addColorStop(0, "rgba(14, 165, 233, 0.18)");
    chGrad.addColorStop(1, "rgba(8, 13, 42, 0.85)");
    ctx.fillStyle = chGrad;
    ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
    drawRoundRect(ctx, 20, 16, w - 40, h - 28, 16, true, true);

    var rCell = 52;
    var titleText = "";
    if (osmoState.mode === "iso") {
      rCell = 50 + pulse * 1.8;
      titleText = "ISOTÓNICA (0,9% NaCl) · Equilibrio Osmótico (Flujo Neto H₂O = 0)";
      ctx.save();
      var isoGrad = ctx.createRadialGradient(cx - 10, cy - 10, 6, cx, cy, rCell);
      isoGrad.addColorStop(0, "#fb7185");
      isoGrad.addColorStop(0.7, "#e11d48");
      isoGrad.addColorStop(1, "#881337");
      ctx.fillStyle = isoGrad;
      ctx.strokeStyle = "#fda4af";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#f43f5e";
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(cx, cy, rCell, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Depresión bicóncava central
      ctx.fillStyle = "rgba(136, 19, 55, 0.65)";
      ctx.beginPath();
      ctx.arc(cx, cy, rCell * 0.42, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (osmoState.mode === "hiper") {
      rCell = 36 + pulse * 1.2;
      titleText = "HIPERTÓNICA (> 0,9% NaCl) · Sale H₂O de la célula → CRENACIÓN";
      ctx.save();
      ctx.fillStyle = "#be123c";
      ctx.strokeStyle = "#fbbf24";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#f59e0b";
      ctx.shadowBlur = 14;
      ctx.beginPath();
      var spikes = 12;
      for (var s = 0; s < spikes * 2; s++) {
        var rad = (s % 2 === 0) ? rCell + 6 : rCell - 7;
        var ang = (s / (spikes * 2)) * Math.PI * 2 + timeMs * 0.0005;
        var sx = cx + Math.cos(ang) * rad;
        var sy = cy + Math.sin(ang) * rad;
        if (s === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    } else {
      rCell = 72 + Math.abs(pulse) * 6;
      titleText = "HIPOTÓNICA (< 0,9% NaCl) · Entra H₂O masivamente → HEMÓLISIS";
      ctx.save();
      var hipoGrad = ctx.createRadialGradient(cx, cy, 8, cx, cy, rCell);
      hipoGrad.addColorStop(0, "#fda4af");
      hipoGrad.addColorStop(0.75, "#f43f5e");
      hipoGrad.addColorStop(1, "#38bdf8");
      ctx.fillStyle = hipoGrad;
      ctx.strokeStyle = "#22d3ee";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.shadowColor = "#22d3ee";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(cx, cy, rCell, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Moléculas de agua (H2O) y vectores de flujo osmótico
    var dropProgress = (timeMs * 0.0011) % 1;
    for (var d = 0; d < 8; d++) {
      var aAng = (d / 8) * Math.PI * 2;
      var dist = 58 + dropProgress * 46;
      if (osmoState.mode === "hipo") dist = 108 - dropProgress * 46;
      else if (osmoState.mode === "iso") dist = 74 + Math.sin(dropProgress * Math.PI * 2 + d) * 14;

      var dx = cx + Math.cos(aAng) * dist;
      var dy = cy + Math.sin(aAng) * dist;

      ctx.save();
      ctx.fillStyle = "#22d3ee";
      ctx.shadowColor = "#22d3ee";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(dx, dy, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Vectores laterales explicativos (estilo CienciaLab Imagen 3)
    if (osmoState.mode === "hiper") {
      drawNeonVector(ctx, cx + 48, cy, cx + 115, cy, "#fbbf24", 2.5, "Sale H₂O");
      drawNeonVector(ctx, cx - 48, cy, cx - 115, cy, "#fbbf24", 2.5, "Sale H₂O");
    } else if (osmoState.mode === "hipo") {
      drawNeonVector(ctx, cx + 125, cy, cx + 78, cy, "#22d3ee", 2.5, "Entra H₂O");
      drawNeonVector(ctx, cx - 125, cy, cx - 78, cy, "#22d3ee", 2.5, "Entra H₂O");
    } else {
      drawNeonVector(ctx, cx + 62, cy - 10, cx + 112, cy - 10, "#34d399", 2, "H₂O ⇄");
      drawNeonVector(ctx, cx + 112, cy + 12, cx + 62, cy + 12, "#34d399", 2, "");
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11.5px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(titleText, cx, 36);
  }

  // --- SIMULADOR 4: ESCALA DE pH/pOH Y BUFFER BICARBONATO (PULMÓN - RIÑÓN) ---
  var phState = { ph: 7.40 };
  function updatePhSimulator() {
    var slider = document.getElementById("simPhSlider");
    if (!slider) return;
    var ph = parseFloat(slider.value);
    phState.ph = ph;
    var poh = 14 - ph;
    var hConc = Math.pow(10, -ph);
    var ohConc = Math.pow(10, -poh);

    document.getElementById("simPhVal").innerText = ph.toFixed(2);
    document.getElementById("simPohVal").innerText = poh.toFixed(2);
    document.getElementById("simHConcVal").innerText = hConc.toExponential(2) + " M";
    document.getElementById("simOhConcVal").innerText = ohConc.toExponential(2) + " M";

    var typeEl = document.getElementById("simPhType");
    var bioEl = document.getElementById("simPhBioMatch");
    if (Math.abs(ph - 7.0) < 0.05) {
      typeEl.innerText = "NEUTRO ([H⁺] = [OH⁻] = 10⁻⁷ M)";
      typeEl.className = "font-bold text-emerald-400";
    } else if (ph < 7.0) {
      typeEl.innerText = "ÁCIDO ([H⁺] > 10⁻⁷ M > [OH⁻])";
      typeEl.className = "font-bold text-rose-400";
    } else {
      typeEl.innerText = "BÁSICO / ALCALINO ([OH⁻] > 10⁻⁷ M > [H⁺])";
      typeEl.className = "font-bold text-cyan-400";
    }

    var match = "";
    if (ph >= 1.2 && ph <= 2.2) match = "Jugo gástrico (pH 1,5 – 2,0: ácido clorhídrico HCl)";
    else if (ph > 2.2 && ph < 5.5) match = "Bebidas ácidas / Vinagre / Jugo de limón";
    else if (ph >= 5.5 && ph < 6.5) match = "Orina normal (pH > 5,5)";
    else if (ph >= 6.5 && ph < 7.34) match = "Saliva (6,5–7,4) / Lágrimas (7,0) — En sangre: ACIDOSIS (< 7,35)";
    else if (ph >= 7.35 && ph <= 7.45) match = "✓ SANGRE ARTERIAL NORMAL (Homeostasis: pH 7,35 – 7,45)";
    else if (ph > 7.45 && ph <= 8.2) match = "Jugo pancreático (pH ~8,0) — En sangre: ALCALOSIS (> 7,45)";
    else if (ph > 8.2 && ph <= 9.0) match = "Bilis (pH ~8,5) / Bicarbonato de sodio";
    else match = "Soluciones alcalinas fuertes (Leche de magnesia, Amoníaco, NaOH)";
    bioEl.innerText = match;
  }

  function nudgePh(delta) {
    var slider = document.getElementById("simPhSlider");
    if (!slider) return;
    var next = Math.min(14, Math.max(0, parseFloat(slider.value) + delta));
    slider.value = next.toFixed(2);
    updatePhSimulator();
  }
  window.nudgePh = nudgePh;
  function setPhHomeostasis() { var sl = document.getElementById('simPhSlider'); if (sl) { sl.value = '7.40'; updatePhSimulator(); } }
  window.setPhHomeostasis = setPhHomeostasis;

  function drawPhCartoonCanvas(timeMs) {
    var canvas = document.getElementById("canvasPhCartoon");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    var ph = phState.ph;
    var midY = h * 0.50;

    // Barra superior de espectro de pH (0 a 14) con marcador activo
    var barX = 36;
    var barW = w - 72;
    var phGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
    phGrad.addColorStop(0, "#ef4444");
    phGrad.addColorStop(0.28, "#f59e0b");
    phGrad.addColorStop(0.5, "#10b981");
    phGrad.addColorStop(0.72, "#06b6d4");
    phGrad.addColorStop(1, "#8b5cf6");
    ctx.fillStyle = phGrad;
    drawRoundRect(ctx, barX, 18, barW, 14, 7, true, false);

    var markerX = barX + (ph / 14) * barW;
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#22d3ee";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(markerX, 25, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 1. Nodo Pulmonar (Izquierda: Regulación de CO2)
    var lungX = 82;
    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 62, 0.9)";
    ctx.strokeStyle = "#f472b6";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#ec4899";
    ctx.shadowBlur = 12;
    drawRoundRect(ctx, lungX - 58, midY - 34, 116, 68, 14, true, true);
    ctx.restore();
    ctx.fillStyle = "#f9a8d4";
    ctx.font = "bold 11px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("PULMONES (CO₂)", lungX, midY - 12);
    ctx.fillStyle = "#ffffff";
    ctx.font = "10.5px Plus Jakarta Sans, sans-serif";
    ctx.fillText(ph < 7.35 ? "↑ Hiperventilación" : (ph > 7.45 ? "↓ Hipoventilación" : "Ventilación Normal"), lungX, midY + 8);
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "9.5px Plus Jakarta Sans, sans-serif";
    ctx.fillText(ph < 7.35 ? "(Exhala más CO₂)" : (ph > 7.45 ? "(Retiene CO₂)" : "(P_CO₂ en equilibrio)"), lungX, midY + 24);

    // 2. Cámara Central del Buffer Bicarbonato (H2CO3 / HCO3-)
    var bufX = w * 0.5;
    var bufCol = (ph >= 7.35 && ph <= 7.45) ? "#34d399" : (ph < 7.35 ? "#fb7185" : "#22d3ee");
    ctx.save();
    ctx.fillStyle = "rgba(18, 28, 78, 0.92)";
    ctx.strokeStyle = bufCol;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = bufCol;
    ctx.shadowBlur = 16;
    drawRoundRect(ctx, bufX - 82, midY - 40, 164, 80, 16, true, true);
    ctx.restore();

    ctx.fillStyle = bufCol;
    ctx.font = "bold 11.5px Outfit, sans-serif";
    ctx.fillText("BUFFER BICARBONATO", bufX, midY - 18);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px Outfit, sans-serif";
    ctx.fillText("CO₂ + H₂O ⇌ H₂CO₃ ⇌ HCO₃⁻ + H⁺", bufX, midY + 2);
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "10px Plus Jakarta Sans, sans-serif";
    ctx.fillText("pH = " + ph.toFixed(2) + "  |  pOH = " + (14 - ph).toFixed(2), bufX, midY + 22);

    // 3. Nodo Renal (Derecha: Excreción H+ / Reabsorción HCO3-)
    var kidX = w - 82;
    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 62, 0.9)";
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#f59e0b";
    ctx.shadowBlur = 12;
    drawRoundRect(ctx, kidX - 58, midY - 34, 116, 68, 14, true, true);
    ctx.restore();
    ctx.fillStyle = "#fde047";
    ctx.font = "bold 11px Outfit, sans-serif";
    ctx.fillText("RIÑONES (H⁺/HCO₃⁻)", kidX, midY - 12);
    ctx.fillStyle = "#ffffff";
    ctx.font = "10.5px Plus Jakarta Sans, sans-serif";
    ctx.fillText(ph < 7.35 ? "Excreta H⁺ en orina" : (ph > 7.45 ? "Excreta HCO₃⁻" : "Balance Renal OK"), kidX, midY + 8);
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "9.5px Plus Jakarta Sans, sans-serif";
    ctx.fillText(ph < 7.35 ? "(Reabsorbe HCO₃⁻)" : (ph > 7.45 ? "(Retiene H⁺)" : "(Orina pH > 5,5)"), kidX, midY + 24);

    // Vectores de compensación entre Pulmón, Buffer y Riñón
    var shiftLeft = ph < 7.35;
    var shiftRight = ph > 7.45;
    drawNeonVector(ctx, bufX - 86, midY, lungX + 62, midY, shiftLeft ? "#fb7185" : "#38bdf8", 2, "");
    drawNeonVector(ctx, bufX + 86, midY, kidX - 62, midY, shiftRight ? "#22d3ee" : "#fbbf24", 2, "");

    var bottomMsg = "✓ Homeostasis Sanguínea (pH 7,35–7,45): Enzimas y proteínas en conformación óptima.";
    if (ph < 7.35) bottomMsg = "⚠ ACIDOSIS (< 7,35): El anión HCO₃⁻ atrapa protones H⁺ y el pulmón elimina el exceso como CO₂.";
    else if (ph > 7.45) bottomMsg = "⚠ ALCALOSIS (> 7,45): El ácido débil H₂CO₃ libera H⁺ para neutralizar el exceso de OH⁻.";

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 11px Outfit, sans-serif";
    ctx.fillText(bottomMsg, w * 0.5, h - 14);
  }

  // --- SIMULADOR 5: ECUACIÓN DE CONTINUIDAD, PLACA DE ATEROMA, VENTURI Y REYNOLDS ---
  var hemoState = { plaquePct: 45, qMlMin: 5240, particles: [] };
  for (var pIdx = 0; pIdx < 20; pIdx++) {
    hemoState.particles.push({ x: pIdx / 20, yOff: ((pIdx % 5) - 2) * 0.28 });
  }

  function updateHemoSimulator() {
    var pSlider = document.getElementById("simHemoPlaque");
    var qSlider = document.getElementById("simHemoQ");
    if (!pSlider || !qSlider) return;

    hemoState.plaquePct = parseFloat(pSlider.value);
    hemoState.qMlMin = parseFloat(qSlider.value);

    document.getElementById("simHemoPlaqueVal").innerText = hemoState.plaquePct + "%";
    document.getElementById("simHemoQVal").innerText = hemoState.qMlMin + " ml/min";

    var q_m3s = (hemoState.qMlMin * 1e-6) / 60;
    var s1_cm2 = 4.36;
    var s2_cm2 = s1_cm2 * (1 - hemoState.plaquePct / 100);
    var v1_cms = (hemoState.qMlMin / 60) / s1_cm2;
    var v2_cms = (hemoState.qMlMin / 60) / Math.max(0.15, s2_cm2);

    var reynolds = Math.round(1200 * (v2_cms / 20));
    var flowType = reynolds < 2000 ? "Laminar (Re < 2000)" : (reynolds <= 4000 ? "Transicional (2000 < Re < 4000)" : "Turbulento (Re > 4000: vórtices)");

    document.getElementById("simHemoOutQ").innerText = q_m3s.toExponential(3) + " m³/s";
    document.getElementById("simHemoOutV1").innerText = v1_cms.toFixed(1) + " cm/s (S₁ = " + s1_cm2 + " cm²)";
    document.getElementById("simHemoOutV2").innerText = v2_cms.toFixed(1) + " cm/s (S₂ = " + s2_cm2.toFixed(2) + " cm²)";
    document.getElementById("simHemoOutRe").innerText = "Re ≈ " + reynolds + " → " + flowType;

    var alertEl = document.getElementById("simHemoAlert");
    if (hemoState.plaquePct >= 65) {
      alertEl.innerText = "⚠️ ¡PELIGRO DE TROMBOSIS / ACV OBSTRUCTIVO! Al reducirse la sección (↓S₂), la velocidad se dispara (↑V₂) y cae la presión lateral interna (↓P_int < P_ext), colapsando el vaso.";
      alertEl.className = "text-xs font-bold text-rose-400 mt-2";
    } else {
      alertEl.innerText = "✓ Ecuación de Continuidad (Q = V₁·S₁ = V₂·S₂ = cte): A menor sección transversal, mayor velocidad sanguínea.";
      alertEl.className = "text-xs font-bold text-emerald-400 mt-2";
    }
  }

  function drawHemoCanvas(timeMs) {
    var canvas = document.getElementById("canvasHemo");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    var midY = h * 0.56;
    var baseHalfH = 54;
    var narrowFactor = 1 - (hemoState.plaquePct / 100) * 0.82;

    function halfHeightAt(xNorm) {
      if (xNorm > 0.3 && xNorm < 0.7) {
        var bell = Math.sin(((xNorm - 0.3) / 0.4) * Math.PI);
        return baseHalfH * (1 - (1 - narrowFactor) * bell);
      }
      return baseHalfH;
    }

    // Luz arterial con gradiente neon
    ctx.fillStyle = "rgba(244, 63, 94, 0.16)";
    ctx.beginPath();
    ctx.moveTo(0, midY - baseHalfH);
    for (var x = 0; x <= w; x += 5) ctx.lineTo(x, midY - halfHeightAt(x / w));
    for (var x2 = w; x2 >= 0; x2 -= 5) ctx.lineTo(x2, midY + halfHeightAt(x2 / w));
    ctx.closePath();
    ctx.fill();

    // Placas lipídicas de ateroma superior e inferior
    if (hemoState.plaquePct > 4) {
      ctx.save();
      ctx.fillStyle = "rgba(234, 179, 8, 0.82)";
      ctx.strokeStyle = "#fef08a";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(w * 0.3, midY - baseHalfH);
      for (var px = w * 0.3; px <= w * 0.7; px += 4) ctx.lineTo(px, midY - halfHeightAt(px / w));
      ctx.lineTo(w * 0.7, midY - baseHalfH);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(w * 0.3, midY + baseHalfH);
      for (var px2 = w * 0.3; px2 <= w * 0.7; px2 += 4) ctx.lineTo(px2, midY + halfHeightAt(px2 / w));
      ctx.lineTo(w * 0.7, midY + baseHalfH);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Paredes endoteliales iluminadas
    ctx.save();
    ctx.strokeStyle = "#fb7185";
    ctx.lineWidth = 3;
    ctx.shadowColor = "#f43f5e";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    for (var wx = 0; wx <= w; wx += 5) {
      var wy = midY - halfHeightAt(wx / w);
      if (wx === 0) ctx.moveTo(wx, wy); else ctx.lineTo(wx, wy);
    }
    ctx.stroke();
    ctx.beginPath();
    for (var wx2 = 0; wx2 <= w; wx2 += 5) {
      var wy2 = midY + halfHeightAt(wx2 / w);
      if (wx2 === 0) ctx.moveTo(wx2, wy2); else ctx.lineTo(wx2, wy2);
    }
    ctx.stroke();
    ctx.restore();

    // Eritrocitos y líneas de corriente con vectores velocidad V1 y V2 (estilo Imagen 3)
    for (var i = 0; i < hemoState.particles.length; i++) {
      var p = hemoState.particles[i];
      var hh = halfHeightAt(p.x);
      var localSpeed = 0.0022 * (baseHalfH / Math.max(10, hh)) * (hemoState.qMlMin / 5240);
      p.x = (p.x + localSpeed) % 1;
      var py = midY + p.yOff * (hh - 10);
      var inNarrow = p.x > 0.36 && p.x < 0.64;
      if (hemoState.plaquePct > 55 && p.x > 0.52 && p.x < 0.82) {
        py += Math.sin(timeMs * 0.025 + i * 2) * 6;
      }

      var pxScreen = p.x * w;
      ctx.save();
      ctx.fillStyle = inNarrow ? "#22d3ee" : "#fb7185";
      ctx.shadowColor = inNarrow ? "#22d3ee" : "#f43f5e";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(pxScreen, py, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Vector velocidad proporcional a la rapidez local
      var vecLen = inNarrow ? 22 : 10;
      ctx.strokeStyle = inNarrow ? "#67e8f9" : "#fecdd3";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(pxScreen + 6, py);
      ctx.lineTo(pxScreen + 6 + vecLen, py);
      ctx.stroke();
      ctx.restore();
    }

    // Vectores superiores comparando S1/V1 vs S2/V2
    drawNeonVector(ctx, 45, 32, 120, 32, "#34d399", 2.5, "S₁ grande → V₁ normal");
    drawNeonVector(ctx, w * 0.5 - 55, 32, w * 0.5 + 65, 32, "#22d3ee", 3, "↓S₂ estrecho → ↑↑V₂ (↓P_int)");

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 11px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Obstrucción: " + hemoState.plaquePct + "%  |  Efecto Venturi: al acelerarse la sangre cae la presión lateral interna", w * 0.5, h - 10);
  }

  // --- SIMULADOR 6: FUERZAS DE STARLING, ALBÚMINA, LINFÁTICO Y EDEMA ---
  var starState = { phCap: 35, poCap: 25, perm: 10, lymphBlocked: false };
  function updateStarlingSimulator() {
    var phCapSlider = document.getElementById("simStarPhCap");
    var poCapSlider = document.getElementById("simStarPoCap");
    var permSlider = document.getElementById("simStarPerm");
    var lymphSel = document.getElementById("simStarLymph");
    if (!phCapSlider || !poCapSlider || !permSlider || !lymphSel) return;

    var phCap = parseFloat(phCapSlider.value);
    var poCap = parseFloat(poCapSlider.value);
    var perm = parseFloat(permSlider.value);
    var lymphBlocked = lymphSel.value === "blocked";

    starState.phCap = phCap;
    starState.poCap = poCap;
    starState.perm = perm;
    starState.lymphBlocked = lymphBlocked;

    document.getElementById("simStarPhCapVal").innerText = phCap + " mmHg";
    document.getElementById("simStarPoCapVal").innerText = poCap + " mmHg";
    document.getElementById("simStarPermVal").innerText = perm + "%";

    var netFiltration = (phCap - poCap) + (perm * 0.25) + (lymphBlocked ? 12 : 0);
    var diagEl = document.getElementById("simStarDiagnosis");
    var causeList = [];
    if (phCap > 38) causeList.push("↑ Presión Hidrostática capilar (hipertensión / insuficiencia cardíaca o venosa)");
    if (poCap < 22) causeList.push("↓ Presión Oncótica por hipoproteinemia/falta de albúmina (desnutrición, cirrosis, síndrome nefrótico)");
    if (perm > 25) causeList.push("↑ Permeabilidad capilar endotelial (inflamación, alergia, picadura o quemaduras)");
    if (lymphBlocked) causeList.push("Obstrucción del drenaje linfático (extirpación quirúrgica de ganglios o infección)");

    if (causeList.length === 0 && netFiltration <= 12.5) {
      diagEl.innerHTML = '<span class="text-emerald-400 font-bold">✓ HOMEOSTASIS MICROCIRCULATORIA:</span> Filtración en el extremo arterial compensada por la reabsorción oncótica (Albúmina) en el extremo venoso y el drenaje linfático.';
    } else {
      diagEl.innerHTML = '<span class="text-rose-400 font-bold">⚠️ EDEMA INTERSTICIAL ACTIVO:</span> Acumulación de líquido entre las células.<br><span class="text-slate-200">Mecanismo: ' + causeList.join(" + ") + '.</span>';
    }
  }

  function applyStarlingPreset(preset) {
    var phCapSlider = document.getElementById("simStarPhCap");
    var poCapSlider = document.getElementById("simStarPoCap");
    var permSlider = document.getElementById("simStarPerm");
    var lymphSel = document.getElementById("simStarLymph");
    if (!phCapSlider || !poCapSlider || !permSlider || !lymphSel) return;

    if (preset === "normal") {
      phCapSlider.value = 35; poCapSlider.value = 25; permSlider.value = 10; lymphSel.value = "normal";
    } else if (preset === "hipertension") {
      phCapSlider.value = 52; poCapSlider.value = 25; permSlider.value = 10; lymphSel.value = "normal";
    } else if (preset === "hipoproteinemia") {
      phCapSlider.value = 35; poCapSlider.value = 12; permSlider.value = 10; lymphSel.value = "normal";
    } else if (preset === "inflamacion") {
      phCapSlider.value = 38; poCapSlider.value = 22; permSlider.value = 65; lymphSel.value = "normal";
    } else if (preset === "linfedema") {
      phCapSlider.value = 35; poCapSlider.value = 25; permSlider.value = 10; lymphSel.value = "blocked";
    }
    updateStarlingSimulator();
  }
  window.applyStarlingPreset = applyStarlingPreset;

  function drawStarlingCartoonCanvas(timeMs) {
    var canvas = document.getElementById("canvasStarlingCartoon");
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    var hasEdema = starState.phCap > 38 || starState.poCap < 22 || starState.perm > 25 || starState.lymphBlocked;

    // Nivel de líquido en el espacio intersticial (abajo)
    var waterH = hasEdema ? 86 + Math.sin(timeMs * 0.004) * 4 : 36;
    var intGrad = ctx.createLinearGradient(0, h - waterH - 8, 0, h);
    intGrad.addColorStop(0, hasEdema ? "rgba(34, 211, 238, 0.42)" : "rgba(56, 189, 248, 0.16)");
    intGrad.addColorStop(1, hasEdema ? "rgba(99, 102, 241, 0.48)" : "rgba(15, 23, 62, 0.35)");
    ctx.fillStyle = intGrad;
    ctx.strokeStyle = hasEdema ? "#22d3ee" : "rgba(56, 189, 248, 0.3)";
    drawRoundRect(ctx, 20, h - waterH - 10, w - 40, waterH, 12, true, true);

    // Capilar Sanguíneo (Extremo Arterial a la izquierda -> Extremo Venoso a la derecha)
    var capY = 52;
    var capGrad = ctx.createLinearGradient(40, capY, w - 40, capY);
    capGrad.addColorStop(0, "rgba(244, 63, 94, 0.55)");
    capGrad.addColorStop(0.5, "rgba(168, 85, 247, 0.45)");
    capGrad.addColorStop(1, "rgba(59, 130, 246, 0.55)");
    ctx.fillStyle = capGrad;
    ctx.strokeStyle = starState.perm > 25 ? "#fbbf24" : "#f43f5e";
    ctx.lineWidth = 2.5;
    if (starState.perm > 25) ctx.setLineDash([7, 5]);
    drawRoundRect(ctx, 40, capY, w - 80, 44, 22, true, true);
    ctx.setLineDash([]);

    // 1. Extremo Arterial (Filtración por Presión Hidrostática)
    var artX = 120;
    ctx.fillStyle = "#fda4af";
    ctx.font = "bold 11px Outfit, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("EXTREMO ARTERIAL", artX, 24);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10.5px Outfit, sans-serif";
    ctx.fillText("P. Hidrostática = " + starState.phCap + " mmHg", artX, 40);
    drawNeonVector(ctx, artX, capY + 26, artX, capY + 86, "#22d3ee", 3, "");
    ctx.fillStyle = "#22d3ee";
    ctx.fillText("↓ Filtración (Sale H₂O)", artX, capY + 102);

    // 2. Extremo Venoso (Reabsorción por Presión Oncótica / Albúmina)
    var venX = w - 125;
    ctx.fillStyle = "#93c5fd";
    ctx.font = "bold 11px Outfit, sans-serif";
    ctx.fillText("EXTREMO VENOSO", venX, 24);
    ctx.fillStyle = "#fde047";
    ctx.font = "bold 10.5px Outfit, sans-serif";
    ctx.fillText("P. Oncótica (Albúmina) = " + starState.poCap + " mmHg", venX, 40);
    drawNeonVector(ctx, venX, capY + 86, venX, capY + 26, "#fbbf24", 3, "");
    ctx.fillStyle = "#fde047";
    ctx.fillText("↑ Reabsorción (Entra H₂O)", venX, capY + 102);

    // 3. Sistema Linfático en la base
    var lymX = w * 0.5;
    var lymY = h - 28;
    ctx.save();
    ctx.fillStyle = starState.lymphBlocked ? "rgba(244, 63, 94, 0.3)" : "rgba(16, 185, 129, 0.28)";
    ctx.strokeStyle = starState.lymphBlocked ? "#fb7185" : "#34d399";
    ctx.lineWidth = 2;
    drawRoundRect(ctx, lymX - 95, lymY - 14, 190, 26, 13, true, true);
    ctx.restore();
    ctx.fillStyle = starState.lymphBlocked ? "#fda4af" : "#6ee7b7";
    ctx.font = "bold 10.5px Outfit, sans-serif";
    ctx.fillText(starState.lymphBlocked ? "🚫 Vaso Linfático Obstruido (Linfedema)" : "✓ Drenaje Linfático Activo", lymX, lymY + 3);
  }

  // ---------------------------------------------------------------------------
  // 7. CALCULADORAS PASO A PASO
  // ---------------------------------------------------------------------------
  function calcSolutions() {
    var mSt = parseFloat(document.getElementById("calcSolMst").value) || 0;
    var unitSt = document.getElementById("calcSolUnitSt").value;
    var vSc = parseFloat(document.getElementById("calcSolVsc").value) || 100;
    var mr = parseFloat(document.getElementById("calcSolMr").value) || 180;
    var dens = parseFloat(document.getElementById("calcSolDens").value) || 1.0;

    var gSt = unitSt === "mg" ? mSt / 1000 : mSt;
    var pctPV = (gSt * 100) / vSc;
    var mSc = vSc * dens;
    var pctPP = (gSt * 100) / mSc;
    var molesInV = gSt / mr;
    var molarity = (molesInV * 1000) / vSc;

    var out = document.getElementById("calcSolResult");
    if (!out) return;
    out.innerHTML =
      '<div class="text-cyan-300 font-bold mb-1">Resolución Paso a Paso:</div>' +
      '<div>1) <b>Masa de soluto en gramos:</b> ' + gSt.toFixed(4) + ' g de soluto en ' + vSc + ' ml de solución.</div>' +
      '<div>2) <b>Concentración % P/V (% m/v):</b> (' + gSt.toFixed(4) + ' g × 100 ml) ÷ ' + vSc + ' ml = <span class="m-unit">' + pctPV.toFixed(3) + ' % P/V ✓</span></div>' +
      '<div>3) <b>Masa de solución (con δ = ' + dens + ' g/ml):</b> m<sub>sc</sub> = ' + vSc + ' ml × ' + dens + ' g/ml = ' + mSc.toFixed(2) + ' g sc → <span class="m-unit">' + pctPP.toFixed(3) + ' % P/P ✓</span></div>' +
      '<div>4) <b>Molaridad (con Masa Molar = ' + mr + ' g/mol):</b> n = ' + gSt.toFixed(4) + ' g ÷ ' + mr + ' g/mol = ' + molesInV.toExponential(3) + ' mol en ' + vSc + ' ml → En 1000 ml: <span class="m-unit">' + molarity.toFixed(4) + ' M ✓</span></div>';
  }
  window.calcSolutions = calcSolutions;

  function calcHydro() {
    var densKgM3 = parseFloat(document.getElementById("calcHydDens").value) || 1000;
    var hMeters = parseFloat(document.getElementById("calcHydH").value) || 1;
    var areaCm2 = parseFloat(document.getElementById("calcHydArea").value) || 3;
    var g = 9.8;

    var pPascal = densKgM3 * g * hMeters;
    var pMmHg = (pPascal * 760) / 101325;
    var pAtm = pPascal / 101325;
    var areaM2 = areaCm2 * 1e-4;
    var forceN = pPascal * areaM2;

    var out = document.getElementById("calcHydResult");
    if (!out) return;
    out.innerHTML =
      '<div class="text-cyan-300 font-bold mb-1">Resolución Hidrostática Paso a Paso:</div>' +
      '<div>1) <b>Presión Hidrostática (P = δ · g · h):</b> ' + densKgM3 + ' kg/m³ × 9,8 m/s² × ' + hMeters + ' m = <span class="m-unit">' + pPascal.toFixed(2) + ' Pa ✓</span></div>' +
      '<div>2) <b>Equivalencias de Presión:</b> <span class="text-amber-300 font-bold">' + pMmHg.toFixed(2) + ' mmHg</span> (' + pAtm.toFixed(4) + ' atm)</div>' +
      '<div>3) <b>Área en SI:</b> ' + areaCm2 + ' cm² = ' + areaM2.toExponential(2) + ' m² → <b>Fuerza (F = P · S):</b> <span class="m-unit">' + forceN.toFixed(2) + ' N ✓</span></div>';
  }
  window.calcHydro = calcHydro;

  // ---------------------------------------------------------------------------
  // 8. AUTOEVALUACIÓN INTERACTIVA
  // ---------------------------------------------------------------------------
  var quizQuestions = [
    {
      q: "1. En una herida abierta, donde la piel está lesionada y hay sangre, ¿cómo es la resistencia a la corriente eléctrica respecto de la piel sana?",
      options: [
        "Mayor, porque la sangre coagula y aísla el paso de electrones.",
        "Menor, porque la sangre contiene plasma con electrolitos disueltos que conducen la electricidad con mayor facilidad que la piel.",
        "Igual, porque la resistencia del cuerpo humano es constante (4400 Ω) sin importar la humedad.",
        "Nula, porque la sangre actúa como un superconductor a 37 °C."
      ],
      correct: 1,
      exp: "Respuesta oficial (Campus UNAJ): Falso que sea mayor. La sangre está formada por plasma rico en electrolitos (iones Na⁺, K⁺, Cl⁻) que son conductores de segunda especie y conducen la corriente eléctrica con mucha mayor facilidad que la piel seca, disminuyendo drásticamente la resistencia."
    },
    {
      q: "2. ¿Qué función cumple el disyuntor diferencial (umbral 40 mA) ante una descarga domiciliaria de 220 V sobre una persona descalza (R = 4400 Ω, I = 50 mA)?",
      options: [
        "Protege únicamente los cables contra el Efecto Joule cuando hay cortocircuito.",
        "Detecta la diferencia entre corriente de entrada y salida (> 40 mA) y abre el circuito evitando que la persona llegue al paro cardíaco.",
        "Aumenta el voltaje a 380 V para compensar la fuga a tierra.",
        "Reduce la frecuencia de la corriente alterna de 50 Hz a 0 Hz."
      ],
      correct: 1,
      exp: "Por Ley de Ohm, I = 220 V ÷ 4400 Ω = 0,05 A = 50 mA. Como 50 mA supera los 40 mA de sensibilidad del disyuntor diferencial, este corta el suministro antes de alcanzar el umbral de fibrilación/paro cardíaco (> 75 mA en CA)."
    },
    {
      q: "3. Durante el potencial de acción neuronal, ¿qué proceso genera la recuperación del potencial de reposo negativo (-70 mV)?",
      options: [
        "El ingreso masivo de Na⁺ por canales activados por voltaje (despolarización).",
        "La salida de iones K⁺ a través de la membrana celular, proceso llamado repolarización de la membrana.",
        "La entrada de proteínas negativas desde el líquido intersticial.",
        "La destrucción de la vaina de mielina en los nodos de Ranvier."
      ],
      correct: 1,
      exp: "La entrada de Na⁺ produce la despolarización (llevando el potencial a +30 mV), mientras que la salida de K⁺ restaura la negatividad interna (repolarización de la membrana). Luego la bomba Na⁺/K⁺ restablece los gradientes iónicos."
    },
    {
      q: "4. ¿Cuál es la concentración % P/V y la Molaridad de una solución de Glucosa (C₆H₁₂O₆, Masa Molar = 180 g/mol) al 17% m/v?",
      options: [
        "17% P/V y 0,944 M",
        "1,7% P/V y 0,111 M",
        "17% P/V y 1,80 M",
        "8,5% P/V y 0,0944 M"
      ],
      correct: 0,
      exp: "17% m/v significa 17 g de glucosa en 100 ml de solución (es decir, 170 g en 1000 ml). Dividiendo por la masa molar de la glucosa (180 g/mol): M = 170 g ÷ 180 g/mol = 0,944 M."
    },
    {
      q: "5. Si el pH de una solución pasa de 7 a 5, ¿cómo varió su concentración de protones [H⁺] y qué carácter tiene?",
      options: [
        "Disminuyó 2 veces y es básica.",
        "Aumentó 20 veces y es ácida.",
        "Aumentó 100 veces (de 10⁻⁷ M a 10⁻⁵ M) y es ácida.",
        "Aumentó 100 veces y su pOH pasó a ser 5."
      ],
      correct: 2,
      exp: "Como la escala de pH es logarítmica de base 10 (pH = -log[H⁺]), cada unidad que baja el pH implica multiplicar por 10 la concentración de H⁺. Bajar 2 unidades (de 7 a 5) implica 10 × 10 = 100 veces más [H⁺], y el pOH vale 14 - 5 = 9."
    },
    {
      q: "6. ¿Por qué la velocidad de la sangre en los capilares (0,03 cm/s) es muchísimo menor que en la arteria aorta (20 cm/s)?",
      options: [
        "Porque el caudal en los capilares es casi cero.",
        "Porque la suma de las áreas de todos los capilares (lecho vascular total) es mucho mayor que el área de la aorta, cumpliendo la Ecuación de Continuidad (Q = V · S = cte).",
        "Porque la presión hidrostática en la aorta es cero.",
        "Porque la sangre en los capilares es un gas ideal compresible."
      ],
      correct: 1,
      exp: "Por la Ecuación de Continuidad (V₁·S₁ = V₂·S₂), a caudal constante, la velocidad es inversamente proporcional a la sección transversal total. El área conjunta de toda la red capilar es máxima, por lo que la velocidad baja al mínimo (0,03 cm/s) favoreciendo el intercambio de nutrientes y gases."
    },
    {
      q: "7. Según las Fuerzas de Starling y la fisiología del edema, ¿por qué la desnutrición severa o la cirrosis hepática producen edema?",
      options: [
        "Porque aumentan la síntesis de albúmina y elevan la presión oncótica capilar.",
        "Porque disminuyen las proteínas plasmáticas (albúmina), reduciendo la presión oncótica capilar que normalmente reabsorbe agua hacia el interior del capilar en el extremo venoso.",
        "Porque bloquean la bomba de sodio-potasio en el axón neuronal.",
        "Porque transforman el flujo laminar en turbulento (Re > 4000)."
      ],
      correct: 1,
      exp: "La presión oncótica (coloidosmótica) capilar depende de las proteínas plasmáticas, fundamentalmente la albúmina. Si falta albúmina (por desnutrición, cirrosis o pérdida renal), cae la presión oncótica en el extremo venoso, el líquido no regresa al capilar y se acumula en el espacio intersticial (edema)."
    },
    {
      q: "8. A un niño de 10 kg le prescriben 15 mg/kg de paracetamol cada 8 horas. ¿Cuántos gramos de paracetamol recibe por día?",
      options: [
        "0,15 g por día",
        "0,45 g por día",
        "1,50 g por día",
        "4,50 g por día"
      ],
      correct: 1,
      exp: "Cada toma (cada 8 h) es de 15 mg/kg × 10 kg = 150 mg. En 24 horas hay 3 tomas (24 ÷ 8 = 3), por lo que recibe 150 mg × 3 = 450 mg diarios. Pasando a gramos (450 ÷ 1000) se obtienen 0,45 g por día."
    }
  ];

  var userAnswers = {};

  function renderQuiz() {
    var container = document.getElementById("quizContainer");
    if (!container) return;
    var html = "";
    for (var i = 0; i < quizQuestions.length; i++) {
      var item = quizQuestions[i];
      html += '<div class="glass-subcard mb-3.5" id="quiz-card-' + i + '">' +
        '<div class="font-bold text-white mb-3 text-sm md:text-base flex items-start gap-2.5">' +
          '<span class="step-num-circle">' + (i + 1) + '</span>' +
          '<span>' + item.q.replace(/^\d+\.\s*/, "") + '</span>' +
        '</div>' +
        '<div class="space-y-2">';
      for (var j = 0; j < item.options.length; j++) {
        html += '<button type="button" class="w-full text-left p-3 rounded-xl bg-slate-900/75 hover:bg-indigo-950/80 border border-indigo-500/30 text-xs md:text-sm text-slate-200 transition block quiz-opt-btn" data-q="' + i + '" data-opt="' + j + '">' +
          '<span class="font-bold text-cyan-400 mr-2">' + String.fromCharCode(65 + j) + ')</span> ' + item.options[j] +
          '</button>';
      }
      html += '</div>' +
        '<div id="quiz-exp-' + i + '" class="hidden mt-3 p-3.5 rounded-xl bg-slate-950/90 border border-cyan-500/40 text-xs text-slate-200"></div>' +
        '</div>';
    }
    container.innerHTML = html;

    var optBtns = container.querySelectorAll(".quiz-opt-btn");
    for (var b = 0; b < optBtns.length; b++) {
      optBtns[b].addEventListener("click", function () {
        var qIdx = parseInt(this.getAttribute("data-q"), 10);
        var oIdx = parseInt(this.getAttribute("data-opt"), 10);
        answerQuiz(qIdx, oIdx);
      });
    }
  }

  function answerQuiz(qIdx, oIdx) {
    userAnswers[qIdx] = oIdx;
    var item = quizQuestions[qIdx];
    var card = document.getElementById("quiz-card-" + qIdx);
    var btns = card.querySelectorAll(".quiz-opt-btn");
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.remove("bg-emerald-950/90", "border-emerald-400", "bg-rose-950/90", "border-rose-400");
      if (i === item.correct) {
        btns[i].classList.add("bg-emerald-950/90", "border-emerald-400");
      } else if (i === oIdx && oIdx !== item.correct) {
        btns[i].classList.add("bg-rose-950/90", "border-rose-400");
      }
    }
    var expBox = document.getElementById("quiz-exp-" + qIdx);
    expBox.classList.remove("hidden");
    if (oIdx === item.correct) {
      expBox.innerHTML = '<span class="text-emerald-400 font-bold">✓ ¡Respuesta Correcta!</span> ' + item.exp;
    } else {
      expBox.innerHTML = '<span class="text-rose-400 font-bold">✕ Respuesta Incorrecta.</span> ' + item.exp;
    }
    updateQuizScore();
  }

  function updateQuizScore() {
    var total = quizQuestions.length;
    var answered = 0;
    var correct = 0;
    for (var k in userAnswers) {
      if (Object.prototype.hasOwnProperty.call(userAnswers, k)) {
        answered++;
        if (userAnswers[k] === quizQuestions[k].correct) correct++;
      }
    }
    var scoreEl = document.getElementById("quizScoreReadout");
    if (scoreEl) {
      scoreEl.innerText = "Puntaje: " + correct + " / " + total + " (" + answered + " respondidas)";
    }
  }

  function resetQuiz() {
    userAnswers = {};
    renderQuiz();
    updateQuizScore();
  }
  window.resetQuiz = resetQuiz;

  // ---------------------------------------------------------------------------
  // 9. INICIALIZACIÓN Y BUCLE ANIMADO A 60 FPS CON AISLAMIENTO D/ERRORES
  // ---------------------------------------------------------------------------
  function initApp() {
    var tabBtns = document.querySelectorAll("[data-tab]");
    for (var i = 0; i < tabBtns.length; i++) {
      tabBtns[i].addEventListener("click", function () {
        navigateToSection(this.getAttribute("data-tab"));
      });
    }

    window.addEventListener("scroll", onScrollUpdate, { passive: true });
    onScrollUpdate();

    var searchInp = document.getElementById("globalSearchInput");
    if (searchInp) {
      searchInp.addEventListener("input", function () {
        runGlobalSearch(searchInp, "searchResultsPanel", "searchResultsList");
      });
    }

    var stickySearchInp = document.getElementById("stickySearchInput");
    if (stickySearchInp) {
      stickySearchInp.addEventListener("input", function () {
        runGlobalSearch(stickySearchInp, "stickySearchResultsPanel", "stickySearchResultsList");
      });
    }

    var ohmIds = ["simOhmV", "simOhmR", "simOhmT", "simOhmMode"];
    for (var o = 0; o < ohmIds.length; o++) {
      var el = document.getElementById(ohmIds[o]);
      if (el) el.addEventListener("input", updateOhmSimulator);
    }

    // Interacción al hacer clic sobre los lienzos de los simuladores
    var cOhm = document.getElementById("canvasOhm");
    if (cOhm) {
      cOhm.addEventListener("click", function () {
        ohmState.pulseBoost = 1.0;
      });
    }

    var neuroEl = document.getElementById("simNeuroStim");
    if (neuroEl) neuroEl.addEventListener("input", updateNeuroSimulator);

    var cNeuro = document.getElementById("canvasNeuro");
    if (cNeuro) {
      cNeuro.addEventListener("click", function () {
        if (neuroEl) {
          neuroEl.value = neuroState.stimulus >= -55 ? -65 : -40;
          updateNeuroSimulator();
        }
      });
    }

    var phEl = document.getElementById("simPhSlider");
    if (phEl) phEl.addEventListener("input", updatePhSimulator);

    var hemoIds = ["simHemoPlaque", "simHemoQ"];
    for (var h = 0; h < hemoIds.length; h++) {
      var hel = document.getElementById(hemoIds[h]);
      if (hel) hel.addEventListener("input", updateHemoSimulator);
    }

    var starIds = ["simStarPhCap", "simStarPoCap", "simStarPerm", "simStarLymph"];
    for (var s = 0; s < starIds.length; s++) {
      var sel = document.getElementById(starIds[s]);
      if (sel) sel.addEventListener("input", updateStarlingSimulator);
    }

    updateOhmSimulator();
    updateNeuroSimulator();
    setOsmosisMode("iso");
    updatePhSimulator();
    updateHemoSimulator();
    updateStarlingSimulator();
    calcSolutions();
    calcHydro();
    renderQuiz();

    function animate(timeMs) {
      try { updateScrollMorphAndAtoms(timeMs); } catch (e) {}
      try { drawAmbientParticles(timeMs); } catch (e) {}
      try { drawOhmCanvas(timeMs); } catch (e) {}
      try { drawNeuroCanvas(timeMs); } catch (e) {}
      try { drawOsmosisCanvas(timeMs); } catch (e) {}
      try { drawPhCartoonCanvas(timeMs); } catch (e) {}
      try { drawHemoCanvas(timeMs); } catch (e) {}
      try { drawStarlingCartoonCanvas(timeMs); } catch (e) {}
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();