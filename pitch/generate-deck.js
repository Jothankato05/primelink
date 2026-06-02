const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author  = "Primers Corporation";
pres.title   = "PrimeLink — Community Risk Intelligence Network";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:        "040C18",
  card:      "0B1628",
  cardMid:   "0E1E35",
  border:    "1A2E4A",
  green:     "00C896",
  greenDim:  "005C46",
  amber:     "F5A623",
  red:       "FF3A5C",
  blue:      "3B82F6",
  purple:    "8B5CF6",
  white:     "F1F5F9",
  sub:       "94A3B8",
  muted:     "475569",
  dim:       "334155",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const makeShadow = () => ({ type: "outer", blur: 14, offset: 4, angle: 135, color: "000000", opacity: 0.3 });

function bgFill(slide) {
  slide.background = { color: C.bg };
}

function sectionLabel(slide, text, x, y) {
  slide.addText(text, {
    x, y, w: 4, h: 0.22,
    fontSize: 7, bold: true, color: C.green,
    charSpacing: 3, fontFace: "Calibri", margin: 0,
  });
}

function titleBlock(slide, title, subtitle, x, y, w) {
  slide.addText(title, {
    x, y, w: w ?? 9, h: 0.7,
    fontSize: 32, bold: true, color: C.white,
    fontFace: "Calibri", margin: 0,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x, y: y + 0.72, w: w ?? 9, h: 0.35,
      fontSize: 14, color: C.sub,
      fontFace: "Calibri", margin: 0,
    });
  }
}

function greenBar(slide, x, y, h) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w: 0.05, h,
    fill: { color: C.green }, line: { color: C.green, width: 0 },
  });
}

function card(slide, x, y, w, h, fillColor) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: fillColor ?? C.card },
    line: { color: C.border, width: 1 },
    shadow: makeShadow(),
  });
}

function bigStat(slide, value, label, x, y, valueColor) {
  slide.addText(value, {
    x, y, w: 2.5, h: 0.8,
    fontSize: 44, bold: true, color: valueColor ?? C.green,
    fontFace: "Calibri", margin: 0, align: "center",
  });
  slide.addText(label, {
    x, y: y + 0.82, w: 2.5, h: 0.28,
    fontSize: 9, color: C.sub, bold: true,
    charSpacing: 1.2, fontFace: "Calibri", margin: 0, align: "center",
  });
}

// ─── SLIDE 1 — Cover ──────────────────────────────────────────────────────────
(function cover() {
  const sl = pres.addSlide();
  bgFill(sl);

  // Full-width green accent at top
  sl.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: C.green }, line: { color: C.green, width: 0 },
  });

  // Faint grid lines (decorative)
  for (let i = 0; i < 6; i++) {
    sl.addShape(pres.shapes.LINE, {
      x: 0, y: 0.06 + i * 0.96, w: 10, h: 0,
      line: { color: C.border, width: 0.5, dashType: "solid" },
    });
  }

  // Logo mark — hexagonal square
  sl.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.35, w: 0.7, h: 0.7,
    fill: { color: C.green },
    line: { color: C.green, width: 0 },
    shadow: makeShadow(),
  });
  sl.addShape(pres.shapes.RECTANGLE, {
    x: 0.65, y: 1.5, w: 0.4, h: 0.4,
    fill: { color: C.bg },
    line: { color: C.bg, width: 0 },
  });
  sl.addShape(pres.shapes.OVAL, {
    x: 0.74, y: 1.59, w: 0.22, h: 0.22,
    fill: { color: C.green },
    line: { color: C.green, width: 0 },
  });

  // Brand name
  sl.addText([
    { text: "Prime", options: { color: C.white, bold: true } },
    { text: "Link", options: { color: C.green, bold: true } },
  ], {
    x: 1.35, y: 1.28, w: 6, h: 0.9,
    fontSize: 54, fontFace: "Calibri", margin: 0,
  });

  // Tagline
  sl.addText("COMMUNITY RISK INTELLIGENCE NETWORK", {
    x: 1.35, y: 2.18, w: 7.5, h: 0.28,
    fontSize: 9, color: C.sub, charSpacing: 2.5,
    fontFace: "Calibri", bold: true, margin: 0,
  });

  // Divider
  sl.addShape(pres.shapes.LINE, {
    x: 0.5, y: 2.72, w: 9, h: 0,
    line: { color: C.border, width: 1 },
  });

  // Three platform stats
  const stats = [
    { v: "8",    l: "NIGERIAN LGAs" },
    { v: "5",    l: "RISK SECTORS"  },
    { v: "127",  l: "IoT SENSORS"   },
  ];
  stats.forEach((s, i) => {
    const x = 0.5 + i * 3.1;
    sl.addText(s.v, {
      x, y: 2.98, w: 2.8, h: 0.6,
      fontSize: 36, bold: true, color: C.green, fontFace: "Calibri", margin: 0,
    });
    sl.addText(s.l, {
      x, y: 3.6, w: 2.8, h: 0.22,
      fontSize: 8, color: C.muted, bold: true, charSpacing: 1.2,
      fontFace: "Calibri", margin: 0,
    });
  });

  // Description
  sl.addText(
    "Real-time intelligence across five sectors — enabling proactive intervention before community crises escalate.",
    {
      x: 0.5, y: 4.08, w: 7.5, h: 0.5,
      fontSize: 13, color: C.sub, fontFace: "Calibri",
      italic: true, margin: 0,
    }
  );

  // Footer
  sl.addText("PRIMERS CORPORATION  —  NIGERIA  —  2026", {
    x: 0.5, y: 5.2, w: 9, h: 0.2,
    fontSize: 8, color: C.muted, bold: true, charSpacing: 1.2,
    fontFace: "Calibri", margin: 0,
  });
})();

