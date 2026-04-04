'use client';

import { startTransition, useMemo, useState } from 'react';

type AdmissionStat = {
  id: string;
  category: string;
  year: number;
  passingScore: number;
  averageScore: number | null;
};

type ApplicantsCategoryToggleProps = {
  stats: AdmissionStat[];
};

type AssessmentId =
  | 'credit'
  | 'diff-credit'
  | 'exam'
  | 'distributed-exam'
  | 'coursework'
  | 'course-project';

type CurriculumSubject = {
  title: string;
  marks: AssessmentId[];
};

type CurriculumSemester = {
  semester: number;
  title: string;
  note: string;
  subjects: CurriculumSubject[];
};

type BachelorPlanSubtype = 'basic' | 'specialist';

type BachelorCurriculumPlan = {
  id: string;
  type: 'bachelor';
  subtype: BachelorPlanSubtype;
  planLabel: string;
  title: string;
  profile: string;
  department: string;
  degree: string;
  duration: string;
  year: string;
  studyForm: string;
  curriculum: CurriculumSemester[];
};

type MasterCurriculumPlan = {
  id: string;
  planLabel: string;
  title: string;
  program: string;
  department: string;
  degree: string;
  duration: string;
  year: string;
  studyForm: string;
  curriculum: CurriculumSemester[];
};

const degreeOptions = [
  { id: 'bachelor', label: 'Бакалавриат' },
  { id: 'master', label: 'Магистратура' },
];

const bachelorOptions = [
  { id: 'budget', label: 'Бюджетное' },
  { id: 'paid', label: 'Платное' },
] as const;

const bachelorCurriculumOptions = [
  { id: 'four-year', label: 'Базовое высшее' },
  { id: 'six-year', label: 'Специалитет' },
] as const;

const budgetStats = [
  { label: 'Код направления', value: '09.03.01' },
  { label: 'Направление', value: 'Информатика и вычислительная техника' },
  { label: 'Кафедра', value: 'ИУ-5' },
  { label: 'Срок обучения', value: 'См. выбранный тип программы' },
];

const exams = [
  { subject: 'Физика', score: '45' },
  { subject: 'Математика', score: '45' },
  { subject: 'Русский язык', score: '45' },
];

const paidStats = [
  { label: 'Срок обучения', value: 'См. выбранный тип программы' },
  { label: 'Стоимость обучения (2026 г.)', value: '499 000 Р' },
  { label: 'Форма обучения', value: 'Очная' },
  { label: 'Военная кафедра', value: 'Есть' },
];

const masterTopStats = [
  { label: 'Код направления', value: '09.04.01' },
  { label: 'Направление', value: 'Информатика и вычислительная техника' },
  { label: 'Форма обучения', value: 'Очная' },
  { label: 'Срок обучения', value: '2 года' },
];

const masterHighlights = [
  { label: 'Направление', value: 'Информатика и вычислительная техника' },
  {
    label: 'Программа',
    value: 'Искусственный интеллект в автоматизированных системах обработки информации и управления',
  },
  { label: 'Бюджетные места', value: '44' },
  { label: 'Платные места', value: '15' },
] as const;

const masterYearlyStats = [
  { year: 2025, applicants: 110, competition: '2,5', maxScore: 122, passingScore: 75, enrolled: 59 },
  { year: 2024, applicants: 100, competition: '2,5', maxScore: 125, passingScore: 85, enrolled: 72 },
  { year: 2023, applicants: 153, competition: '2,94', maxScore: 125, passingScore: 86, enrolled: 90 },
  { year: 2022, applicants: 133, competition: '1,51', maxScore: 123, passingScore: 38, enrolled: 102 },
] as const;

const masterViewOptions = [
  { id: 'overview', label: 'О программе' },
  { id: 'curriculum', label: 'Учебный план' },
] as const;

const assessmentLegend = [
  { id: 'credit', short: 'З', label: 'Зачёт', style: 'border border-white/70 bg-transparent text-white' },
  {
    id: 'diff-credit',
    short: 'ДЗ',
    label: 'Дифференцированный зачёт',
    style: 'bg-white text-[#050816]',
  },
  { id: 'exam', short: 'Э', label: 'Экзамен', style: 'bg-cyan-300 text-[#04101f]' },
  {
    id: 'distributed-exam',
    short: 'РЭ',
    label: 'Распределённый экзамен',
    style: 'border border-cyan-300 bg-transparent text-cyan-200',
  },
  { id: 'coursework', short: 'КР', label: 'Курсовая работа', style: 'bg-yellow-300 text-[#241400]' },
  { id: 'course-project', short: 'КП', label: 'Курсовой проект', style: 'bg-orange-300 text-[#2b1600]' },
] as const satisfies ReadonlyArray<{
  id: AssessmentId;
  short: string;
  label: string;
  style: string;
}>;

const masterCurriculumBase2025: CurriculumSemester[] = [
  {
    semester: 1,
    title: '1 семестр',
    note: 'Первый этап программы посвящён фундаменту исследований, архитектуре систем и прикладному ИИ.',
    subjects: [
      { title: 'Иностранный язык', marks: ['credit'] },
      { title: 'Методология научного познания', marks: ['credit'] },
      {
        title: 'Аналитические модели автоматизированных систем обработки информации и управления',
        marks: ['credit', 'coursework'],
      },
      {
        title: 'Многомерный анализ данных в системах искусственного интеллекта',
        marks: ['exam', 'coursework'],
      },
      {
        title: 'Объектно-ориентированное проектирование автоматизированных систем обработки информации и управления',
        marks: ['exam', 'coursework'],
      },
      { title: 'Оптимизация баз данных систем машинного обучения', marks: ['exam'] },
    ],
  },
  {
    semester: 2,
    title: '2 семестр',
    note: 'Во втором семестре акцент смещается на ML-подходы, надёжность систем и современные базы данных.',
    subjects: [
      { title: 'Иностранный язык', marks: ['credit'] },
      { title: 'Основы предпринимательства', marks: ['credit'] },
      {
        title: 'Методы машинного обучения в автоматизированных системах обработки информации и управления',
        marks: ['distributed-exam'],
      },
      { title: 'Модели надежности АСОИУ', marks: ['exam'] },
      { title: 'Постреляционные базы данных', marks: ['exam'] },
      { title: 'Разработка нейросетевых систем', marks: ['exam'] },
    ],
  },
  {
    semester: 3,
    title: '3 семестр',
    note: 'Третий семестр посвящён аналитике, корпоративным системам и исследовательской работе.',
    subjects: [
      { title: 'Анализ временных рядов', marks: ['exam'] },
      { title: 'Управление проектированием информационных систем', marks: ['credit'] },
      { title: 'Корпоративные системы управления', marks: ['exam'] },
      { title: 'НИР по обработке и анализу данных', marks: ['coursework'] },
      {
        title: 'Эргономический анализ систем обработки и отображения информации',
        marks: ['exam', 'coursework'],
      },
      { title: 'Дисциплина по выбору №1', marks: ['credit'] },
    ],
  },
  {
    semester: 4,
    title: '4 семестр',
    note: 'Финальный семестр фокусируется на бизнес-аналитике и логическом искусственном интеллекте.',
    subjects: [
      { title: 'Искусственный интеллект в задачах бизнес-аналитики', marks: ['exam'] },
      {
        title: 'Миварные технологии логического искусственного интеллекта',
        marks: ['exam', 'coursework'],
      },
      { title: 'Дисциплина по выбору №2', marks: ['exam'] },
    ],
  },
] as const;

