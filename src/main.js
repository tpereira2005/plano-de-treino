import '@fontsource/anton/400.css';
import '@fontsource-variable/inter';
import '@fontsource/jetbrains-mono/500.css';
import './styles.css';

import { WEEK, TYPES, dayStats, weeklyVolume, exerciseIndex, todayDay } from './data/plan.js';
import { prefs } from './lib/store.js';

/* ============================================================
   Utilitários
   ============================================================ */

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const pad2 = (n) => String(n).padStart(2, '0');
const byId = (id) => WEEK.find((d) => d.id === id);
const typeColor = (day) => TYPES[day.type].color;
const trainingDays = WEEK.filter((d) => d.exercises.length);
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const ICON = {
  sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>',
  moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"/></svg>',
  share: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9.5 2.5h5"/></svg>',
};

function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('is-on');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => el.classList.remove('is-on'), 2600);
}

function nextTrainingDay(from) {
  const i = WEEK.indexOf(from);
  for (let k = 1; k <= 7; k++) {
    const d = WEEK[(i + k) % 7];
    if (d.exercises.length) return d;
  }
  return null;
}

/* ============================================================
   Estado
   ============================================================ */

const today = todayDay();
const state = { dayId: today.id };

/* ============================================================
   Hero — hoje + anel da semana
   ============================================================ */