// ─── SLIDE 2 — The Problem ─────────────────────────────────────────────────────
(function problem() {
  const sl = pres.addSlide();
  bgFill(sl);

  sectionLabel(sl, "THE PROBLEM", 0.5, 0.35);
  titleBlock(sl, "Community crises are invisible until they cascade.", "Nigeria's 36M+ smallholder farmers and rural communities lack any integrated early-warning system.", 0.5, 0.65, 9);

  // Three problem cards
  const problems = [
    {
      num: "36M+",
      heading: "Farmers with no risk visibility",
      body: "Smallholder farmers have no reliable indicator of soil health, pest activity, or economic exposure until a harvest fails.",
      col: C.amber,
    },
    {
      num: "774",
      heading: "LGAs with siloed data",
      body: "Health clinics, agricultural extension officers, and environmental monitors each hold isolated data. No system connects the dots.",
      col: C.red,
    },
    {
      num: "$10B+",
      heading: "Parametric insurance market untapped",
      body: "Africa's parametric insurance sector is growing rapidly, but requires real-time trigger data that no one is providing at community resolution.",
      col: C.blue,
    },
  ];

  problems.forEach((p, i) => {
    const x = 0.5 + i * 3.1;
    card(sl, x, 1.72, 2.9, 3.5, C.cardMid);
    sl.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.72, w: 2.9, h: 0.05,
      fill: { color: p.col }, line: { color: p.col, width: 0 },
    });
    sl.addText(p.num, {
      x: x + 0.18, y: 1.95, w: 2.5, h: 0.6,
      fontSize: 34, bold: true, color: p.col, fontFace: "Calibri", margin: 0,
    });
    sl.addText(p.heading, {
      x: x + 0.18, y: 2.58, w: 2.55, h: 0.45,
      fontSize: 12, bold: true, color: C.white, fontFace: "Calibri", margin: 0,
    });
    sl.addText(p.body, {
      x: x + 0.18, y: 3.06, w: 2.55, h: 1.9,
      fontSize: 10, color: C.sub, fontFace: "Calibri", margin: 0,
    });
  });
})();

// ─── SLIDE 3 — The Cascade ────────────────────────────────────────────────────
(function cascade() {
  const sl = pres.addSlide();
  bgFill(sl);

  sectionLabel(sl, "THE CORE INSIGHT", 0.5, 0.35);
  titleBlock(sl, "One sector failing triggers the entire community.", "The cascade is predictable. With the right data layer, it is preventable.", 0.5, 0.65, 9);

  const stages = [
    { label: "Environment",   detail: "Soil moisture drops\nAir quality degrades",      col: C.green  },
    { label: "Agriculture",   detail: "Crop yields decline\nPest pressure rises",        col: C.amber  },
    { label: "Finance",       detail: "Insurance claims surge\nMicro-credit defaults",   col: C.blue   },
    { label: "Health",        detail: "Malnutrition increases\nClinic admissions rise",  col: C.red    },
  ];

  stages.forEach((s, i) => {
    const x = 0.4 + i * 2.35;

    // Card
    card(sl, x, 1.8, 2.1, 2.6, C.cardMid);
    sl.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.8, w: 2.1, h: 0.05,
      fill: { color: s.col }, line: { color: s.col, width: 0 },
    });

    // Step number
    sl.addText(`0${i + 1}`, {
      x: x + 0.14, y: 1.96, w: 0.5, h: 0.45,
      fontSize: 11, bold: true, color: s.col, fontFace: "Calibri", margin: 0,
    });

    // Label
    sl.addText(s.label, {
      x: x + 0.14, y: 2.42, w: 1.85, h: 0.36,
      fontSize: 14, bold: true, color: C.white, fontFace: "Calibri", margin: 0,
    });

    // Detail
    sl.addText(s.detail, {
      x: x + 0.14, y: 2.82, w: 1.85, h: 1.35,
      fontSize: 10, color: C.sub, fontFace: "Calibri", margin: 0,
    });

    // Arrow between cards
    if (i < 3) {
      sl.addShape(pres.shapes.LINE, {
        x: x + 2.1, y: 3.1, w: 0.25, h: 0,
        line: { color: C.border, width: 2 },
      });
      sl.addText("›", {
        x: x + 2.22, y: 2.98, w: 0.2, h: 0.3,
        fontSize: 16, color: C.muted, fontFace: "Calibri", margin: 0,
      });
    }
  });

  // Bottom call-out
  card(sl, 0.5, 4.65, 9, 0.62, "091422");
  sl.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.65, w: 0.06, h: 0.62,
    fill: { color: C.green }, line: { color: C.green, width: 0 },
  });
  sl.addText("PrimeLink detects Stage 01 and models the full cascade — giving operators a 2–4 week intervention window before Stage 04 materialises.", {
    x: 0.78, y: 4.76, w: 8.8, h: 0.4,
    fontSize: 11, color: C.white, fontFace: "Calibri", italic: true, margin: 0,
  });
})();