const masterCurriculum2026: CurriculumSemester[] = [
  {
    semester: 1,
    title: '1 семестр',
    note: '',
    subjects: [
      { title: 'Иностранный язык', marks: ['credit'] },
      { title: 'Методология научного познания', marks: ['credit'] },
      {
        title: 'Аналитические модели автоматизированных систем обработки информации и управления',
        marks: ['credit', 'diff-credit'],
      },
      {
        title: 'Многомерный анализ данных в системах искусственного интеллекта',
        marks: ['exam', 'diff-credit'],
      },
      {
        title: 'Объектно-ориентированное проектирование автоматизированных систем обработки информации и управления',
        marks: ['exam', 'diff-credit'],
      },
      { title: 'Оптимизация баз данных систем машинного обучения', marks: ['exam'] },
      { title: 'Технологии разработки программного обеспечения', marks: ['exam', 'diff-credit'] },
      { title: 'Научно-исследовательская работа', marks: ['diff-credit'] },
    ],
  },
  {
    semester: 2,
    title: '2 семестр',
    note: '',
    subjects: [
      { title: 'Иностранный язык', marks: ['credit'] },
      { title: 'Основы предпринимательства', marks: ['credit'] },
      {
        title: 'Методы машинного обучения в автоматизированных системах обработки информации и управления',
        marks: ['distributed-exam'],
      },
      { title: 'Модели надёжности АСОИУ', marks: ['exam'] },
      { title: 'Постреляционные базы данных', marks: ['exam'] },
      { title: 'Разработка нейросетевых систем', marks: ['exam'] },
      { title: 'Технологии разработки программного обеспечения', marks: ['exam', 'diff-credit'] },
      { title: 'Проектно-технологическая практика', marks: ['diff-credit'] },
      { title: 'Эксплуатационная практика', marks: ['diff-credit'] },
      { title: 'Педагогическая практика', marks: ['diff-credit'] },
      { title: 'Научно-исследовательская работа', marks: ['diff-credit'] },
      { title: 'Антикоррупционная деятельность в Российской Федерации', marks: ['credit'] },
    ],
  },
  {
    semester: 3,
    title: '3 семестр',
    note: '',
    subjects: [
      { title: 'Анализ временных рядов', marks: ['exam'] },
      { title: 'Искусственный интеллект в задачах бизнес-аналитики', marks: ['exam'] },
      { title: 'Управление проектированием информационных систем', marks: ['credit'] },
      { title: 'НИР по обработке и анализу данных', marks: ['diff-credit'] },
      {
        title: 'Эргономический анализ систем обработки и отображения информации',
        marks: ['exam', 'diff-credit'],
      },
      { title: 'Дисциплина по выбору №1', marks: ['credit'] },
      { title: 'Педагогическая практика', marks: ['diff-credit'] },
      { title: 'Научно-исследовательская работа', marks: ['diff-credit'] },
      { title: 'Менеджмент креативности и эвристики', marks: ['credit'] },
    ],
  },
  {
    semester: 4,
    title: '4 семестр',
    note: '',
    subjects: [
      { title: 'Миварные технологии логического искусственного интеллекта', marks: ['exam', 'diff-credit'] },
      { title: 'Описание процессов жизненного цикла СТС', marks: ['exam'] },
      { title: 'Дисциплина по выбору №2', marks: ['exam'] },
      { title: 'Научно-исследовательская работа', marks: ['diff-credit'] },
      { title: 'Преддипломная практика', marks: ['diff-credit'] },
      { title: 'Подготовка и защита ВКР', marks: ['exam'] },
    ],
  },
] as const;

const masterCurriculumPlans: MasterCurriculumPlan[] = [
  {
    id: 'master-iu5-iu5c-2026',
    planLabel: 'ИУ5, ИУ5-Ц',
    title: '09.04.01 — Информатика и вычислительная техника',
    program: 'Искусственный интеллект в автоматизированных системах обработки информации и управления',
    department: 'ИУ5, ИУ5-Ц',
    degree: 'Магистр',
    duration: '2 года',
    year: '2026',
    studyForm: 'Очная',
    curriculum: masterCurriculum2026,
  },
];

const bachelorCurriculumBasicMoscow2025: CurriculumSemester[] = [
  {
    semester: 1,
    title: '1 семестр',
    note: '',
    subjects: [
      { title: 'Аналитическая геометрия', marks: ['distributed-exam'] },
      { title: 'Иностранный язык', marks: ['distributed-exam'] },
      { title: 'Математический анализ', marks: ['exam'] },
      { title: 'Начертательная геометрия', marks: ['distributed-exam'] },
      { title: 'Социология', marks: ['credit'] },
      { title: 'Физическая культура и спорт', marks: ['credit'] },
      { title: 'Информатика', marks: ['distributed-exam'] },
      { title: 'История России', marks: ['distributed-exam'] },
      { title: 'Основы программирования', marks: ['exam'] },
    ],
  },
  {
    semester: 2,
    title: '2 семестр',
    note: '',
    subjects: [
      { title: 'Иностранный язык', marks: ['distributed-exam'] },
      { title: 'История России', marks: ['distributed-exam'] },
      { title: 'Архитектура автоматизированных систем обработки информации и управления', marks: ['exam'] },
      { title: 'Инженерная графика', marks: ['diff-credit'] },
      { title: 'Интегралы и дифференциальные уравнения', marks: ['exam'] },
      { title: 'Линейная алгебра и функции нескольких переменных', marks: ['distributed-exam'] },
      { title: 'Программирование на основе классов и шаблонов', marks: ['exam'] },
      { title: 'Физика', marks: ['exam'] },
    ],
  },
  {
    semester: 3,
    title: '3 семестр',
    note: '',
    subjects: [
      { title: 'Иностранный язык', marks: ['distributed-exam'] },
      { title: 'Архитектура автоматизированных систем обработки информации и управления', marks: ['diff-credit'] },
      { title: 'Физика', marks: ['exam'] },
      { title: 'Теория вероятностей и математическая статистика', marks: ['exam'] },
      { title: 'Электротехника', marks: ['exam'] },
      { title: 'Модели данных', marks: ['credit'] },
      { title: 'Правоведение', marks: ['credit'] },
      { title: 'Экология', marks: ['credit'] },
      { title: 'Парадигмы и конструкции языков программирования', marks: ['credit'] },
    ],
  },
  {
    semester: 4,
    title: '4 семестр',
    note: '',
    subjects: [
      { title: 'Иностранный язык', marks: ['distributed-exam'] },
      { title: 'Базы данных', marks: ['distributed-exam', 'diff-credit'] },
      { title: 'Дискретная математика', marks: ['distributed-exam'] },
      { title: 'Системное программирование', marks: ['credit', 'diff-credit'] },
      { title: 'Схемотехника дискретных устройств', marks: ['exam'] },
      { title: 'Электроника', marks: ['exam'] },
      { title: 'Политология', marks: ['credit'] },
    ],
  },
  {
    semester: 5,
    title: '5 семестр',
    note: '',
    subjects: [
      { title: 'Иностранный язык', marks: ['distributed-exam'] },
      { title: 'Вычислительные средства АСОИУ', marks: ['exam', 'diff-credit'] },
      { title: 'Операционные системы', marks: ['exam'] },
      { title: 'Теория управления', marks: ['credit'] },
      { title: 'Разработка интернет-приложений', marks: ['exam'] },
      { title: 'Оперативный анализ данных', marks: ['credit'] },
      { title: 'Сети и телекоммуникации', marks: ['exam'] },
    ],
  },
  {
    semester: 6,
    title: '6 семестр',
    note: '',
    subjects: [
      { title: 'Иностранный язык', marks: ['distributed-exam'] },
      { title: 'Сетевые технологии в АСОИУ', marks: ['exam', 'diff-credit'] },
      { title: 'Технология мультимедиа', marks: ['credit'] },
      { title: 'Философия', marks: ['credit'] },
      { title: 'Корпоративные системы управления', marks: ['distributed-exam'] },
      { title: 'Технологии машинного обучения', marks: ['exam'] },
      { title: 'Исследование операций', marks: ['credit'] },
      { title: 'Сетевое программное обеспечение', marks: ['credit'] },
    ],
  },
  {
    semester: 7,
    title: '7 семестр',
    note: '',
    subjects: [
      { title: 'Методы поддержки принятия решений', marks: ['exam'] },
      { title: 'Технология конструирования ЭВМ', marks: ['distributed-exam'] },
      { title: 'Экономика часть 1', marks: ['credit'] },
      { title: 'Безопасность жизнедеятельности', marks: ['credit'] },
      { title: 'Инженерная этика', marks: ['credit'] },
      { title: 'Имитационное моделирование дискретных процессов', marks: ['exam', 'diff-credit'] },
    ],
  },
  {
    semester: 8,
    title: '8 семестр',
    note: '',
    subjects: [
      { title: 'Экономика часть 2', marks: ['credit'] },
      { title: 'Эксплуатация АСОИУ', marks: ['exam'] },
      { title: 'Элементы управления в АСОИУ', marks: ['exam'] },
      { title: 'Защита информации', marks: ['credit'] },
      { title: 'Анализ характеристик производительности КИС', marks: ['credit'] },
      { title: 'Русский язык делового общения', marks: ['credit'] },
    ],
  },
] as const;

