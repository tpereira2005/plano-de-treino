// Plano de treino — fonte única de verdade.
// Para alterar o plano basta editar este ficheiro; o resto do site é gerado a partir dele.

/** Tipos de sessão: definem a cor e o rótulo de cada dia. */
export const TYPES = {
  upper: { label: 'Upper', color: 'var(--c-upper)' },
  lower: { label: 'Lower', color: 'var(--c-lower)' },
  aesthetics: { label: 'Aesthetics', color: 'var(--c-aes)' },
  rest: { label: 'Descanso', color: 'var(--c-rest)' },
};

/** Grupo muscular principal de cada exercício (usado no gráfico de volume semanal). */
const MUSCLES = {
  'Dead Hang': ['Antebraços'],
  'Incline Bench Press': ['Peito'],
  'T-Bar Row': ['Costas'],
  'Cable Crossover': ['Peito'],
  'Lat Pulldown': ['Costas'],
  'One-Arm Lateral Raise': ['Ombros'],
  'Tricep Pushdown': ['Tríceps'],
  'Incline Bicep Curl': ['Bíceps'],
  'Hack Squat': ['Quadríceps'],
  'Seated Leg Curl': ['Posterior'],
  'Leg Press': ['Quadríceps'],
  'Bulgarian Split Squat': ['Quadríceps', 'Glúteos'],
  'Leg Extensions': ['Quadríceps'],
  'Calf Raises': ['Gémeos'],
  Crunch: ['Core'],
  'Reverse Crunch': ['Core'],
  'Shoulder Press': ['Ombros'],
  'Incline Chest Press': ['Peito'],
  'Seated Cable Row': ['Costas'],
  'Chest Fly': ['Peito'],
  'Rear Delt Fly': ['Ombros'],
  'Bicep Curl': ['Bíceps'],
  'Overhead Triceps Extension': ['Tríceps'],
  'Pendulum Squat': ['Quadríceps'],
  'Back Extension': ['Lombar', 'Glúteos'],
  'Hip Adduction': ['Adutores'],
  'Lateral Raise': ['Ombros'],
  'Hammer Curl': ['Bíceps'],
};

/**
 * ex(nome, equipamento, séries, reps, pausa em minutos, unidade)
 * unidade: 'reps' (repetições) ou 'min' (duração).
 */
const ex = (name, equipment, sets, reps, rest, unit = 'reps') => ({
  name,
  equipment,
  sets,
  reps,
  rest,
  unit,
  unilateral: /unilateral/i.test(equipment),
  muscles: MUSCLES[name] ?? [],
});

const deadHang = () => ex('Dead Hang', 'peso corporal', 1, 1, 2, 'min');