// ─── SLIDE 4 — The Solution ───────────────────────────────────────────────────
(function solution() {
  const sl = pres.addSlide();
  bgFill(sl);

  sectionLabel(sl, "THE SOLUTION", 0.5, 0.35);
  titleBlock(sl, "A unified intelligence layer for every Nigerian community.", null, 0.5, 0.65, 9);

  const caps = [
    { title: "Cross-Sector Risk Engine",       body: "Correlates five sectors in real time. When environment degrades, the engine propagates weighted deltas downstream — agriculture, finance, health — before each sector's own sensors flag the shift.", col: C.green  },
    { title: "Parametric Insurance Trigger",   body: "When the Finance Risk Index drops below a configurable threshold, the platform automatically logs a disbursement event. No claims adjuster. No forms. Payouts execute on verified data.", col: C.blue   },
    { title: "127-Sensor IoT Simulator",       body: "Production-grade sensor network simulation: random walk with mean reversion, per-community baselines, 3-second tick rate. Ready to replace with physical hardware on day one of deployment.", col: C.amber  },
    { title: "Community Risk Index",           body: "One composite 0–100 score per LGA, updated every 3 seconds. Color-coded status: Optimal / Stable / Moderate / Elevated / Critical. Readable by any stakeholder — from field officer to minister.", col: C.purple },
  ];

  caps.forEach((c, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = 0.5 + col * 4.75;
    const y = 1.52 + row * 2.05;

    card(sl, x, y, 4.5, 1.8, C.cardMid);
    greenBar(sl, x, y, 1.8);

    sl.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.18, y: y + 0.18, w: 0.3, h: 0.3,
      fill: { color: c.col, transparency: 80 },
      line: { color: c.col, width: 1 },
    });

    sl.addText(c.title, {
      x: x + 0.6, y: y + 0.16, w: 3.7, h: 0.32,
      fontSize: 12, bold: true, color: C.white, fontFace: "Calibri", margin: 0,
    });
    sl.addText(c.body, {
      x: x + 0.2, y: y + 0.55, w: 4.1, h: 1.15,
      fontSize: 9.5, color: C.sub, fontFace: "Calibri", margin: 0,
    });
  });
})();

