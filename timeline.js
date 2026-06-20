const events = [
  {id: "event1", title: "Started Attending IMSA", date: "2023-08", description: "Skipped 9th grade and went to the Illinois Mathematics and Science Academy", side: "right", link: "pages/edu.html#e1"},
  {id: "event2", title: "Graduated IMSA", date: "2026-05", description: "Obtained high school diploma, final unweighted GPA of 3.9/4.0", side: "right", link: "pages/edu.html#e1"},
  {id: "event3", title: "Start Attending UIUC", date: "2026-08", description: "Went to the University of Illinois Urbana-Champaign", side: "right", link: "pages/edu.html#e2"},
  {id: "event4", title: "Accepted to ICML EIML Workshop", date: "2026-07", description: "Paper titled \"Ontological Closure and Structural Limits on Systemic AI\"", side: "right", link: "pages/experience.html#r4"},
  {id: "e4", title: "Presented Poster at PAI26 at Stanford", date: "2026-06", description: "Paper titled \"Corruption Structure Determines Failure Mode in MRI Reconstruction\"", side: "right", link: "pages/experience.html#r3"},
  {id: "event5", title: "Started Research at SIUC", date: "2025-06", description: "Project titled \"Prototyping New Systems for White Light Solar Flare Observation and Data Collection\" with Dr. Brevik's group", side: "right", link: "pages/experience.html#r2"},
  {id: "event6", title: "Started Research at WIU", date: "2024-06", description: "Project titled \"Investigating the Changes in Flux Density of Methanol Masers in the Orion Nebula\" with Dr. Araya's group", side: "right", link: "pages/experience.html#r1"},
  {id: "event7", title: "Finished Research at SIUC", date: "2025-08", description: "Gave a talk and presented a poster at IMSAloquium", side: "right", link: "pages/experience.html#r2"},
  {id: "event8", title: "Finished Research at WIU", date: "2025-05", description: "Gave a talk and presented a poster at IMSAloquium", side: "right", link: "pages/experience.html#r1"},
  {id: "event9", title: "Basic Cryptography Project", date: "2023-02", description: "Encoder and decoder programs in Python", side: "left", link: "pages/proj.html#p1"},
  {id: "event10", title: "Popup Program", date: "2023-08", description: "Experimenting with popups in Python", side: "left", link: "pages/proj.html#p2"},
  {id: "event11", title: "Muscle Neuroscience Project", date: "2024-05", description: "Muscle signal and brainwave data analysis", side: "left", link: "pages/proj.html#p3"},
  {id: "event12", title: "Book Website", date: "2024-07", description: "Small website for tracking reading progress", side: "left", link: "pages/proj.html#p4"},
  {id: "event13", title: "Biology Poster", date: "2024-12", description: "Virtual poster project for a biology class", side: "left", link: "pages/proj.html#p5"},
  {id: "event14", title: "Doppler Effect Simulation", date: "2025-03", description: "Comparing audio files to showcase the doppler effect", side: "left", link: "pages/proj.html#p6"},
  {id: "event15", title: "Beaver Works Summer Institute", date: "2025-07", description: "Attended the UAS-SAR program at MIT and made a drone/radar system", side: "left", link: "pages/proj.html#p7"},
  {id: "event16", title: "Personal Website", date: "2026-1", description: "The website you're looking at now", side: "left", link: "pages/proj.html#p8"},
  {id: "event17", title: "Aerothermodynamic Simulation", date: "2026-06", description: "Modeling hypersonic spacecraft re-entry using FOSTRAD, Python, and Matlab", side: "left", link: "pages/proj.html#p9"}
];

function parseDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function toDays(date) {
  return date.getTime() / (1000 * 60 * 60 * 24);
}

function formatLabel(ev) {
  const opts = { month: "long", year: "numeric" };
  return parseDate(ev.date).toLocaleDateString("en-US", opts);
}

function monthKey(str) {
  const [y, m] = str.split("-");
  return `${y}-${m}`;
}

// ── Layout constants ────────────────────────────────────────────────────
// PX_PER_DAY is now computed from window.innerWidth at layout time (see
// getPxPerDay below) instead of being a flat constant. These reference
// values describe the density at REFERENCE_WIDTH; below MIN_WIDTH the
// density is clamped so events never compress past a usable minimum.
const REFERENCE_WIDTH = 1400;  // window width at which PX_PER_DAY = BASE_PX_PER_DAY
const BASE_PX_PER_DAY = 2;     // density at REFERENCE_WIDTH (was the old flat constant)
const MIN_PX_PER_DAY = 0.6;    // floor — never compress further than this
const MAX_PX_PER_DAY = 3;      // ceiling — never stretch further than this

