import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { normalizeDatabaseUrl } from '../lib/database-url';

normalizeDatabaseUrl();

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMeAdmin123!';
  const displayName = process.env.ADMIN_DISPLAY_NAME || 'Administrator';

  const passwordHash = await bcrypt.hash(password, 12);

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { username },
  });

  if (!existingAdmin) {
    await prisma.adminUser.create({
      data: {
        username,
        passwordHash,
        displayName,
      },
    });
  } else if (existingAdmin.displayName !== displayName) {
    await prisma.adminUser.update({
      where: { username },
      data: {
        displayName,
      },
    });
  }

  const settingsData = {
    siteTitle: 'Кафедра ИУ-5 МГТУ им. Н.Э. Баумана',
    siteDescription: 'Системы обработки информации и управления',
    heroBadge: 'Кафедра ИУ-5 · цифровая инженерия и интеллектуальные системы',
    heroTitle: 'Сильная IT-кафедра',
    heroSubtitle: 'для технологий будущего',
    heroDescription:
      'Кафедра ИУ-5 объединяет фундаментальную инженерную подготовку, современные цифровые технологии, обработку информации, системы управления и практико-ориентированное обучение.',
    homeDirections:
      'Интеллектуальные системы\nОбработка информации\nСистемы управления\nИнженерное программное обеспечение\nАналитика данных\nЦифровые проекты',
    aboutTitle: 'Кафедра ИУ-5 — системы обработки информации и управления',
    aboutDescription:
      'Раздел о кафедре может содержать историю, основные направления подготовки, научные интересы, лаборатории, индустриальные связи и ключевые преимущества для студентов и абитуриентов.',
    aboutIntro:
      'Кафедра ИУ5 МГТУ им. Н.Э. Баумана готовит специалистов в области систем обработки информации и управления.',
    aboutFoundationTitle: 'Основание',
    aboutFoundationText:
      'История кафедры начинается в 1938 году. Она стала одной из первых площадок системной подготовки инженеров в области вычислительных и управляющих систем.',
    aboutLeadershipTitle: 'Руководство кафедры',
    aboutLeaders:
      'С.О. Доброгурский | 1938–1964\nВ.М. Черненький | 1964–2022\nЛ.Н. Преснухин | 1964–1968\nВ.Н. Четвериков | 1969–1990\nВ.И. Терехов | с 2022 года',
    aboutDevelopmentTitle: 'Развитие',
    aboutDevelopmentItems:
      '1938: создана кафедра «Счётно-решающих приборов и устройств».\n1959: создана отраслевая лаборатория счётно-решающих устройств и систем управления.\nС 1969 года кафедра развивает направление автоматизированных систем управления.\n1974: создана лаборатория АИС для автоматизации учебного документооборота.\n1992: внедрена многоуровневая модель подготовки.',
    aboutAchievementsTitle: 'Достижения кафедры',
    aboutAchievementsItems:
      'Подготовлено более 3500 инженеров и специалистов.\nСформирована сильная научно-педагогическая школа.\nРазвиваются прикладные проекты в области АСОИУ, БД и интеллектуальных систем.\nКафедра сотрудничает с индустриальными партнёрами.',
    aboutTodayTitle: 'Сегодня',
    aboutTodayText:
      'Сегодня ИУ5 сочетает фундаментальную инженерную подготовку и современные ИТ-направления: программирование, базы данных, сети, аналитику данных и интеллектуальные системы.',
    aboutImagePrimaryUrl: '',
    aboutImagePrimaryCaption: '',
    aboutImageSecondaryUrl: '',
    aboutImageSecondaryCaption: '',
    contactsTitle: 'Контактная информация кафедры',
    contactsDescription:
      'Здесь можно разместить официальные контакты кафедры, адрес, телефон, почту, часы консультаций и важную организационную информацию.',
    contactsPhone: '+7 (___) ___-__-__',
    contactsEmail: 'iu5@example.ru',
    contactsAddress: 'Москва, МГТУ им. Н.Э. Баумана',
    contactsWorkingHours: 'пн-пт, 9:00-18:00',
  };

  const settings = await prisma.siteSettings.findFirst();

  if (!settings) {
    await prisma.siteSettings.create({
      data: settingsData,
    });
  } else {
    await prisma.siteSettings.update({
      where: { id: settings.id },
      data: {
        aboutLeaders: settingsData.aboutLeaders,
      },
    });
  }

  const posts = [
    {
      slug: 'open-day-announcement',
      title: 'Анонс дня открытых дверей кафедры',
      publishedAt: new Date('2026-04-10T09:00:00.000Z'),
      category: 'Главная новость',
      excerpt: 'Кафедра ИУ-5 приглашает абитуриентов и родителей на день открытых дверей.',
      content:
        'Кафедра ИУ-5 приглашает абитуриентов, школьников и родителей на день открытых дверей.\n\nГости смогут познакомиться с преподавателями, образовательными программами и возможностями для развития.',
      imageUrl: '/images/placeholder.jpg',
      featured: true,
      featuredRank: 1,
      isPublished: true,
    },
    {
      slug: 'site-created',
      title: 'Создан новый сайт кафедры ИУ-5',
      publishedAt: new Date('2026-03-27T09:00:00.000Z'),
      category: 'Главная новость',
      excerpt: 'Запущена новая версия сайта кафедры ИУ-5.',
      content:
        'Запущена новая версия сайта кафедры ИУ-5.\n\nНовый сайт выполнен в современном стиле и подготовлен к дальнейшему развитию с полноценной административной частью.',
      imageUrl: '/images/placeholder.jpg',
      featured: true,
      featuredRank: 2,
      isPublished: true,
    },
    {
      slug: 'news-section-ready',
      title: 'Раздел новостей готов к наполнению',
      publishedAt: new Date('2026-03-20T09:00:00.000Z'),
      category: 'Объявление',
      excerpt: 'На сайте подготовлен полноценный раздел новостей.',
      content:
        'На сайте подготовлен полноценный раздел новостей.\n\nТеперь публикации можно добавлять и редактировать через административную панель.',
      imageUrl: '/images/placeholder.jpg',
      featured: false,
      featuredRank: null,
      isPublished: true,
    },
  ];

  for (const post of posts) {
    await prisma.newsPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  const admissionStats = [
    { category: 'budget', year: 2025, passingScore: 278, averageScore: 288 },
    { category: 'budget', year: 2024, passingScore: 297, averageScore: 299 },
    { category: 'budget', year: 2023, passingScore: 296, averageScore: 297 },
    { category: 'budget', year: 2022, passingScore: 291, averageScore: 296 },
    { category: 'paid', year: 2024, passingScore: 146, averageScore: null },
    { category: 'paid', year: 2023, passingScore: 223, averageScore: null },
  ];

  for (const stat of admissionStats) {
    await prisma.applicantAdmissionStat.upsert({
      where: {
        category_year: {
          category: stat.category,
          year: stat.year,
        },
      },
      update: {
        passingScore: stat.passingScore,
        averageScore: stat.averageScore,
      },
      create: stat,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