// ─── SLIDE 5 — Five Sectors ───────────────────────────────────────────────────
(function sectors() {
  const sl = pres.addSlide();
  bgFill(sl);

  sectionLabel(sl, "FIVE-SECTOR COVERAGE", 0.5, 0.35);
  titleBlock(sl, "Built for every judge. Relevant to every stakeholder.", "Each sector is a full data domain — not a secondary feature.", 0.5, 0.65, 9);

  const data = [
    { key: "Environment",   unit: "Soil / Air / Water",       detail: "pH levels, moisture content, air quality index, water contamination flags. Root cause of most community crises.",       col: C.green  },
    { key: "Agriculture",   unit: "Crop Health",              detail: "NDVI proxy, pest cluster detection, rainfall adequacy score. Covers 36M+ smallholder farmers across Nigeria.",          col: C.amber  },
    { key: "Health",        unit: "Community Wellbeing",      detail: "Clinic capacity, disease incidence rate, malnutrition index. 8 connected facilities per LGA in current dataset.",      col: C.red    },
    { key: "Finance",       unit: "Economic Resilience",      detail: "Insurance coverage ratio, micro-credit utilisation, parametric trigger readiness. Direct link to disbursement engine.", col: C.blue   },
    { key: "IoT Network",   unit: "Sensor Coverage",          detail: "Uptime percentage, data quality score, coverage density map. 127 sensors simulated; hardware-ready architecture.",    col: C.purple },
  ];

  data.forEach((d, i) => {
    const x = 0.3 + i * 1.88;
    card(sl, x, 1.7, 1.72, 3.5, C.cardMid);
    sl.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.7, w: 1.72, h: 0.05,
      fill: { color: d.col }, line: { color: d.col, width: 0 },
    });

    // Sector number
    sl.addText(`0${i + 1}`, {
      x: x + 0.12, y: 1.88, w: 0.5, h: 0.3,
      fontSize: 9, bold: true, color: d.col, fontFace: "Calibri", margin: 0,
    });

    sl.addText(d.key, {
      x: x + 0.12, y: 2.22, w: 1.48, h: 0.38,
      fontSize: 12, bold: true, color: C.white, fontFace: "Calibri", margin: 0,
    });
    sl.addText(d.unit, {
      x: x + 0.12, y: 2.62, w: 1.48, h: 0.26,
      fontSize: 8.5, color: d.col, fontFace: "Calibri", bold: true, margin: 0,
    });
    sl.addText(d.detail, {
      x: x + 0.12, y: 2.93, w: 1.5, h: 2.0,
      fontSize: 8.5, color: C.sub, fontFace: "Calibri", margin: 0,
    });
  });
})();

// ─── SLIDE 6 — Platform Overview ──────────────────────────────────────────────
(function platform() {
  const sl = pres.addSlide();
  bgFill(sl);

  sectionLabel(sl, "THE PLATFORM", 0.5, 0.35);
  titleBlock(sl, "Three environments. One coherent system.", null, 0.5, 0.65, 9);

  const envs = [
    {
      name: "Web Dashboard",
      stack: "React · Vite · Tailwind · Socket.io",
      features: [
        "Live composite risk index per LGA",
        "Five-sector gauges, real-time updates",
        "Crisis simulation: Drought, Flood, Disease Outbreak",
        "Onboarding tour for new operators",
        "One-click Export Report (offline-ready HTML)",
      ],
      col: C.green,
    },
    {
      name: "Backend API",
      stack: "Node.js · Express 5 · Socket.io · Risk Engine",
      features: [
        "127-sensor IoT simulator, 3s tick, mean reversion",
        "Cross-sector correlation weights and propagation",
        "Parametric insurance trigger at configurable threshold",
        "REST: /api/communities, /api/alerts",
        "WebSocket: sensor:update, alert:new, map:overview",
      ],
      col: C.blue,
    },
    {
      name: "Mobile App",
      stack: "Expo · React Native · React Navigation",
      features: [
        "Animated splash with SYSTEM ONLINE status",
        "Community picker across all 8 Nigerian LGAs",
        "Sector grid with live progress bars, 5s polling",
        "Alert feed with severity filtering",
        "LIVE / SIM badge: transparent data source",
      ],
      col: C.purple,
    },
  ];

  envs.forEach((e, i) => {
    const x = 0.5 + i * 3.1;
    card(sl, x, 1.52, 2.9, 3.7, C.cardMid);
    sl.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.52, w: 2.9, h: 0.05,
      fill: { color: e.col }, line: { color: e.col, width: 0 },
    });

    sl.addText(e.name, {
      x: x + 0.18, y: 1.72, w: 2.55, h: 0.38,
      fontSize: 13, bold: true, color: C.white, fontFace: "Calibri", margin: 0,
    });
    sl.addText(e.stack, {
      x: x + 0.18, y: 2.14, w: 2.55, h: 0.28,
      fontSize: 8.5, color: e.col, fontFace: "Calibri", bold: true, margin: 0,
    });

    e.features.forEach((f, j) => {
      sl.addText([
        { text: "— ", options: { color: e.col, bold: true } },
        { text: f,    options: { color: C.sub             } },
      ], {
        x: x + 0.18, y: 2.52 + j * 0.32, w: 2.55, h: 0.28,
        fontSize: 9, fontFace: "Calibri", margin: 0,
      });
    });
  });
})();