const bachelorCurriculumBasicTashkent2026: CurriculumSemester[] = [
  {
    semester: 1,
    title: '1 семестр',
    note: '',
    subjects: [
      { title: 'Аналитическая геометрия', marks: ['distributed-exam'] },
      { title: 'Информатика', marks: ['distributed-exam'] },
      { title: 'История России', marks: ['distributed-exam'] },
      { title: 'История Узбекистана', marks: ['credit'] },
      { title: 'Математический анализ', marks: ['exam'] },
      { title: 'Научно-технический русский язык', marks: ['credit'] },
      { title: 'Начертательная геометрия', marks: ['distributed-exam'] },
      { title: 'Русский язык делового общения', marks: ['credit'] },
      { title: 'Узбекский язык', marks: ['credit'] },
      { title: 'Физическая культура и спорт', marks: ['credit'] },
    ],
  },
  {
    semester: 2,
    title: '2 семестр',
    note: '',
    subjects: [
      { title: 'История России', marks: ['distributed-exam'] },
      { title: 'Русский язык делового общения', marks: ['credit'] },
      { title: 'Архитектура автоматизированных систем обработки информации и управления', marks: ['exam'] },
      { title: 'Инженерная и компьютерная графика', marks: ['diff-credit'] },
      { title: 'Интегралы и дифференциальные уравнения', marks: ['exam'] },
      { title: 'Линейная алгебра и функции нескольких переменных', marks: ['exam'] },
      { title: 'Основы программирования', marks: ['distributed-exam'] },
      { title: 'Программирование на основе классов и шаблонов', marks: ['exam'] },
      { title: 'Физика', marks: ['exam'] },
    ],
  },
  {
    semester: 3,
    title: '3 семестр',
    note: '',
    subjects: [
      { title: 'Архитектура автоматизированных систем обработки информации и управления', marks: ['diff-credit'] },
      { title: 'Основы программирования', marks: ['distributed-exam'] },
      { title: 'Физика', marks: ['exam'] },
      { title: 'Дополнительные главы математики', marks: ['credit'] },
      { title: 'Модели данных', marks: ['credit'] },
      { title: 'Социология', marks: ['credit'] },
      { title: 'Экология', marks: ['credit'] },
      { title: 'Электротехника', marks: ['exam'] },
      { title: 'Парадигмы и конструкции языков программирования', marks: ['credit'] },
    ],
  },
  {
    semester: 4,
    title: '4 семестр',
    note: '',
    subjects: [
      { title: 'Дополнительные главы математики', marks: ['credit'] },
      { title: 'Базы данных', marks: ['distributed-exam', 'diff-credit'] },
      { title: 'Дискретная математика', marks: ['distributed-exam'] },
      { title: 'Иностранный язык', marks: ['distributed-exam'] },
      { title: 'Правоведение', marks: ['credit'] },
      { title: 'Системное программирование', marks: ['credit', 'diff-credit'] },
      { title: 'Схемотехника дискретных устройств', marks: ['exam'] },
      { title: 'Электроника', marks: ['exam'] },
    ],
  },
  {
    semester: 5,
    title: '5 семестр',
    note: '',
    subjects: [
      { title: 'Иностранный язык', marks: ['distributed-exam'] },
      { title: 'Операционные системы', marks: ['exam'] },
      { title: 'Сети и телекоммуникации', marks: ['exam'] },
      { title: 'Теория управления', marks: ['credit'] },
      { title: 'Оперативный анализ данных', marks: ['credit'] },
      { title: 'Разработка интернет-приложений', marks: ['exam'] },
      { title: 'Вычислительные средства АСОИУ', marks: ['exam', 'diff-credit'] },
    ],
  },
  {
    semester: 6,
    title: '6 семестр',
    note: '',
    subjects: [
      { title: 'Исследование операций', marks: ['credit'] },
      { title: 'Описание процессов жизненного цикла АСОИУ', marks: ['exam'] },
      { title: 'Сетевое программное обеспечение', marks: ['credit'] },
      { title: 'Сетевые технологии в АСОИУ', marks: ['exam', 'diff-credit'] },
      { title: 'Технологии машинного обучения', marks: ['exam'] },
      { title: 'Технология мультимедиа', marks: ['credit'] },
      { title: 'Философия', marks: ['credit'] },
    ],
  },
  {
    semester: 7,
    title: '7 семестр',
    note: '',
    subjects: [
      { title: 'Безопасность жизнедеятельности', marks: ['credit'] },
      { title: 'Методы поддержки принятия решений', marks: ['exam'] },
      { title: 'Технология конструирования ЭВМ', marks: ['exam'] },
      { title: 'Имитационное моделирование дискретных процессов', marks: ['exam', 'diff-credit'] },
    ],
  },
  {
    semester: 8,
    title: '8 семестр',
    note: '',
    subjects: [
      { title: 'Инженерная этика', marks: ['credit'] },
      { title: 'Экономика часть 1', marks: ['credit'] },
      { title: 'Экономика часть 2', marks: ['credit'] },
      { title: 'Эксплуатация АСОИУ', marks: ['exam'] },
      { title: 'Анализ характеристик производительности КИС', marks: ['credit'] },
      { title: 'Защита информации', marks: ['credit'] },
      { title: 'Элементы управления в АСОИУ', marks: ['exam'] },
    ],
  },
] as const;

const bachelorCurriculumBasicAdaptive2025: CurriculumSemester[] = [
  {
    semester: 1,
    title: '1 семестр',
    note: '',
    subjects: [
      { title: 'Аналитическая геометрия', marks: ['distributed-exam'] },
      { title: 'Инженерная графика', marks: ['diff-credit'] },
      { title: 'Иностранный язык', marks: ['credit'] },
      { title: 'История России', marks: ['distributed-exam'] },
      { title: 'Математический анализ', marks: ['exam'] },
      { title: 'Физическая культура и спорт', marks: ['credit'] },
      { title: 'Когнитивные технологии сопровождения дисциплины (ИГ)', marks: ['credit'] },
      { title: 'Когнитивные технологии сопровождения дисциплины (МА)', marks: ['credit'] },
      { title: 'Начертательная геометрия', marks: ['exam'] },
      { title: 'Семантика технических текстов', marks: ['credit'] },
      { title: 'Семантика учебных текстов в пространстве русского языка', marks: ['credit'] },
      { title: 'Когнитивные технологии сопровождения дисциплины (АГ)', marks: ['credit'] },
    ],
  },
  {
    semester: 2,
    title: '2 семестр',
    note: '',
    subjects: [
      { title: 'Инженерная графика', marks: ['diff-credit'] },
      { title: 'Иностранный язык', marks: ['credit'] },
      { title: 'История России', marks: ['distributed-exam'] },
      { title: 'Математический анализ', marks: ['exam'] },
      { title: 'Линейная алгебра', marks: ['distributed-exam'] },
      { title: 'Когнитивные технологии сопровождения дисциплины (ИГ)', marks: ['credit'] },
      { title: 'Когнитивные технологии сопровождения дисциплины (МА)', marks: ['credit'] },
      { title: 'Семантика технических текстов', marks: ['credit'] },
      { title: 'Семантика учебных текстов в пространстве русского языка', marks: ['credit'] },
      { title: 'Когнитивные технологии сопровождения дисциплины (ЛА)', marks: ['credit'] },
    ],
  },
  {
    semester: 3,
    title: '3 семестр',
    note: '',
    subjects: [
      { title: 'Иностранный язык', marks: ['credit'] },
      { title: 'Интегралы и дифференциальные уравнения', marks: ['distributed-exam'] },
      { title: 'Информатика', marks: ['distributed-exam'] },
      { title: 'Основы программирования', marks: ['exam'] },
      { title: 'Физика', marks: ['exam'] },
      { title: 'Социология', marks: ['credit'] },
      { title: 'Семантика учебных текстов в пространстве русского языка', marks: ['credit'] },
      { title: 'Когнитивные технологии сопровождения дисциплины (Инт и ДУ)', marks: ['credit'] },
      { title: 'Когнитивные технологии сопровождения дисциплины (Физика)', marks: ['credit'] },
    ],
  },
  {
    semester: 4,
    title: '4 семестр',
    note: '',
    subjects: [
      { title: 'Иностранный язык', marks: ['credit'] },
      { title: 'Интегралы и дифференциальные уравнения', marks: ['distributed-exam'] },
      { title: 'Физика', marks: ['exam'] },
      { title: 'Архитектура автоматизированных систем обработки информации и управления', marks: ['exam'] },
      { title: 'Программирование на основе классов и шаблонов', marks: ['exam'] },
      { title: 'Семантика учебных текстов в пространстве русского языка', marks: ['credit'] },
      { title: 'Когнитивные технологии сопровождения дисциплины (Инт и ДУ)', marks: ['credit'] },
      { title: 'Когнитивные технологии сопровождения дисциплины (Физика)', marks: ['credit'] },
    ],
  },
  {
    semester: 5,
    title: '5 семестр',
    note: '',
    subjects: [
      { title: 'Архитектура автоматизированных систем обработки информации и управления', marks: ['diff-credit'] },
      { title: 'Иностранный язык', marks: ['exam'] },
      { title: 'Модели данных', marks: ['credit'] },
      { title: 'Правоведение', marks: ['credit'] },
      { title: 'Теория вероятностей и математическая статистика', marks: ['exam'] },
      { title: 'Экология', marks: ['credit'] },
      { title: 'Электротехника', marks: ['exam'] },
      { title: 'Парадигмы и конструкции языков программирования', marks: ['credit'] },
    ],
  },
  {
    semester: 6,
    title: '6 семестр',
    note: '',
    subjects: [
      { title: 'Иностранный язык', marks: ['exam'] },
      { title: 'Базы данных', marks: ['distributed-exam', 'diff-credit'] },
      { title: 'Дискретная математика', marks: ['distributed-exam'] },
      { title: 'Системное программирование', marks: ['credit', 'diff-credit'] },
      { title: 'Схемотехника дискретных устройств', marks: ['exam'] },
      { title: 'Электроника', marks: ['exam'] },
      { title: 'Политология', marks: ['credit'] },
      { title: 'Эксплуатационная практика', marks: ['diff-credit'] },
    ],
  },
  {
    semester: 7,
    title: '7 семестр',
    note: '',
    subjects: [
      { title: 'Иностранный язык', marks: ['exam'] },
      { title: 'Операционные системы', marks: ['exam'] },
      { title: 'Сети и телекоммуникации', marks: ['exam'] },
      { title: 'Теория управления', marks: ['credit'] },
      { title: 'Оперативный анализ данных', marks: ['credit'] },
      { title: 'Разработка интернет-приложений', marks: ['exam'] },
      { title: 'Эксплуатационная практика', marks: ['diff-credit'] },
      { title: 'Научно-исследовательская работа', marks: ['diff-credit'] },
      { title: 'История науки и техники', marks: ['credit'] },
    ],
  },
  {
    semester: 8,
    title: '8 семестр',
    note: '',
    subjects: [
      { title: 'Иностранный язык', marks: ['exam'] },
      { title: 'Корпоративные системы управления', marks: ['distributed-exam'] },
      { title: 'Сетевое программное обеспечение', marks: ['credit'] },
      { title: 'Сетевые технологии в АСОИУ', marks: ['exam', 'diff-credit'] },
      { title: 'Технологии машинного обучения', marks: ['exam'] },
      { title: 'Технология мультимедиа', marks: ['credit'] },
      { title: 'Философия', marks: ['credit'] },
      { title: 'Исследование операций', marks: ['credit'] },
      { title: 'Научно-исследовательская работа', marks: ['diff-credit'] },
    ],
  },
  {
    semester: 9,
    title: '9 семестр',
    note: '',
    subjects: [
      { title: 'Безопасность жизнедеятельности', marks: ['credit'] },
      { title: 'Методы поддержки принятия решений', marks: ['exam'] },
      { title: 'Технология конструирования ЭВМ', marks: ['distributed-exam'] },
      { title: 'Экономика часть 1', marks: ['credit'] },
      { title: 'Инженерная этика', marks: ['credit'] },
      { title: 'Имитационное моделирование дискретных процессов', marks: ['exam', 'diff-credit'] },
      { title: 'Научно-исследовательская работа', marks: ['diff-credit'] },
    ],
  },
  {
    semester: 10,
    title: '10 семестр',
    note: '',
    subjects: [
      { title: 'Экономика часть 2', marks: ['credit'] },
      { title: 'Эксплуатация АСОИУ', marks: ['exam'] },
      { title: 'Элементы управления в АСОИУ', marks: ['exam'] },
      { title: 'Защита информации', marks: ['credit'] },
      { title: 'Анализ характеристик производительности КИС', marks: ['credit'] },
      { title: 'Научно-исследовательская работа', marks: ['diff-credit'] },
      { title: 'Преддипломная практика', marks: ['diff-credit'] },
      { title: 'Инклюзивная адаптационная практика', marks: ['diff-credit'] },
      { title: 'Русский язык делового общения', marks: ['credit'] },
    ],
  },
] as const;