export const WEEK = [
  {
    id: 'segunda',
    short: 'Seg',
    name: 'Segunda-feira',
    jsDay: 1,
    type: 'upper',
    title: 'Upper A',
    focus: ['Peito', 'Costas', 'Ombros', 'Braços'],
    exercises: [
      deadHang(),
      ex('Incline Bench Press', 'halteres', 3, 8, 2),
      ex('T-Bar Row', 'máquina', 3, 8, 2),
      ex('Cable Crossover', 'cabos, bilateral', 3, 8, 2),
      ex('Lat Pulldown', 'cabo', 3, 8, 2),
      ex('One-Arm Lateral Raise', 'cabo, unilateral', 3, 8, 2),
      ex('Tricep Pushdown', 'cabo', 3, 8, 2),
      ex('Incline Bicep Curl', 'halteres', 3, 8, 2),
    ],
  },
  {
    id: 'terca',
    short: 'Ter',
    name: 'Terça-feira',
    jsDay: 2,
    type: 'lower',
    title: 'Lower A',
    focus: ['Quadríceps', 'Posterior', 'Gémeos', 'Core'],
    exercises: [
      deadHang(),
      ex('Hack Squat', 'máquina', 3, 8, 2),
      ex('Seated Leg Curl', 'máquina', 3, 8, 2),
      ex('Leg Press', 'máquina', 3, 8, 2),
      ex('Bulgarian Split Squat', 'halteres', 2, 8, 3),
      ex('Leg Extensions', 'máquina', 3, 8, 2),
      ex('Calf Raises', 'máquina', 3, 8, 2),
      ex('Crunch', 'peso corporal', 3, 8, 2),
      ex('Reverse Crunch', 'peso corporal', 2, 8, 2),
    ],
  },
  {
    id: 'quarta',
    short: 'Qua',
    name: 'Quarta-feira',
    jsDay: 3,
    type: 'rest',
    title: 'Descanso',
    focus: ['Recuperação'],
    exercises: [],
  },
  {
    id: 'quinta',
    short: 'Qui',
    name: 'Quinta-feira',
    jsDay: 4,
    type: 'upper',
    title: 'Upper B',
    focus: ['Ombros', 'Costas', 'Peito', 'Braços'],
    exercises: [
      deadHang(),
      ex('Shoulder Press', 'máquina', 3, 8, 2),
      ex('Lat Pulldown', 'cabo', 3, 8, 2),
      ex('Incline Chest Press', 'máquina', 3, 8, 2),
      ex('Seated Cable Row', 'cabo', 3, 8, 2),
      ex('Chest Fly', 'máquina', 3, 8, 2),
      ex('Rear Delt Fly', 'máquina', 3, 8, 2),
      ex('Bicep Curl', 'halteres', 3, 8, 2),
      ex('Overhead Triceps Extension', 'cabo', 3, 8, 2),
    ],
  },
  {
    id: 'sexta',
    short: 'Sex',
    name: 'Sexta-feira',
    jsDay: 5,
    type: 'lower',
    title: 'Lower B',
    focus: ['Pernas', 'Glúteos', 'Posterior', 'Core'],
    exercises: [
      deadHang(),
      ex('Pendulum Squat', 'máquina', 3, 8, 2),
      ex('Bulgarian Split Squat', 'halteres', 3, 8, 3),
      ex('Seated Leg Curl', 'máquina', 3, 8, 2),
      ex('Back Extension', 'peso corporal', 3, 10, 2),
      ex('Hip Adduction', 'máquina', 3, 8, 2),
      ex('Calf Raises', 'máquina', 3, 10, 2),
      ex('Crunch', 'peso corporal', 3, 8, 2),
      ex('Reverse Crunch', 'peso corporal', 3, 8, 2),
    ],
  },
  {
    id: 'sabado',
    short: 'Sáb',
    name: 'Sábado',
    jsDay: 6,
    type: 'aesthetics',
    title: 'Aesthetics',
    focus: ['Ombros', 'Bíceps', 'Tríceps'],
    exercises: [
      deadHang(),
      ex('One-Arm Lateral Raise', 'cabo, unilateral', 3, 8, 2),
      ex('Lateral Raise', 'máquina', 3, 8, 2),
      ex('Rear Delt Fly', 'máquina', 3, 8, 2),
      ex('Incline Bicep Curl', 'halteres', 3, 8, 2),
      ex('Hammer Curl', 'halteres', 3, 8, 2),
      ex('Tricep Pushdown', 'cabo', 3, 8, 2),
      ex('Overhead Triceps Extension', 'cabo', 3, 8, 2),
    ],
  },
  {
    id: 'domingo',
    short: 'Dom',
    name: 'Domingo',
    jsDay: 0,
    type: 'rest',
    title: 'Descanso',
    focus: ['Recuperação'],
    exercises: [],
  },
];

/* ---------- Métricas derivadas ---------- */

// Estimativa de duração: ~45 s por série (×2 se unilateral) + pausa entre séries.
// Não conta a pausa depois da última série de toda a sessão.
const WORK_SEC = 45;

export function dayStats(day) {
  const exercises = day.exercises.length;
  const sets = day.exercises.reduce((n, e) => n + e.sets, 0);
  let seconds = 0;
  day.exercises.forEach((e) => {
    const work = e.unit === 'min' ? e.reps * 60 : WORK_SEC * (e.unilateral ? 2 : 1);
    seconds += e.sets * (work + e.rest * 60);
  });
  if (exercises) seconds -= day.exercises.at(-1).rest * 60;
  const reps = day.exercises.reduce(
    (n, e) => n + (e.unit === 'reps' ? e.sets * e.reps * (e.unilateral ? 2 : 1) : 0),
    0,
  );
  return { exercises, sets, minutes: Math.round(seconds / 60), reps };
}

/** Séries semanais por grupo muscular, repartidas pelo tipo de sessão. */
export function weeklyVolume() {
  const volume = {};
  WEEK.forEach((d) =>
    d.exercises.forEach((e) =>
      e.muscles.forEach((m) => {
        const v = (volume[m] ??= { muscle: m, total: 0, byType: {} });
        v.total += e.sets;
        v.byType[d.type] = (v.byType[d.type] ?? 0) + e.sets;
      }),
    ),
  );
  return Object.values(volume).sort((a, b) => b.total - a.total || a.muscle.localeCompare(b.muscle));
}

export function exerciseIndex() {
  const map = new Map();
  WEEK.forEach((d) =>
    d.exercises.forEach((e) => {
      const item = map.get(e.name) ?? { ...e, days: [], totalSets: 0 };
      item.days.push(d);
      item.totalSets += e.sets;
      map.set(e.name, item);
    }),
  );
  return [...map.values()].sort((a, b) => b.days.length - a.days.length || a.name.localeCompare(b.name));
}

export function todayDay(date = new Date()) {
  return WEEK.find((d) => d.jsDay === date.getDay());
}