// ─── SLIDE 7 — Market Opportunity ────────────────────────────────────────────
(function market() {
  const sl = pres.addSlide();
  bgFill(sl);

  sectionLabel(sl, "MARKET OPPORTUNITY", 0.5, 0.35);
  titleBlock(sl, "A $30B+ market with no incumbent at this layer.", "Nigeria alone has 774 LGAs. PrimeLink is the only cross-sector community risk product in market.", 0.5, 0.65, 9);

  // Three TAM cards
  const tam = [
    { val: "$30B+",  label: "GLOBAL AGRI-FINTECH TAM",     detail: "Global agricultural technology and parametric insurance market by 2028.",                          col: C.green  },
    { val: "$10B+",  label: "PARAMETRIC INSURANCE TAM",    detail: "Africa's parametric insurance sector — fastest-growing insurance sub-segment on the continent.",  col: C.amber  },
    { val: "36M+",   label: "DIRECT BENEFICIARIES",        detail: "Smallholder farmers in Nigeria eligible for parametric crop insurance and community risk alerts.", col: C.blue   },
  ];

  tam.forEach((t, i) => {
    const x = 0.5 + i * 3.1;
    card(sl, x, 1.7, 2.9, 1.6, C.cardMid);
    sl.addText(t.val, {
      x: x + 0.18, y: 1.9, w: 2.55, h: 0.55,
      fontSize: 32, bold: true, color: t.col, fontFace: "Calibri", margin: 0,
    });
    sl.addText(t.label, {
      x: x + 0.18, y: 2.48, w: 2.55, h: 0.22,
      fontSize: 8, bold: true, color: C.sub, charSpacing: 0.8, fontFace: "Calibri", margin: 0,
    });
    sl.addText(t.detail, {
      x: x + 0.18, y: 2.73, w: 2.55, h: 0.44,
      fontSize: 9, color: C.muted, fontFace: "Calibri", margin: 0,
    });
  });

  // Bottom competitive table header
  sl.addText("COMPETITIVE LANDSCAPE", {
    x: 0.5, y: 3.55, w: 9, h: 0.25,
    fontSize: 8, bold: true, color: C.green, charSpacing: 2, fontFace: "Calibri", margin: 0,
  });

  const cols = ["Capability", "PrimeLink", "AgriTech Startups", "Govt FMARD", "Insurance Cos"];
  const colW = [2.2, 1.65, 1.65, 1.65, 1.65];

  const rows = [
    ["Cross-sector correlation",  "Yes",  "No",  "No",  "No"  ],
    ["Real-time sensor data",     "Yes",  "No",  "No",  "No"  ],
    ["Parametric trigger engine", "Yes",  "No",  "No",  "Some"],
    ["Community-level resolution","Yes",  "Some","No",  "No"  ],
    ["Mobile + Web + API",        "Yes",  "Some","No",  "No"  ],
  ];

  const tableData = [
    cols.map((c, i) => ({
      text: c,
      options: { bold: true, color: "FFFFFF", fill: { color: "091422" }, fontSize: 9, align: i === 0 ? "left" : "center" },
    })),
    ...rows.map(row => row.map((cell, i) => {
      const isYes  = cell === "Yes";
      const isSome = cell === "Some";
      const isNo   = cell === "No";
      return {
        text: cell,
        options: {
          color: isYes ? C.green : isSome ? C.amber : isNo ? C.red : C.white,
          fill: { color: C.card },
          fontSize: 9,
          bold: isYes,
          align: i === 0 ? "left" : "center",
        },
      };
    })),
  ];

  sl.addTable(tableData, {
    x: 0.5, y: 3.84, w: 8.85, h: 1.55,
    colW,
    border: { pt: 0.5, color: C.border },
  });
})();

// ─── SLIDE 8 — Business Model ─────────────────────────────────────────────────
(function bizModel() {
  const sl = pres.addSlide();
  bgFill(sl);

  sectionLabel(sl, "BUSINESS MODEL", 0.5, 0.35);
  titleBlock(sl, "Three compounding revenue streams. One data moat.", null, 0.5, 0.65, 9);

  const streams = [
    {
      num: "01",
      title: "Government SaaS License",
      price: "$4,800 / LGA / year",
      detail: "Annual license sold to state and federal government agencies. With 774 LGAs nationally, full penetration represents $3.7M ARR from Nigeria alone.",
      kpi: "$3.7M ARR @ 100% Nigeria penetration",
      col: C.green,
    },
    {
      num: "02",
      title: "Parametric Insurance API",
      price: "Per-trigger fee model",
      detail: "Insurance companies license the risk trigger API. Each confirmed threshold breach generates a billable event. Aligns incentives: PrimeLink earns when the system works.",
      kpi: "Asset-light, scales with enrolled farmers",
      col: C.blue,
    },
    {
      num: "03",
      title: "Data Intelligence Layer",
      price: "Annual subscription",
      detail: "Anonymised community risk indices, trend data, and forecast models sold to NGOs, development finance institutions, agribusinesses, and reinsurers.",
      kpi: "High-margin, zero marginal cost",
      col: C.purple,
    },
  ];

  streams.forEach((s, i) => {
    const x = 0.5 + i * 3.1;
    card(sl, x, 1.58, 2.9, 3.75, C.cardMid);
    sl.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.58, w: 2.9, h: 0.05,
      fill: { color: s.col }, line: { color: s.col, width: 0 },
    });

    sl.addText(s.num, {
      x: x + 0.18, y: 1.76, w: 0.5, h: 0.32,
      fontSize: 11, bold: true, color: s.col, fontFace: "Calibri", margin: 0,
    });
    sl.addText(s.title, {
      x: x + 0.18, y: 2.1, w: 2.55, h: 0.42,
      fontSize: 12, bold: true, color: C.white, fontFace: "Calibri", margin: 0,
    });
    sl.addText(s.price, {
      x: x + 0.18, y: 2.55, w: 2.55, h: 0.26,
      fontSize: 9.5, bold: true, color: s.col, fontFace: "Calibri", margin: 0,
    });
    sl.addText(s.detail, {
      x: x + 0.18, y: 2.86, w: 2.55, h: 1.55,
      fontSize: 9, color: C.sub, fontFace: "Calibri", margin: 0,
    });

    // KPI strip
    sl.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.18, y: 4.92, w: 2.55, h: 0.26,
      fill: { color: s.col, transparency: 85 },
      line: { color: s.col, width: 1 },
    });
    sl.addText(s.kpi, {
      x: x + 0.24, y: 4.93, w: 2.45, h: 0.24,
      fontSize: 8, color: s.col, bold: true, fontFace: "Calibri", margin: 0,
    });
  });
})();