const bachelorCurriculumBasicRt52025: CurriculumSemester[] = [
  {
    semester: 1,
    title: '1 семестр',
    note: '',
    subjects: [
      { title: 'Аналитическая геометрия', marks: ['distributed-exam'] },
      { title: 'Математический анализ', marks: ['exam'] },
      { title: 'Начертательная геометрия', marks: ['distributed-exam'] },
      { title: 'Социология', marks: ['credit'] },
      { title: 'Физическая культура и спорт', marks: ['credit'] },
      { title: 'Иностранный язык', marks: ['exam'] },
      { title: 'Информатика', marks: ['distributed-exam'] },
      { title: 'История России', marks: ['distributed-exam'] },
      { title: 'Основы программирования', marks: ['exam'] },
      { title: 'Проектно-технологическая практика', marks: ['diff-credit'] },
    ],
  },
  {
    semester: 2,
    title: '2 семестр',
    note: '',
    subjects: [
      { title: 'Иностранный язык', marks: ['exam'] },
      { title: 'История России', marks: ['distributed-exam'] },
      { title: 'Архитектура автоматизированных систем обработки информации и управления', marks: ['exam'] },
      { title: 'Инженерная графика', marks: ['diff-credit'] },
      { title: 'Интегралы и дифференциальные уравнения', marks: ['exam'] },
      { title: 'Линейная алгебра и функции нескольких переменных', marks: ['distributed-exam'] },
      { title: 'Программирование на основе классов и шаблонов', marks: ['exam'] },
      { title: 'Физика', marks: ['exam'] },
      { title: 'Проектно-технологическая практика', marks: ['diff-credit'] },
    ],
  },
  {
    semester: 3,
    title: '3 семестр',
    note: '',
    subjects: [
      { title: 'Иностранный язык', marks: ['exam'] },
      { title: 'Архитектура автоматизированных систем обработки информации и управления', marks: ['diff-credit'] },
      { title: 'Физика', marks: ['exam'] },
      { title: 'Теория вероятностей и математическая статистика', marks: ['exam'] },
      { title: 'Электротехника', marks: ['exam'] },
      { title: 'Модели данных', marks: ['credit'] },
      { title: 'Правоведение', marks: ['credit'] },
      { title: 'Экология', marks: ['credit'] },
      { title: 'Парадигмы и конструкции языков программирования', marks: ['credit'] },
      { title: 'Технологическая практика', marks: ['diff-credit'] },
    ],
  },
  {
    semester: 4,
    title: '4 семестр',
    note: '',
    subjects: [
      { title: 'Иностранный язык', marks: ['exam'] },
      { title: 'Базы данных', marks: ['distributed-exam', 'diff-credit'] },
      { title: 'Дискретная математика', marks: ['distributed-exam'] },
      { title: 'Системное программирование', marks: ['credit', 'diff-credit'] },
      { title: 'Схемотехника дискретных устройств', marks: ['exam'] },
      { title: 'Электроника', marks: ['exam'] },
      { title: 'Политология', marks: ['credit'] },
      { title: 'Эксплуатационная практика', marks: ['diff-credit'] },
    ],
  },
  {
    semester: 5,
    title: '5 семестр',
    note: '',
    subjects: [
      { title: 'Иностранный язык', marks: ['exam'] },
      { title: 'Вычислительные средства АСОИУ', marks: ['exam', 'diff-credit'] },
      { title: 'Операционные системы', marks: ['exam'] },
      { title: 'Теория управления', marks: ['credit'] },
      { title: 'Разработка интернет-приложений', marks: ['exam'] },
      { title: 'Оперативный анализ данных', marks: ['credit'] },
      { title: 'Эксплуатационная практика', marks: ['diff-credit'] },
      { title: 'Научно-исследовательская работа', marks: ['diff-credit'] },
      { title: 'История науки и техники', marks: ['credit'] },
      { title: 'Сети и телекоммуникации', marks: ['exam'] },
    ],
  },
  {
    semester: 6,
    title: '6 семестр',
    note: '',
    subjects: [
      { title: 'Иностранный язык', marks: ['exam'] },
      { title: 'Сетевые технологии в АСОИУ', marks: ['exam', 'diff-credit'] },
      { title: 'Технология мультимедиа', marks: ['credit'] },
      { title: 'Философия', marks: ['credit'] },
      { title: 'Корпоративные системы управления', marks: ['distributed-exam'] },
      { title: 'Технологии машинного обучения', marks: ['exam'] },
      { title: 'Сетевое программное обеспечение', marks: ['credit'] },
      { title: 'Исследование операций', marks: ['credit'] },
      { title: 'Научно-исследовательская работа', marks: ['diff-credit'] },
      { title: 'Основы антикоррупционной деятельности в Российской Федерации', marks: ['credit'] },
    ],
  },
  {
    semester: 7,
    title: '7 семестр',
    note: '',
    subjects: [
      { title: 'Методы поддержки принятия решений', marks: ['exam'] },
      { title: 'Технология конструирования ЭВМ', marks: ['distributed-exam'] },
      { title: 'Экономика часть 1', marks: ['credit'] },
      { title: 'Безопасность жизнедеятельности', marks: ['credit'] },
      { title: 'Инженерная этика', marks: ['credit'] },
      { title: 'Беспроводные сети', marks: ['exam'] },
      { title: 'Имитационное моделирование дискретных процессов', marks: ['exam', 'diff-credit'] },
      { title: 'Научно-исследовательская работа', marks: ['diff-credit'] },
    ],
  },
  {
    semester: 8,
    title: '8 семестр',
    note: '',
    subjects: [
      { title: 'Экономика часть 2', marks: ['credit'] },
      { title: 'Эксплуатация АСОИУ', marks: ['exam'] },
      { title: 'Элементы управления в АСОИУ', marks: ['exam'] },
      { title: 'Защита информации', marks: ['credit'] },
      { title: 'Анализ характеристик производительности КИС', marks: ['credit'] },
      { title: 'Русский язык делового общения', marks: ['credit'] },
      { title: 'Научно-исследовательская работа', marks: ['diff-credit'] },
      { title: 'Преддипломная практика', marks: ['diff-credit'] },
      { title: 'Подготовка и защита ВКР', marks: ['exam'] },
    ],
  },
] as const;