const TOP_PADDING = 90;
const BOTTOM_PADDING = 90;
const MIN_GAP = 50; // minimum px between two consecutive item centers

const list = document.getElementById("tlList");
const axis = document.getElementById("axis");

events.forEach((ev) => {
  ev._days = toDays(parseDate(ev.date));
  ev._monthKey = monthKey(ev.date);
});

const sorted = [...events].sort((a, b) => b._days - a._days);
const maxDays = sorted[0]._days;

// Scales PX_PER_DAY based on the current window width. Narrower windows
// get a smaller PX_PER_DAY (events compress closer together); wider
// windows get a larger one (events spread further apart) — clamped
// between MIN_PX_PER_DAY and MAX_PX_PER_DAY so it never goes too extreme.
function getPxPerDay() {
  const ratio = window.innerWidth / REFERENCE_WIDTH;
  const scaled = BASE_PX_PER_DAY * ratio;
  return Math.min(MAX_PX_PER_DAY, Math.max(MIN_PX_PER_DAY, scaled));
}

// Builds (or rebuilds) all event card elements and positions them
// according to the current PX_PER_DAY. Safe to call repeatedly — it
// clears out any previously rendered items first.
function layout() {
  const pxPerDay = getPxPerDay();

  let prevTop = null;
  let prevMonthKey = null;

  sorted.forEach((ev) => {
    const proportional = TOP_PADDING + (maxDays - ev._days) * pxPerDay;

    if (prevTop === null) {
      ev._top = proportional;
    } else if (ev._monthKey === prevMonthKey) {
      ev._top = prevTop;
    } else {
      ev._top = Math.max(proportional, prevTop + MIN_GAP);
    }

    prevTop = ev._top;
    prevMonthKey = ev._monthKey;
  });

  const trackHeight = prevTop + BOTTOM_PADDING;
  list.style.height = `${trackHeight}px`;
  axis.style.height = `${trackHeight}px`;

  // Clear previously rendered items, then rebuild at the new positions
  list.innerHTML = "";

  sorted.forEach((ev) => {
    const item = document.createElement("div");
    item.className = `tl-item ${ev.side}`;
    item.dataset.state = "inactive";
    item.dataset.id = ev.id;
    item.dataset.monthKey = ev._monthKey;
    item.setAttribute("role", "listitem");
    item.style.top = `${ev._top}px`;

    item.innerHTML = `
      <div class="tl-card-wrap">
        <article class="tl-card" aria-label="${ev.title}">
          <div class="card-header">
            <a href="${ev.link}" style="font-family: var(--heading-font); font-size: 0.8125rem; font-weight: 400; line-height: 1.45; color: var(--border-color)">${ev.title}</a>
            <div class="card-date">
              <span>${formatLabel(ev)}</span>
            </div>
          </div>
          <div class="card-body">${ev.description}</div>
        </article>
      </div>

      <div class="tl-dot-col" aria-hidden="true">
        <div class="tl-dot"></div>
      </div>

      <div class="tl-spacer"></div>
    `;

    list.appendChild(item);
  });
}

layout();

// ── Scroll logic ───────────────────────────────────────────────────────
function getItems() {
  return Array.from(document.querySelectorAll(".tl-item"));
}

function update() {
  const items = getItems();
  const vcenter = window.innerHeight * 0.5;

  let bestIdx = 0;
  let bestDist = Infinity;

  items.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    const dist = Math.abs(mid - vcenter);

    if (dist < bestDist) {
      bestDist = dist;
      bestIdx = i;
    }
  });

  // 🔥 NEW: disable activation entirely on small screens
  if (window.innerWidth <= 600) {
    items.forEach((el) => {
      if (el.dataset.state !== "inactive") {
        el.dataset.state = "inactive";
      }
    });
    return;
  }

  const activeMonthKey = items[bestIdx].dataset.monthKey;

  items.forEach((el) => {
    const state =
      el.dataset.monthKey === activeMonthKey ? "active" : "inactive";

    if (el.dataset.state !== state) {
      el.dataset.state = state;
    }
  });
}

let rafPending = false;
function onScroll() {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(() => {
    update();
    rafPending = false;
  });
}

// Re-run layout (recomputing PX_PER_DAY from the new window width) on
// resize, then re-run update() so the active card is still correct.
let resizeRafPending = false;
function onResize() {
  if (resizeRafPending) return;
  resizeRafPending = true;
  requestAnimationFrame(() => {
    layout();
    update();
    resizeRafPending = false;
  });
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onResize, { passive: true });

update();