// ─── SLIDE 9 — Traction ───────────────────────────────────────────────────────
(function traction() {
  const sl = pres.addSlide();
  bgFill(sl);

  sectionLabel(sl, "TRACTION", 0.5, 0.35);
  titleBlock(sl, "Built, deployed, and live — in a single sprint.", "PrimeLink is not a concept. It is a working product.", 0.5, 0.65, 9);

  const items = [
    { label: "Web dashboard deployed",    detail: "Live on GitHub Pages. React + Vite + Tailwind + Socket.io. Full community picker, sector gauges, crisis simulator, onboarding tour, export report.",                  col: C.green  },
    { label: "Backend API live",          detail: "Express 5 + Socket.io. IoT sensor simulator at 3s tick across 8 LGAs. Risk engine with cross-sector correlation. Parametric insurance trigger logic.",               col: C.green  },
    { label: "Mobile app complete",       detail: "Expo React Native. SplashScreen, Dashboard, Alert Feed with filtering, React Navigation bottom tabs. LIVE / SIM data source transparency.",                           col: C.green  },
    { label: "Investor pitch document",   detail: "Standalone print-ready HTML pitch covering problem, solution, market, business model, traction, and $350K seed ask with full use-of-funds breakdown.",               col: C.green  },
    { label: "GitHub repository public",  detail: "Full open codebase under Jothankato05/primelink. Conventional commits, professional README, architecture diagram, API reference, deployment guide.",                  col: C.green  },
    { label: "8 communities simulated",   detail: "Kano North, Ibadan Central, Maiduguri Metro, Jos North, Enugu East, Sokoto Central, Port Harcourt City, Abuja Municipal — all with distinct baseline risk profiles.", col: C.green  },
  ];

  items.forEach((it, i) => {
    const row = Math.floor(i / 2);
    const col = i % 2;
    const x = 0.5 + col * 4.75;
    const y = 1.55 + row * 1.32;

    card(sl, x, y, 4.5, 1.16, C.cardMid);
    greenBar(sl, x, y, 1.16);

    // Green check mark
    sl.addShape(pres.shapes.OVAL, {
      x: x + 0.22, y: y + 0.35, w: 0.26, h: 0.26,
      fill: { color: C.green, transparency: 20 },
      line: { color: C.green, width: 0 },
    });

    sl.addText(it.label, {
      x: x + 0.62, y: y + 0.12, w: 3.75, h: 0.3,
      fontSize: 11, bold: true, color: C.white, fontFace: "Calibri", margin: 0,
    });
    sl.addText(it.detail, {
      x: x + 0.62, y: y + 0.44, w: 3.75, h: 0.66,
      fontSize: 8.5, color: C.sub, fontFace: "Calibri", margin: 0,
    });
  });
})();