const bachelorCurriculumSpecialist: CurriculumSemester[] = [
  {
    semester: 1,
    title: '1 семестр',
    note: '',
    subjects: [
      { title: 'Аналитическая геометрия', marks: ['distributed-exam'] },
      { title: 'Иностранный язык', marks: ['distributed-exam'] },
      { title: 'Математический анализ', marks: ['exam'] },
      { title: 'Начертательная геометрия', marks: ['distributed-exam'] },
      { title: 'Социология', marks: ['credit'] },
      { title: 'Физическая культура и спорт', marks: ['credit'] },
      { title: 'Информатика', marks: ['distributed-exam'] },
      { title: 'История России', marks: ['distributed-exam'] },
      { title: 'Основы программирования', marks: ['exam'] },
    ],
  },
  {
    semester: 2,
    title: '2 семестр',
    note: '',
    subjects: [
      { title: 'Иностранный язык', marks: ['distributed-exam'] },
      { title: 'История России', marks: ['distributed-exam'] },
      { title: 'Архитектура автоматизированных систем обработки информации и управления', marks: ['exam'] },
      { title: 'Инженерная графика', marks: ['diff-credit'] },
      { title: 'Интегралы и дифференциальные уравнения', marks: ['exam'] },
      { title: 'Линейная алгебра и функции нескольких переменных', marks: ['distributed-exam'] },
      { title: 'Программирование на основе классов и шаблонов', marks: ['exam'] },
      { title: 'Физика', marks: ['exam'] },
    ],
  },
  {
    semester: 3,
    title: '3 семестр',
    note: '',
    subjects: [
      { title: 'Иностранный язык', marks: ['distributed-exam'] },
      { title: 'Архитектура автоматизированных систем обработки информации и управления', marks: ['diff-credit'] },
      { title: 'Физика', marks: ['exam'] },
      { title: 'Теория вероятностей и математическая статистика', marks: ['exam'] },
      { title: 'Электротехника', marks: ['exam'] },
      { title: 'Модели данных', marks: ['credit'] },
      { title: 'Правоведение', marks: ['credit'] },
      { title: 'Экология', marks: ['credit'] },
      { title: 'Парадигмы и конструкции языков программирования', marks: ['credit'] },
    ],
  },
  {
    semester: 4,
    title: '4 семестр',
    note: '',
    subjects: [
      { title: 'Иностранный язык', marks: ['distributed-exam'] },
      { title: 'Базы данных', marks: ['distributed-exam', 'diff-credit'] },
      { title: 'Дискретная математика', marks: ['distributed-exam'] },
      { title: 'Системное программирование', marks: ['credit', 'diff-credit'] },
      { title: 'Электроника', marks: ['exam'] },
      { title: 'Схемотехника дискретных устройств', marks: ['distributed-exam'] },
      { title: 'Политология', marks: ['credit'] },
    ],
  },
  {
    semester: 5,
    title: '5 семестр',
    note: '',
    subjects: [
      { title: 'Иностранный язык', marks: ['distributed-exam'] },
      { title: 'Вычислительные средства АСОИУ', marks: ['distributed-exam', 'diff-credit'] },
      { title: 'Операционные системы', marks: ['exam'] },
      { title: 'Сети и телекоммуникации', marks: ['exam'] },
      { title: 'Теория управления', marks: ['credit'] },
      { title: 'Проектирование систем и продуктовая веб-разработка', marks: ['exam'] },
      { title: 'Тестирование, профилирование, оптимизация программных систем', marks: ['credit'] },
      { title: 'Оперативный анализ данных', marks: ['credit'] },
    ],
  },
  {
    semester: 6,
    title: '6 семестр',
    note: '',
    subjects: [
      { title: 'Иностранный язык', marks: ['distributed-exam'] },
      { title: 'Технология мультимедиа', marks: ['credit'] },
      { title: 'Философия', marks: ['credit'] },
      { title: 'Корпоративные сети, масштабирование и оптимизация', marks: ['distributed-exam'] },
      { title: 'Технология машинного обучения', marks: ['exam'] },
      { title: 'Исследование операций', marks: ['credit'] },
      { title: 'Сетевое программное обеспечение', marks: ['credit'] },
      { title: 'Имитационное моделирование дискретных процессов', marks: ['distributed-exam'] },
    ],
  },
  {
    semester: 7,
    title: '7 семестр',
    note: '',
    subjects: [
      { title: 'Методы поддержки принятия решений', marks: ['exam'] },
      { title: 'Экономика часть 1', marks: ['credit'] },
      { title: 'Безопасность жизнедеятельности', marks: ['credit'] },
      { title: 'ИИ-технологии жизненного цикла информационных систем', marks: ['distributed-exam'] },
      { title: 'Методы проектирования АСОИУ', marks: ['credit'] },
      { title: 'Технология конструирования ЭВМ', marks: ['distributed-exam'] },
      { title: 'Инженерная этика', marks: ['credit'] },
      { title: 'Инструменты и технологии промышленной разработки программных систем', marks: ['credit'] },
    ],
  },
  {
    semester: 8,
    title: '8 семестр',
    note: '',
    subjects: [
      { title: 'Экономика часть 2', marks: ['credit'] },
      { title: 'Эксплуатация АСОИУ', marks: ['exam'] },
      { title: 'Русский язык делового общения', marks: ['credit'] },
      { title: 'Анализ характеристик производительности КИС', marks: ['credit'] },
      { title: 'Архитектура и безопасность информационных систем', marks: ['credit'] },
      { title: 'Защита информации', marks: ['credit'] },
      { title: 'Разработка высоконагруженных информационных систем', marks: ['credit'] },
    ],
  },
] as const;

const bachelorCurriculumPlansBySubtype: Record<BachelorPlanSubtype, BachelorCurriculumPlan[]> = {
  basic: [
    {
      id: 'iu5-09.03.01-2025-moscow',
      type: 'bachelor',
      subtype: 'basic',
      planLabel: 'Москва',
      title: '09.03.01 — Информатика и вычислительная техника',
      profile: 'Системы обработки информации и управления',
      department: 'ИУ5',
      degree: 'Бакалавр',
      duration: '4 года',
      year: '2025',
      studyForm: 'Очная',
      curriculum: bachelorCurriculumBasicMoscow2025,
    },
    {
      id: 'iu5-09.03.01-2026-tashkent',
      type: 'bachelor',
      subtype: 'basic',
      planLabel: 'Ташкент',
      title: '09.03.01 — Информатика и вычислительная техника',
      profile: 'Системы обработки информации и управления (Ташкент)',
      department: 'ИУ5',
      degree: 'Бакалавр',
      duration: '4 года',
      year: '2026',
      studyForm: 'Очная',
      curriculum: bachelorCurriculumBasicTashkent2026,
    },
    {
      id: 'iu5c-09.03.01-2025-adaptive-1',
      type: 'bachelor',
      subtype: 'basic',
      planLabel: 'ИУ5-Ц',
      title: '09.03.01 — Информатика и вычислительная техника',
      profile: 'Системы обработки информации и управления (адаптационный план №1)',
      department: 'ИУ5-Ц, ИУ5',
      degree: 'Бакалавр',
      duration: '5 лет',
      year: '2025',
      studyForm: 'Очная',
      curriculum: bachelorCurriculumBasicAdaptive2025,
    },
    {
      id: 'rt5-09.03.01-2025-industry',
      type: 'bachelor',
      subtype: 'basic',
      planLabel: 'РТ5',
      title: '09.03.01 — Информатика и вычислительная техника',
      profile: 'Системы обработки информации и управления (отраслевая)',
      department: 'РТ5, ИУ5',
      degree: 'Бакалавр',
      duration: '4 года',
      year: '2025',
      studyForm: 'Очная',
      curriculum: bachelorCurriculumBasicRt52025,
    },
  ],
  specialist: [
    {
      id: 'iu5-specialist-2025',
      type: 'bachelor',
      subtype: 'specialist',
      planLabel: 'План',
      title: '09.03.01 — Информатика и вычислительная техника',
      profile: 'Инженерия интеллектуальных систем обработки информации и управления',
      department: 'ИУ5',
      degree: 'Специалист',
      duration: '6 лет',
      year: '2025',
      studyForm: 'Очная',
      curriculum: bachelorCurriculumSpecialist,
    },
  ],
};

type ChartPoint = {
  year: number;
  score: number;
  x: number;
  y: number;
};

function buildChartPoints(items: Array<{ year: number; score: number }>): ChartPoint[] {
  if (!items.length) return [];

  const chartLeft = 80;
  const chartRight = 576;
  const chartTop = 78;
  const chartBottom = 194;
  const minScore = Math.min(...items.map((item) => item.score));
  const maxScore = Math.max(...items.map((item) => item.score));
  const scoreRange = maxScore - minScore || 1;

  return items.map((item, index) => {
    const progress = items.length === 1 ? 0.5 : index / (items.length - 1);
    const normalized = (item.score - minScore) / scoreRange;

    return {
      year: item.year,
      score: item.score,
      x: chartLeft + (chartRight - chartLeft) * progress,
      y: chartBottom - (chartBottom - chartTop) * normalized,
    };
  });
}

function buildLinePath(points: ChartPoint[]) {
  if (!points.length) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
}

function buildAreaPath(points: ChartPoint[]) {
  if (!points.length) return '';
  const linePath = buildLinePath(points);
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  return `${linePath} L ${lastPoint.x} 216 L ${firstPoint.x} 216 Z`;
}