function polar(cx, cy, r, deg) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function arc(cx, cy, r, start, end) {
  const [x1, y1] = polar(cx, cy, r, start);
  const [x2, y2] = polar(cx, cy, r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M${x1.toFixed(2)} ${y1.toFixed(2)} A${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

function weekRing() {
  const cx = 150;
  const cy = 150;
  const r = 118;
  const gap = 3;
  const span = 360 / 7;
  const totalSets = trainingDays.reduce((n, d) => n + dayStats(d).sets, 0);

  const segs = WEEK.map((d, i) => {
    const s = i * span + gap / 2;
    const e = (i + 1) * span - gap / 2;
    const [lx, ly] = polar(cx, cy, r + 33, (s + e) / 2);
    return `
      <a href="#/${d.id}" data-go="${d.id}" class="ring__seg${d === today ? ' is-today' : ''}${d.exercises.length ? '' : ' is-rest'}"
         style="--day:${typeColor(d)}" aria-label="${esc(d.name)} — ${esc(d.title)}">
        <path class="ring__arc" d="${arc(cx, cy, r, s, e)}" />
        <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" class="ring__lbl">${esc(d.short)}</text>
      </a>`;
  }).join('');

  return `
    <svg class="ring" viewBox="0 0 300 300" role="img" aria-label="Semana: ${trainingDays.length} treinos e ${WEEK.length - trainingDays.length} dias de descanso">
      ${segs}
      <text x="150" y="150" class="ring__big">${trainingDays.length}</text>
      <text x="150" y="178" class="ring__sub">treinos / semana</text>
      <text x="150" y="198" class="ring__sub ring__sub--dim">${totalSets} séries</text>
    </svg>`;
}

function renderHero() {
  const d = today;
  const s = dayStats(d);
  const rest = !d.exercises.length;
  const next = nextTrainingDay(d);

  $('#hero').innerHTML = `
    <div class="hero__copy" style="--day:${typeColor(d)}">
      <p class="hero__kicker"><span class="dot"></span> Hoje · ${esc(d.name)}</p>
      <h1 class="hero__title">${esc(d.title)}</h1>
      <p class="hero__focus">${d.focus.map(esc).join('<i>·</i>')}</p>
      ${
        rest
          ? `<p class="hero__note">Hoje é dia de descanso.${
              next ? ` O próximo treino é <strong>${esc(next.name)}: ${esc(next.title)}</strong>.` : ''
            }</p>
             <div class="hero__cta">
               ${next ? `<a class="btn" href="#/${next.id}" data-go="${next.id}" style="--day:${typeColor(next)}">Ver ${esc(next.title)} ${ICON.arrow}</a>` : ''}
             </div>`
          : `<dl class="hero__stats">
               <div><dt>Exercícios</dt><dd>${s.exercises}</dd></div>
               <div><dt>Séries</dt><dd>${s.sets}</dd></div>
               <div><dt>Duração</dt><dd>~${s.minutes}<small>min</small></dd></div>
             </dl>
             <div class="hero__cta">
               <a class="btn" href="#/${d.id}" data-go="${d.id}">Ver o treino de hoje ${ICON.arrow}</a>
             </div>`
      }
    </div>
    <div class="hero__ring">${weekRing()}</div>`;
}

/* ============================================================
   Semana
   ============================================================ */

function renderFacts() {
  const totalSets = trainingDays.reduce((n, d) => n + dayStats(d).sets, 0);
  const totalMin = trainingDays.reduce((n, d) => n + dayStats(d).minutes, 0);
  const h = (min) => (min / 60).toLocaleString('pt-PT', { maximumFractionDigits: 1 });
  const facts = [
    ['Treinos', trainingDays.length],
    ['Descanso', `${WEEK.length - trainingDays.length} dias`],
    ['Séries / semana', totalSets],
    ['Exercícios diferentes', exerciseIndex().length],
    ['Horas / treino', `~${h(totalMin / trainingDays.length)}`],
    ['Horas / semana', `~${h(totalMin)}`],
  ];
  $('#facts').innerHTML = facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
}

function renderWeek() {
  const maxSets = Math.max(...WEEK.map((d) => dayStats(d).sets));

  $('#week').innerHTML = WEEK.map((d) => {
    const s = dayStats(d);
    const rest = !d.exercises.length;
    const classes = ['wk', rest && 'wk--rest', d === today && 'is-today', d.id === state.dayId && 'is-selected']
      .filter(Boolean)
      .join(' ');
    return `
      <li class="${classes}" style="--day:${typeColor(d)}">
        <a href="#/${d.id}" data-go="${d.id}" aria-label="${esc(d.name)}: ${esc(d.title)}${d === today ? ' (hoje)' : ''}">
          <span class="wk__day">${esc(d.short)}${d === today ? '<em>hoje</em>' : ''}</span>
          <span class="wk__title">${esc(d.title)}</span>
          <span class="wk__focus">${d.focus.map(esc).join(' · ')}</span>
          <span class="wk__go" aria-hidden="true">${ICON.arrow}</span>
          ${
            rest
              ? `<span class="wk__rest" aria-hidden="true">Zz</span>`
              : `<span class="wk__meta"><span><b>${s.exercises}</b> exercícios</span><span><b>${s.sets}</b> séries</span></span>
                 <span class="wk__bar" aria-hidden="true" style="--w:${(s.sets / maxSets) * 100}%"></span>`
          }
        </a>
      </li>`;
  }).join('');
}

/* ============================================================
   Treino de cada dia
   ============================================================ */

function renderTabs() {
  $('#daytabs').innerHTML = WEEK.map(
    (d) => `
      <a role="tab" href="#/${d.id}" data-go="${d.id}" class="tab${d.id === state.dayId ? ' is-active' : ''}${!d.exercises.length ? ' tab--rest' : ''}"
         aria-selected="${d.id === state.dayId}" style="--day:${typeColor(d)}">
        <span>${esc(d.short)}</span>${d === today ? '<i class="tab__today" aria-label="hoje"></i>' : ''}
      </a>`,
  ).join('');
}

function prescription(e) {
  if (e.unit === 'min') return `${e.sets} × ${e.reps}<small>min</small>`;
  return `${e.sets} × ${e.reps}${e.unilateral ? '<small>/lado</small>' : ''}`;
}

function exerciseRow(e, i) {
  return `
    <li class="ex">
      <span class="ex__num" aria-hidden="true">${pad2(i + 1)}</span>
      <div class="ex__main">
        <h4 class="ex__name">${esc(e.name)}</h4>
        <p class="ex__tags">
          <span class="tag">${esc(e.equipment)}</span>
          ${e.muscles.map((m) => `<span class="tag tag--muscle">${esc(m)}</span>`).join('')}
        </p>
      </div>
      <div class="ex__rx">
        <span class="ex__sets" aria-label="${e.sets} ${e.sets === 1 ? 'série' : 'séries'} de ${e.reps} ${e.unit === 'min' ? 'minuto' : 'repetições'}">${prescription(e)}</span>
        <span class="ex__rest">${ICON.clock} pausa ${e.rest} min</span>
      </div>
    </li>`;
}

function renderDay() {
  const d = byId(state.dayId);
  const root = $('#day');
  root.style.setProperty('--day', typeColor(d));
  const isToday = d === today;

  if (!d.exercises.length) {
    const next = nextTrainingDay(d);
    root.innerHTML = `
      <div class="dayhead dayhead--rest">
        <div>
          <p class="dayhead__eyebrow">${esc(d.name)}${isToday ? ' · <b>hoje</b>' : ''}</p>
          <h3 class="dayhead__title">Descanso</h3>
          <p class="muted">Sem treino. Dia para o corpo recuperar.</p>
        </div>
        ${next ? `<a class="btn" href="#/${next.id}" data-go="${next.id}" style="--day:${typeColor(next)}">Próximo: ${esc(next.title)} ${ICON.arrow}</a>` : ''}
      </div>`;
    return;
  }

  const s = dayStats(d);
  root.innerHTML = `
    <div class="dayhead">
      <div>
        <p class="dayhead__eyebrow">${esc(d.name)} · ${esc(TYPES[d.type].label)}${isToday ? ' · <b>hoje</b>' : ''}</p>
        <h3 class="dayhead__title">${esc(d.title)}</h3>
        <p class="dayhead__focus">${d.focus.map(esc).join(' · ')}</p>
      </div>
      <dl class="dayhead__stats">
        <div><dt>Exercícios</dt><dd>${s.exercises}</dd></div>
        <div><dt>Séries</dt><dd>${s.sets}</dd></div>
        <div><dt>Reps</dt><dd>${s.reps}</dd></div>
        <div><dt>Duração</dt><dd>~${s.minutes}′</dd></div>
      </dl>
    </div>
    <ol class="exlist">
      ${d.exercises.map(exerciseRow).join('')}
    </ol>`;
}

/* ============================================================
   Volume
   ============================================================ */

function renderVolume() {
  const data = weeklyVolume();
  const max = Math.max(...data.map((v) => v.total));
  const order = ['upper', 'lower', 'aesthetics'];

  $('#volume-chart').innerHTML = `
    <div class="legend">
      ${order.map((t) => `<span style="--day:${TYPES[t].color}"><i></i>${TYPES[t].label}</span>`).join('')}
    </div>
    <ul class="vbars">
      ${data
        .map(
          (v) => `
        <li>
          <span class="vbars__name">${esc(v.muscle)}</span>
          <span class="vbars__track" role="img" aria-label="${esc(v.muscle)}: ${v.total} séries por semana">
            ${order
              .filter((t) => v.byType[t])
              .map(
                (t) =>
                  `<span class="vbars__seg" style="--day:${TYPES[t].color};--w:${(v.byType[t] / max) * 100}%" title="${TYPES[t].label}: ${v.byType[t]} séries"></span>`,
              )
              .join('')}
          </span>
          <span class="vbars__val">${v.total}</span>
        </li>`,
        )
        .join('')}
    </ul>`;
}

/* ============================================================
   Biblioteca de exercícios
   ============================================================ */

function renderLibrary() {
  $('#library').innerHTML = exerciseIndex()
    .map(
      (e) => `
      <article class="lib">
        <header>
          <h3>${esc(e.name)}</h3>
          <span class="tag">${esc(e.equipment)}</span>
        </header>
        <div class="lib__days" aria-label="Dias: ${e.days.map((d) => d.name).join(', ')}">
          ${WEEK.map((d) => {
            const on = e.days.includes(d);
            return on
              ? `<a href="#/${d.id}" data-go="${d.id}" class="lib__d is-on" style="--day:${typeColor(d)}" title="${esc(d.name)}: ${esc(d.title)}">${esc(d.short)}</a>`
              : `<span class="lib__d" aria-hidden="true">${esc(d.short)}</span>`;
          }).join('')}
        </div>
        <footer>
          <span><b>${e.days.length}×</b> por semana</span>
          <span><b>${e.totalSets}</b> séries</span>
          <span>${e.muscles.map(esc).join(' · ')}</span>
        </footer>
      </article>`,
    )
    .join('');
}

/* ============================================================
   Interação
   ============================================================ */

function selectDay(id, { scroll = false } = {}) {
  if (!byId(id)) return;
  state.dayId = id;
  renderWeek();
  renderTabs();
  renderDay();
  if (scroll) $('#treino').scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' });
}

async function share() {
  const data = { title: 'O meu plano de treino', text: 'Vê o meu plano de treino semanal:', url: location.href };
  try {
    if (navigator.share) {
      await navigator.share(data);
      return;
    }
    await navigator.clipboard.writeText(location.href);
    toast('Link copiado. Já o podes enviar.');
  } catch (err) {
    if (err?.name !== 'AbortError') toast('Não foi possível partilhar. Copia o link da barra de endereço.');
  }
}

document.addEventListener('click', (ev) => {
  const go = ev.target.closest('[data-go]');
  if (go) {
    ev.preventDefault();
    const id = go.dataset.go;
    history.replaceState(null, '', `#/${id}`);
    selectDay(id, { scroll: !go.closest('#daytabs') });
    return;
  }

  const sc = ev.target.closest('[data-scroll]');
  if (sc) {
    ev.preventDefault();
    const top = sc.dataset.scroll === 'top' ? 0 : $(`#${sc.dataset.scroll}`).offsetTop - 64;
    window.scrollTo({ top, behavior: reducedMotion() ? 'auto' : 'smooth' });
    return;
  }

  if (ev.target.closest('[data-share]')) share();
});

window.addEventListener('hashchange', () => {
  const id = location.hash.replace(/^#\/?/, '');
  if (byId(id)) selectDay(id, { scroll: true });
});

/* ---------- Tema ---------- */

function currentTheme() {
  return document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
}
function paintThemeBtn() {
  const light = currentTheme() === 'light';
  // Cor da barra do Safari (iPhone) acompanha o tema escolhido.
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
    m.content = light ? '#f4f3ef' : '#0b0c0e';
  });
  $('#theme-btn').innerHTML = light ? ICON.moon : ICON.sun;
  $('#theme-btn').setAttribute('aria-label', light ? 'Mudar para tema escuro' : 'Mudar para tema claro');
}
$('#theme-btn').addEventListener('click', () => {
  const next = currentTheme() === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  prefs.set('theme', next);
  paintThemeBtn();
});
matchMedia('(prefers-color-scheme: light)').addEventListener('change', paintThemeBtn);

$('#share-btn').innerHTML = ICON.share;
$('#share-btn').dataset.share = '';

/* ============================================================
   Arranque
   ============================================================ */

const initial = location.hash.replace(/^#\/?/, '');
if (byId(initial)) state.dayId = initial;

paintThemeBtn();
renderHero();
renderFacts();
renderWeek();
renderTabs();
renderDay();
renderVolume();
renderLibrary();

if (byId(initial)) requestAnimationFrame(() => $('#treino').scrollIntoView());