// ─── SLIDE 10 — The Ask ───────────────────────────────────────────────────────
(function ask() {
  const sl = pres.addSlide();
  bgFill(sl);

  sectionLabel(sl, "SEED ROUND", 0.5, 0.35);
  titleBlock(sl, "Raising $350,000 to deploy, license, and scale.", "12-month runway to first five government LGA contracts and 10,000 enrolled farmers.", 0.5, 0.65, 9);

  // Big ask number
  card(sl, 0.5, 1.58, 4.3, 1.5, C.cardMid);
  sl.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.58, w: 4.3, h: 0.05,
    fill: { color: C.green }, line: { color: C.green, width: 0 },
  });
  sl.addText("$350,000", {
    x: 0.7, y: 1.78, w: 3.9, h: 0.72,
    fontSize: 46, bold: true, color: C.green, fontFace: "Calibri", margin: 0,
  });
  sl.addText("SEED FUNDING  —  12-MONTH RUNWAY", {
    x: 0.7, y: 2.52, w: 3.9, h: 0.26,
    fontSize: 8.5, bold: true, color: C.sub, charSpacing: 1, fontFace: "Calibri", margin: 0,
  });

  // Use of funds
  const funds = [
    { pct: "40%", label: "Engineering", detail: "Hardware integration, platform hardening, mobile production build",                    col: C.green  },
    { pct: "25%", label: "Data Partnerships", detail: "FMARD, NIHSA, and state agricultural extension office data agreements",          col: C.blue   },
    { pct: "20%", label: "LGA Onboarding", detail: "Field deployment across first 5 pilot LGAs, training, sensor installation",        col: C.amber  },
    { pct: "15%", label: "Compliance & Legal", detail: "NDPC data privacy compliance, insurance partnership agreements, incorporation", col: C.purple },
  ];

  funds.forEach((f, i) => {
    const x = 5.0 + (i % 2) * 2.4;
    const y = 1.58 + Math.floor(i / 2) * 0.9;
    card(sl, x, y, 2.2, 0.78, C.cardMid);
    sl.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.05, h: 0.78,
      fill: { color: f.col }, line: { color: f.col, width: 0 },
    });
    sl.addText(f.pct, {
      x: x + 0.18, y: y + 0.1, w: 0.65, h: 0.38,
      fontSize: 18, bold: true, color: f.col, fontFace: "Calibri", margin: 0,
    });
    sl.addText(f.label, {
      x: x + 0.18, y: y + 0.44, w: 1.9, h: 0.22,
      fontSize: 9, bold: true, color: C.white, fontFace: "Calibri", margin: 0,
    });
  });

  // Milestones
  sectionLabel(sl, "12-MONTH MILESTONES", 0.5, 3.35);

  const milestones = [
    { m: "M3",  text: "Physical sensor pilot: 3 LGAs, Kano / Oyo / Borno"   },
    { m: "M6",  text: "First 2 government SaaS contracts signed"              },
    { m: "M9",  text: "Parametric insurance API live with 1 insurer partner"  },
    { m: "M12", text: "10,000 enrolled farmers, $180K ARR run rate"          },
  ];

  milestones.forEach((ms, i) => {
    const x = 0.5 + i * 2.3;
    card(sl, x, 3.6, 2.1, 1.6, C.cardMid);
    sl.addText(ms.m, {
      x: x + 0.18, y: 3.74, w: 0.6, h: 0.38,
      fontSize: 16, bold: true, color: C.green, fontFace: "Calibri", margin: 0,
    });
    sl.addText(ms.text, {
      x: x + 0.18, y: 4.16, w: 1.75, h: 0.88,
      fontSize: 9.5, color: C.sub, fontFace: "Calibri", margin: 0,
    });
  });
})();