function GraphCard({
  title,
  points,
  label,
}: {
  title: string;
  points: ChartPoint[];
  label: string;
}) {
  const linePath = buildLinePath(points);
  const areaPath = buildAreaPath(points);
  const safeId = label.replace(/\s+/g, '-');

  return (
    <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-[#07101f]/95 p-5">
      <div className="mb-4 flex items-center gap-4">
        <p className="text-lg font-semibold text-white">{title}</p>
      </div>

      {points.length ? (
        <svg viewBox="0 0 640 260" className="h-auto w-full" role="img" aria-label={label}>
          <defs>
            <linearGradient id={safeId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <linearGradient id={`${safeId}-area`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(34,211,238,0.28)" />
              <stop offset="100%" stopColor="rgba(34,211,238,0)" />
            </linearGradient>
            <filter id={`${safeId}-glow`}>
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <line x1="56" y1="28" x2="56" y2="216" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
          <line x1="56" y1="216" x2="600" y2="216" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />

          {[72, 122, 172].map((y) => (
            <line
              key={y}
              x1="56"
              y1={y}
              x2="600"
              y2={y}
              stroke="rgba(255,255,255,0.1)"
              strokeDasharray="5 10"
            />
          ))}

          {points.map((point) => (
            <line
              key={`${point.year}-guide`}
              x1={point.x}
              y1="28"
              x2={point.x}
              y2="216"
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="4 10"
            />
          ))}

          {areaPath ? <path fill={`url(#${safeId}-area)`} d={areaPath} /> : null}

          {linePath ? (
            <path
              d={linePath}
              fill="none"
              stroke={`url(#${safeId})`}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#${safeId}-glow)`}
            />
          ) : null}

          {points.map((point) => (
            <g key={point.year}>
              <circle cx={point.x} cy={point.y} r="11" fill="rgba(34,211,238,0.12)" />
              <circle cx={point.x} cy={point.y} r="7" fill="#08101f" stroke="#67e8f9" strokeWidth="4" />
              <text x={point.x} y="240" textAnchor="middle" fill="rgba(255,255,255,0.62)" fontSize="18">
                {point.year}
              </text>
              <text x={point.x} y={point.y - 18} textAnchor="middle" fill="rgba(255,255,255,0.82)" fontSize="18">
                {point.score}
              </text>
            </g>
          ))}
        </svg>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-white/60">
          Пока нет данных для графика.
        </div>
      )}
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <section className="mt-8 overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_38%),linear-gradient(180deg,rgba(10,16,32,0.96),rgba(4,8,22,0.98))] shadow-[0_28px_90px_rgba(0,0,0,0.35)]">
      {children}
    </section>
  );
}

function TooltipBadge({ type }: { type: (typeof assessmentLegend)[number]['id'] }) {
  const item = assessmentLegend.find((entry) => entry.id === type);

  if (!item) return null;

  return (
    <span className="group relative inline-flex">
      <span
        tabIndex={0}
        aria-label={item.label}
        className={[
          'inline-flex h-12 min-w-12 items-center justify-center rounded-full px-3 text-base font-bold tracking-tight shadow-[0_0_20px_rgba(0,0,0,0.24)]',
          item.style,
        ].join(' ')}
      >
        {item.short}
      </span>
      <span className="pointer-events-none absolute left-1/2 top-0 z-50 -translate-x-1/2 -translate-y-[calc(100%-0.15rem)] whitespace-nowrap rounded-lg border border-cyan-300/35 bg-[#050816]/95 px-3 py-1.5 text-xs font-medium text-cyan-100 opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-all duration-200 group-hover:-translate-y-[calc(100%+0.4rem)] group-hover:opacity-100 group-focus-within:-translate-y-[calc(100%+0.4rem)] group-focus-within:opacity-100">
        {item.label}
      </span>
    </span>
  );
}

function CurriculumPlanSummary({ plan }: { plan: BachelorCurriculumPlan }) {
  return (
    <div className="border-b border-white/10 bg-white/[0.03] px-6 py-5 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Программа</p>
      <div className="mt-3 space-y-1 text-sm leading-6 text-white/84 sm:text-base">
        <p className="text-white">{plan.title}</p>
        <p>{plan.profile}</p>
        <p>Кафедра {plan.department}</p>
        <p>{plan.studyForm}</p>
      </div>
    </div>
  );
}

function MasterPlanSummary({ plan }: { plan: MasterCurriculumPlan }) {
  return (
    <div className="border-b border-white/10 bg-white/[0.03] px-6 py-5 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Программа</p>
      <div className="mt-3 space-y-1 text-sm leading-6 text-white/84 sm:text-base">
        <p className="text-white">{plan.title}</p>
        <p>{plan.program}</p>
        <p>{plan.department}</p>
        <p>{plan.studyForm}</p>
      </div>
    </div>
  );
}

export default function ApplicantsCategoryToggle({ stats }: ApplicantsCategoryToggleProps) {
  const [activeDegree, setActiveDegree] = useState<(typeof degreeOptions)[number]['id']>('bachelor');
  const [activeBachelorOption, setActiveBachelorOption] =
    useState<(typeof bachelorOptions)[number]['id']>('budget');
  const [activeBachelorView, setActiveBachelorView] =
    useState<(typeof masterViewOptions)[number]['id']>('overview');
  const [activeBachelorCurriculumOption, setActiveBachelorCurriculumOption] =
    useState<(typeof bachelorCurriculumOptions)[number]['id']>('four-year');
  const [activeBachelorPlanIndexes, setActiveBachelorPlanIndexes] = useState<{
    basic: number;
    specialist: number;
  }>({
    basic: 0,
    specialist: 0,
  });
  const [activeBachelorSemesterIndex, setActiveBachelorSemesterIndex] = useState(0);
  const [activeMasterView, setActiveMasterView] =
    useState<(typeof masterViewOptions)[number]['id']>('overview');
  const [activeMasterPlanIndex, setActiveMasterPlanIndex] = useState(0);
  const [activeMasterSemesterIndex, setActiveMasterSemesterIndex] = useState(0);

  const budgetAdmissionStats = useMemo(
    () => stats.filter((item) => item.category === 'budget').sort((a, b) => b.year - a.year),
    [stats],
  );
  const paidAdmissionStats = useMemo(
    () => stats.filter((item) => item.category === 'paid').sort((a, b) => b.year - a.year),
    [stats],
  );

  const budgetChartPoints = useMemo(
    () =>
      buildChartPoints(
        [...budgetAdmissionStats]
          .sort((a, b) => a.year - b.year)
          .filter((item) => item.averageScore !== null)
          .map((item) => ({ year: item.year, score: item.averageScore as number })),
      ),
    [budgetAdmissionStats],
  );

  const paidChartPoints = useMemo(
    () =>
      buildChartPoints(
        [...paidAdmissionStats]
          .sort((a, b) => a.year - b.year)
          .map((item) => ({ year: item.year, score: item.passingScore })),
      ),
    [paidAdmissionStats],
  );

  const masterChartPoints = useMemo(
    () =>
      buildChartPoints(
        [...masterYearlyStats]
          .sort((a, b) => a.year - b.year)
          .map((item) => ({ year: item.year, score: item.passingScore })),
      ),
    [],
  );

  const activeMasterPlan = masterCurriculumPlans[activeMasterPlanIndex] ?? masterCurriculumPlans[0];
  const activeMasterCurriculum = activeMasterPlan?.curriculum ?? [];

  const activeBachelorPlanSubtype: BachelorPlanSubtype =
    activeBachelorCurriculumOption === 'four-year' ? 'basic' : 'specialist';
  const activeBachelorPlans = bachelorCurriculumPlansBySubtype[activeBachelorPlanSubtype];
  const activeBachelorPlanIndex = activeBachelorPlanIndexes[activeBachelorPlanSubtype];
  const activeBachelorPlan =
    activeBachelorPlans[activeBachelorPlanIndex] ?? activeBachelorPlans[0] ?? null;
  const activeBachelorCurriculum = activeBachelorPlan?.curriculum ?? [];

  const handleDegreeSelect = (degreeId: (typeof degreeOptions)[number]['id']) => {
    startTransition(() => {
      setActiveDegree(degreeId);
      if (degreeId === 'bachelor') {
        setActiveBachelorView('overview');
        setActiveBachelorCurriculumOption('four-year');
        setActiveBachelorSemesterIndex(0);
      }
      if (degreeId === 'master') {
        setActiveMasterView('overview');
        setActiveMasterPlanIndex(0);
        setActiveMasterSemesterIndex(0);
      }
    });
  };

  const handleBachelorSelect = (optionId: (typeof bachelorOptions)[number]['id']) => {
    startTransition(() => {
      setActiveBachelorOption(optionId);
    });
  };

  const handleBachelorViewSelect = (viewId: (typeof masterViewOptions)[number]['id']) => {
    startTransition(() => {
      setActiveBachelorView(viewId);
      if (viewId === 'curriculum') {
        setActiveBachelorSemesterIndex(0);
      }
    });
  };

  const handleBachelorCurriculumOptionSelect = (
    optionId: (typeof bachelorCurriculumOptions)[number]['id'],
  ) => {
    startTransition(() => {
      setActiveBachelorCurriculumOption(optionId);
      setActiveBachelorSemesterIndex(0);
    });
  };

  const handleBachelorPlanSelect = (planIndex: number) => {
    startTransition(() => {
      setActiveBachelorPlanIndexes((current) => ({
        ...current,
        [activeBachelorPlanSubtype]: planIndex,
      }));
      setActiveBachelorSemesterIndex(0);
    });
  };

  const handleBachelorSemesterChange = (direction: 'prev' | 'next') => {
    startTransition(() => {
      setActiveBachelorSemesterIndex((current) => {
        if (!activeBachelorCurriculum.length) return 0;

        if (direction === 'prev') {
          return current === 0 ? activeBachelorCurriculum.length - 1 : current - 1;
        }

        return current === activeBachelorCurriculum.length - 1 ? 0 : current + 1;
      });
    });
  };

  const handleMasterViewSelect = (viewId: (typeof masterViewOptions)[number]['id']) => {
    startTransition(() => {
      setActiveMasterView(viewId);
      if (viewId === 'curriculum') {
        setActiveMasterSemesterIndex(0);
      }
    });
  };

  const handleMasterPlanSelect = (planIndex: number) => {
    startTransition(() => {
      setActiveMasterPlanIndex(planIndex);
      setActiveMasterSemesterIndex(0);
    });
  };

  const handleSemesterChange = (direction: 'prev' | 'next') => {
    startTransition(() => {
      setActiveMasterSemesterIndex((current) => {
        if (!activeMasterCurriculum.length) return 0;

        if (direction === 'prev') {
          return current === 0 ? activeMasterCurriculum.length - 1 : current - 1;
        }

        return current === activeMasterCurriculum.length - 1 ? 0 : current + 1;
      });
    });
  };

  const activeBachelorSemester =
    activeBachelorCurriculum[activeBachelorSemesterIndex] ?? activeBachelorCurriculum[0];
  const activeSemester = activeMasterCurriculum[activeMasterSemesterIndex] ?? activeMasterCurriculum[0];

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-4 sm:flex-row">
        {degreeOptions.map((option) => {
          const isActive = activeDegree === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleDegreeSelect(option.id)}
              className={[
                'rounded-2xl px-6 py-4 text-base font-semibold transition duration-200',
                isActive
                  ? 'bg-cyan-400 text-[#050816] shadow-[0_0_28px_rgba(34,211,238,0.45)]'
                  : 'border border-white/12 bg-white/8 text-white/78 hover:bg-white/12',
              ].join(' ')}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {activeDegree === 'bachelor' ? (
        <>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            {masterViewOptions.map((option) => {
              const isActive = activeBachelorView === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleBachelorViewSelect(option.id)}
                  className={[
                    'rounded-2xl px-6 py-4 text-base font-semibold transition duration-200',
                    isActive
                      ? 'bg-cyan-400 text-[#050816] shadow-[0_0_28px_rgba(34,211,238,0.45)]'
                      : 'border border-white/12 bg-white/8 text-white/78 hover:bg-white/12',
                  ].join(' ')}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {activeBachelorView === 'overview' ? (
            <>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                {bachelorOptions.map((option) => {
                  const isActive = activeBachelorOption === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleBachelorSelect(option.id)}
                      className={[
                        'rounded-2xl px-6 py-4 text-base font-semibold transition duration-200',
                        isActive
                          ? 'bg-cyan-400 text-[#050816] shadow-[0_0_28px_rgba(34,211,238,0.45)]'
                          : 'border border-white/12 bg-white/8 text-white/78 hover:bg-white/12',
                      ].join(' ')}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {activeBachelorOption === 'budget' ? (
                <SectionCard>
                  <div className="grid gap-px border-b border-white/10 bg-white/10 lg:grid-cols-4">
                    {budgetStats.map((item) => (
                      <div key={item.label} className="flex min-h-[200px] flex-col bg-[#08101f]/92 px-6 py-6 lg:px-8">
                        <p className="text-sm font-medium text-white/55">{item.label}</p>
                        <p className="mt-10 text-2xl font-bold leading-tight tracking-tight text-white lg:text-3xl">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid items-stretch gap-6 px-6 py-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-8">
                    <article className="flex h-full flex-col rounded-[1.75rem] border border-cyan-400/15 bg-cyan-400/[0.06] p-6 backdrop-blur-xl">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                          Предметы ЕГЭ
                        </p>
                        <p className="mt-4 text-sm text-white/68">Минимальные баллы для подачи документов:</p>
                      </div>

                      <div className="mt-6 flex flex-col gap-4">
                        {exams.map((item) => (
                          <div
                            key={item.subject}
                            className="flex min-h-[80px] items-center justify-between gap-4 rounded-2xl border border-white/8 bg-black/20 px-4 py-4"
                          >
                            <div className="flex items-center gap-3">
                              <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.55)]" />
                              <span className="text-lg font-semibold text-white">{item.subject}</span>
                            </div>
                            <span className="text-2xl font-bold text-cyan-300">{item.score}</span>
                          </div>
                        ))}
                      </div>

                    </article>

                    <article className="flex h-full flex-col rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                      <h3 className="text-2xl font-bold text-white lg:text-3xl">Статистика приема по годам</h3>

                      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {budgetAdmissionStats.map((item) => (
                          <div
                            key={item.id}
                            className="flex min-w-0 min-h-[198px] flex-col rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/[0.07] p-5"
                          >
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                              {item.year}
                            </p>
                            <div className="mt-6 grid flex-1 grid-rows-2 gap-4 text-white/84">
                              <div className="grid grid-cols-[minmax(0,1fr)_minmax(68px,auto)] items-end gap-3">
                                <span className="pl-1 text-sm leading-5 text-white/58">
                                  <span className="block">Проходной</span>
                                  <span className="block">балл</span>
                                </span>
                                <span className="text-right text-2xl font-bold leading-none text-white">
                                  {item.passingScore}
                                </span>
                              </div>
                              <div className="grid grid-cols-[minmax(0,1fr)_minmax(68px,auto)] items-end gap-3">
                                <span className="pl-1 text-sm leading-5 text-white/58">Средний балл</span>
                                <span className="text-right text-2xl font-bold text-cyan-300">
                                  {item.averageScore ?? '-'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <GraphCard
                        title="Динамика среднего балла"
                        points={budgetChartPoints}
                        label="График динамики среднего балла"
                      />
                    </article>
                  </div>
                </SectionCard>
              ) : null}

              {activeBachelorOption === 'paid' ? (
                <SectionCard>
                  <div className="grid gap-px border-b border-white/10 bg-white/10 lg:grid-cols-4">
                    {paidStats.map((item) => (
                      <div key={item.label} className="flex min-h-[200px] flex-col bg-[#08101f]/92 px-6 py-6 lg:px-8">
                        <p className="text-sm font-medium text-white/55">{item.label}</p>
                        <p className="mt-10 text-2xl font-bold leading-tight tracking-tight text-white lg:text-3xl">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid items-stretch gap-6 px-6 py-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-8">
                    <article className="flex h-full flex-col rounded-[1.75rem] border border-cyan-400/15 bg-cyan-400/[0.06] p-6 backdrop-blur-xl">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                          Платное обучение
                        </p>
                        <p className="mt-4 text-sm text-white/68">Основные условия программы:</p>
                      </div>

                      <div className="mt-6 flex flex-col gap-4">
                        {paidStats.map((item) => (
                          <div
                            key={item.label}
                            className="flex min-h-[80px] items-center justify-between gap-4 rounded-2xl border border-white/8 bg-black/20 px-4 py-4"
                          >
                            <div className="flex items-center gap-3">
                              <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.55)]" />
                              <span className="text-base font-semibold text-white">{item.label}</span>
                            </div>
                            <span className="text-right text-xl font-bold text-cyan-300">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </article>

                    <article className="flex h-full flex-col rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                      <h3 className="text-2xl font-bold text-white lg:text-3xl">Статистика приема по годам</h3>

                      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {paidAdmissionStats.map((item) => (
                          <div
                            key={item.id}
                            className="flex min-w-0 min-h-[198px] flex-col rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/[0.07] p-5"
                          >
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                              {item.year}
                            </p>
                            <div className="mt-6 grid flex-1 grid-cols-[minmax(0,1fr)_minmax(76px,auto)] gap-3 text-white/84">
                              <span className="self-start pl-1 text-sm leading-5 text-white/58">
                                <span className="block">Проходной</span>
                                <span className="block">балл</span>
                              </span>
                              <span className="self-end text-right text-4xl font-bold tracking-tight text-cyan-300">
                                {item.passingScore}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <GraphCard
                        title="Динамика проходных баллов"
                        points={paidChartPoints}
                        label="График динамики проходных баллов"
                      />
                    </article>
                  </div>
                </SectionCard>
              ) : null}
            </>
          ) : null}

          {activeBachelorView === 'curriculum' ? (
            <>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                {bachelorCurriculumOptions.map((option) => {
                  const isActive = activeBachelorCurriculumOption === option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleBachelorCurriculumOptionSelect(option.id)}
                      className={[
                        'rounded-2xl px-6 py-4 text-base font-semibold transition duration-200',
                        isActive
                          ? 'bg-cyan-400 text-[#050816] shadow-[0_0_28px_rgba(34,211,238,0.45)]'
                          : 'border border-white/12 bg-white/8 text-white/78 hover:bg-white/12',
                      ].join(' ')}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {activeBachelorPlans.length > 1 ? (
                <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                  {activeBachelorPlans.map((plan, index) => {
                    const isActive = activeBachelorPlan?.id === plan.id;

                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => handleBachelorPlanSelect(index)}
                        className={[
                          'rounded-2xl px-6 py-4 text-base font-semibold transition duration-200',
                          isActive
                            ? 'bg-cyan-400 text-[#050816] shadow-[0_0_28px_rgba(34,211,238,0.45)]'
                            : 'border border-white/12 bg-white/8 text-white/78 hover:bg-white/12',
                        ].join(' ')}
                      >
                        {plan.planLabel}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              <SectionCard>
              {activeBachelorPlan ? <CurriculumPlanSummary plan={activeBachelorPlan} /> : null}
              <div className="grid gap-6 px-6 py-6 lg:px-8 lg:py-8">
                <article className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl">
                  <div className="border-b border-white/10 bg-[linear-gradient(90deg,rgba(34,211,238,0.12),rgba(255,255,255,0.02))] px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                          Учебный план
                        </p>
                        <h3 className="mt-2 text-2xl font-bold text-white">{activeBachelorSemester.title}</h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleBachelorSemesterChange('prev')}
                          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/20 text-xl text-white transition hover:border-cyan-300/60 hover:text-cyan-200"
                          aria-label="Предыдущий семестр"
                        >
                          ←
                        </button>
                        <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200">
                          {activeBachelorSemesterIndex + 1} / {activeBachelorCurriculum.length}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleBachelorSemesterChange('next')}
                          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/20 text-xl text-white transition hover:border-cyan-300/60 hover:text-cyan-200"
                          aria-label="Следующий семестр"
                        >
                          →
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div>
                      <div className="grid grid-cols-[minmax(0,1fr)_minmax(160px,0.36fr)] border-b border-white/10 bg-white/6 text-sm font-semibold uppercase tracking-[0.16em] text-white/74">
                        <div className="px-5 py-4 sm:px-6">Дисциплина</div>
                        <div className="flex items-center justify-center border-l border-white/10 px-4 py-4 text-center">
                          Формы контроля
                        </div>
                      </div>

                      {activeBachelorSemester.subjects.map((subject, index) => (
                        <div
                          key={subject.title}
                          className={[
                            'grid grid-cols-[minmax(0,1fr)_minmax(160px,0.36fr)] border-b border-white/6',
                            index % 2 === 0 ? 'bg-black/30' : 'bg-[#0a1020]/80',
                          ].join(' ')}
                        >
                          <div className="px-5 py-5 text-base leading-7 text-white sm:px-6">{subject.title}</div>
                          <div className="flex flex-wrap items-center justify-center gap-2 border-l border-white/10 px-4 py-5">
                            {subject.marks.map((mark) => (
                              <TooltipBadge key={`${subject.title}-${mark}`} type={mark} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              </div>
              </SectionCard>
            </>
          ) : null}
        </>
      ) : null}

      {activeDegree === 'master' ? (
        <SectionCard>
          <div className="grid gap-px border-b border-white/10 bg-white/10 lg:grid-cols-4">
            {masterTopStats.map((item) => (
              <div key={item.label} className="flex min-h-[200px] flex-col bg-[#08101f]/92 px-6 py-6 lg:px-8">
                <p className="text-sm font-medium text-white/55">{item.label}</p>
                <p className="mt-10 text-2xl font-bold leading-tight tracking-tight text-white lg:text-3xl">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="px-6 pt-6 lg:px-8 lg:pt-8">
            <div className="flex flex-col gap-4 sm:flex-row">
              {masterViewOptions.map((option) => {
                const isActive = activeMasterView === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleMasterViewSelect(option.id)}
                    className={[
                      'rounded-2xl px-6 py-4 text-base font-semibold transition duration-200',
                      isActive
                        ? 'bg-cyan-400 text-[#050816] shadow-[0_0_28px_rgba(34,211,238,0.45)]'
                        : 'border border-white/12 bg-white/8 text-white/78 hover:bg-white/12',
                    ].join(' ')}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            {masterCurriculumPlans.length > 0 ? (
              <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                {masterCurriculumPlans.map((plan, index) => {
                  const isActive = activeMasterPlan?.id === plan.id;

                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => handleMasterPlanSelect(index)}
                      className={[
                        'rounded-2xl px-6 py-4 text-base font-semibold transition duration-200',
                        isActive
                          ? 'bg-cyan-400 text-[#050816] shadow-[0_0_28px_rgba(34,211,238,0.45)]'
                          : 'border border-white/12 bg-white/8 text-white/78 hover:bg-white/12',
                      ].join(' ')}
                    >
                      {plan.planLabel}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          {activeMasterView === 'overview' ? (
            <div className="grid items-stretch gap-6 px-6 py-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-8">
              <article className="flex h-full flex-col rounded-[1.75rem] border border-cyan-400/15 bg-cyan-400/[0.06] p-6 backdrop-blur-xl">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                    Магистратура
                  </p>
                  <p className="mt-4 text-sm text-white/68">Ключевая информация о программе:</p>
                </div>

                <div className="mt-6 flex flex-col gap-4">
                  {masterHighlights.map((item) => (
                    <div
                      key={item.label}
                      className="flex min-h-[88px] flex-col justify-center rounded-2xl border border-white/8 bg-black/20 px-4 py-4"
                    >
                      <span className="text-sm text-white/58">{item.label}</span>
                      <span className="mt-2 text-lg font-semibold leading-7 text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="flex h-full flex-col rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                <h3 className="text-2xl font-bold text-white lg:text-3xl">Статистика приема по годам</h3>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {masterYearlyStats.map((item) => (
                    <div
                      key={item.year}
                      className="flex min-h-[340px] flex-col rounded-[1.5rem] border border-cyan-400/20 bg-cyan-400/[0.07] p-6"
                    >
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                        {item.year}
                      </p>
                      <div className="mt-6 grid gap-4 text-white/84 sm:grid-cols-2">
                        <div className="min-h-[84px] rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                          <span className="block text-sm leading-5 text-white/58">Абитуриентов</span>
                          <span className="mt-3 block text-[2rem] font-bold leading-none text-white">{item.applicants}</span>
                        </div>
                        <div className="min-h-[84px] rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                          <span className="block text-sm leading-5 text-white/58">Конкурс</span>
                          <span className="mt-3 block text-[2rem] font-bold leading-none text-cyan-300">{item.competition}</span>
                        </div>
                        <div className="min-h-[84px] rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                          <span className="block text-sm leading-5 text-white/58">Макс. балл</span>
                          <span className="mt-3 block text-[2rem] font-bold leading-none text-white">{item.maxScore}</span>
                        </div>
                        <div className="min-h-[84px] rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                          <span className="block text-sm leading-5 text-white/58">Проходной балл</span>
                          <span className="mt-3 block text-[2rem] font-bold leading-none text-cyan-300">{item.passingScore}</span>
                        </div>
                        <div className="min-h-[84px] rounded-2xl border border-white/8 bg-black/10 px-4 py-3 sm:col-span-2">
                          <span className="block text-sm leading-5 text-white/58">Зачислено</span>
                          <span className="mt-3 block text-[2rem] font-bold leading-none text-white">{item.enrolled}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <GraphCard
                  title="Динамика проходного балла"
                  points={masterChartPoints}
                  label="График динамики проходного балла магистратуры"
                />
              </article>
            </div>
          ) : null}

          {activeMasterView === 'curriculum' ? (
            <div className="grid gap-6 px-6 py-6 lg:px-8 lg:py-8">
              <article className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl">
                {activeMasterPlan ? <MasterPlanSummary plan={activeMasterPlan} /> : null}
                <div className="border-b border-white/10 bg-[linear-gradient(90deg,rgba(34,211,238,0.12),rgba(255,255,255,0.02))] px-5 py-5 sm:px-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
                        Учебный план
                      </p>
                      <h3 className="mt-2 text-2xl font-bold text-white">{activeSemester.title}</h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleSemesterChange('prev')}
                        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/20 text-xl text-white transition hover:border-cyan-300/60 hover:text-cyan-200"
                        aria-label="Предыдущий семестр"
                      >
                        ←
                      </button>
                      <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200">
                        {activeMasterSemesterIndex + 1} / {activeMasterCurriculum.length}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSemesterChange('next')}
                        className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/20 text-xl text-white transition hover:border-cyan-300/60 hover:text-cyan-200"
                        aria-label="Следующий семестр"
                      >
                        →
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <div>
                    <div className="grid grid-cols-[minmax(0,1fr)_minmax(160px,0.36fr)] border-b border-white/10 bg-white/6 text-sm font-semibold uppercase tracking-[0.16em] text-white/74">
                      <div className="px-5 py-4 sm:px-6">Дисциплина</div>
                      <div className="flex items-center justify-center border-l border-white/10 px-4 py-4 text-center">
                        Формы контроля
                      </div>
                    </div>

                    {activeSemester.subjects.map((subject, index) => (
                      <div
                        key={subject.title}
                        className={[
                          'grid grid-cols-[minmax(0,1fr)_minmax(160px,0.36fr)] border-b border-white/6',
                          index % 2 === 0 ? 'bg-black/30' : 'bg-[#0a1020]/80',
                        ].join(' ')}
                      >
                        <div className="px-5 py-5 text-base leading-7 text-white sm:px-6">{subject.title}</div>
                        <div className="flex flex-wrap items-center justify-center gap-2 border-l border-white/10 px-4 py-5">
                          {subject.marks.map((mark) => (
                            <TooltipBadge key={`${subject.title}-${mark}`} type={mark} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          ) : null}
        </SectionCard>
      ) : null}
    </div>
  );
}