// ─── SLIDE 11 — Team ──────────────────────────────────────────────────────────
(function team() {
  const sl = pres.addSlide();
  bgFill(sl);

  sectionLabel(sl, "THE TEAM", 0.5, 0.35);
  titleBlock(sl, "Primers Corporation — Nigeria.", "A product and engineering team building sovereign intelligence infrastructure for African communities.", 0.5, 0.65, 9);

  // Team card — founder
  card(sl, 0.5, 1.72, 4.3, 2.8, C.cardMid);
  sl.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 1.72, w: 4.3, h: 0.05,
    fill: { color: C.green }, line: { color: C.green, width: 0 },
  });
  sl.addShape(pres.shapes.OVAL, {
    x: 0.68, y: 1.96, w: 0.88, h: 0.88,
    fill: { color: C.greenDim },
    line: { color: C.green, width: 2 },
  });
  sl.addText("JK", {
    x: 0.68, y: 2.06, w: 0.88, h: 0.5,
    fontSize: 18, bold: true, color: C.green, fontFace: "Calibri", align: "center", margin: 0,
  });
  sl.addText("Jerry K.", {
    x: 1.68, y: 2.0, w: 2.9, h: 0.36,
    fontSize: 16, bold: true, color: C.white, fontFace: "Calibri", margin: 0,
  });
  sl.addText("Founder & Chief Architect", {
    x: 1.68, y: 2.38, w: 2.9, h: 0.24,
    fontSize: 10, color: C.green, fontFace: "Calibri", bold: true, margin: 0,
  });
  sl.addText("Primers Corporation", {
    x: 1.68, y: 2.65, w: 2.9, h: 0.22,
    fontSize: 9, color: C.sub, fontFace: "Calibri", margin: 0,
  });
  sl.addText(
    "Founder of SecureLink and PrimeLink. Building sovereign intelligence infrastructure for Nigeria and Sub-Saharan Africa. Background in product architecture, real-time systems, and community risk data.",
    {
      x: 0.68, y: 3.05, w: 3.95, h: 1.25,
      fontSize: 9.5, color: C.sub, fontFace: "Calibri", margin: 0,
    }
  );

  // What we're looking for
  card(sl, 5.1, 1.72, 4.5, 2.8, C.cardMid);
  sl.addShape(pres.shapes.RECTANGLE, {
    x: 5.1, y: 1.72, w: 4.5, h: 0.05,
    fill: { color: C.blue }, line: { color: C.blue, width: 0 },
  });
  sl.addText("We are looking for:", {
    x: 5.28, y: 1.88, w: 4.1, h: 0.32,
    fontSize: 12, bold: true, color: C.white, fontFace: "Calibri", margin: 0,
  });

  const seeks = [
    "Strategic investors with agri-fintech or govtech portfolio experience",
    "Government partners at state / federal agency level for pilot LGA contracts",
    "Insurance company partnerships for parametric trigger API integration",
    "Agricultural extension network access for direct farmer enrollment",
    "Development finance institutions (AfDB, IFC) aligned with food security mandates",
  ];
  seeks.forEach((s, i) => {
    sl.addText([
      { text: "— ", options: { color: C.blue, bold: true } },
      { text: s,    options: { color: C.sub             } },
    ], {
      x: 5.28, y: 2.3 + i * 0.42, w: 4.1, h: 0.38,
      fontSize: 9.5, fontFace: "Calibri", margin: 0,
    });
  });
})();

// ─── SLIDE 12 — Closing ───────────────────────────────────────────────────────
(function closing() {
  const sl = pres.addSlide();
  bgFill(sl);

  // Full-width green bottom bar
  sl.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.38, w: 10, h: 0.245,
    fill: { color: C.green }, line: { color: C.green, width: 0 },
  });

  // Decorative grid lines
  for (let i = 0; i < 6; i++) {
    sl.addShape(pres.shapes.LINE, {
      x: 0, y: i * 0.94, w: 10, h: 0,
      line: { color: C.border, width: 0.5 },
    });
  }

  // Logo mark
  sl.addShape(pres.shapes.RECTANGLE, {
    x: 4.15, y: 0.72, w: 0.8, h: 0.8,
    fill: { color: C.green },
    line: { color: C.green, width: 0 },
    shadow: makeShadow(),
  });
  sl.addShape(pres.shapes.OVAL, {
    x: 4.4, y: 0.97, w: 0.3, h: 0.3,
    fill: { color: C.bg }, line: { color: C.bg, width: 0 },
  });

  // Brand
  sl.addText([
    { text: "Prime", options: { color: C.white, bold: true } },
    { text: "Link",  options: { color: C.green, bold: true } },
  ], {
    x: 1, y: 1.72, w: 8, h: 0.9,
    fontSize: 52, fontFace: "Calibri", align: "center", margin: 0,
  });

  sl.addText("COMMUNITY RISK INTELLIGENCE NETWORK", {
    x: 1, y: 2.66, w: 8, h: 0.28,
    fontSize: 9, color: C.sub, charSpacing: 2.5, fontFace: "Calibri",
    bold: true, align: "center", margin: 0,
  });

  sl.addShape(pres.shapes.LINE, {
    x: 3, y: 3.12, w: 4, h: 0,
    line: { color: C.border, width: 1 },
  });

  sl.addText("github.com/Jothankato05/primelink", {
    x: 1, y: 3.32, w: 8, h: 0.3,
    fontSize: 11, color: C.green, fontFace: "Calibri", align: "center",
    underline: true, margin: 0,
  });

  sl.addText("jothankato05.github.io/primelink", {
    x: 1, y: 3.68, w: 8, h: 0.3,
    fontSize: 11, color: C.sub, fontFace: "Calibri", align: "center",
    italic: true, margin: 0,
  });

  sl.addText("PRIMERS CORPORATION  —  NIGERIA  —  2026", {
    x: 1, y: 5.08, w: 8, h: 0.22,
    fontSize: 8, color: C.muted, charSpacing: 1.2, fontFace: "Calibri",
    bold: true, align: "center", margin: 0,
  });
})();

// ─── Write file ───────────────────────────────────────────────────────────────
pres.writeFile({ fileName: "PrimeLink-PitchDeck.pptx" })
  .then(() => console.log("PrimeLink-PitchDeck.pptx written successfully."))
  .catch(err => { console.error(err); process.exit(1); });
