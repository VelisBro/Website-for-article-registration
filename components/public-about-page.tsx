import { getSiteSettings } from '@/lib/site-data';

type LeaderItem = {
  name: string;
  period: string;
};

const defaultLeaders: LeaderItem[] = [
  { name: 'С.О. Доброгурский', period: '1938–1964' },
  { name: 'В.М. Черненький', period: '1964–2022' },
  { name: 'Л.Н. Преснухин', period: '1964–1968' },
  { name: 'В.Н. Четвериков', period: '1969–1990' },
  { name: 'В.И. Терехов', period: 'с 2022 года' },
];

const defaultDevelopmentItems = [
  '1938: создана кафедра «Счётно-решающих приборов и устройств».',
  '1959: сформирована отраслевая лаборатория счётно-решающих устройств и систем управления.',
  'С 1969 года кафедра развивает направление автоматизированных систем управления.',
  '1974: создана лаборатория АИС для автоматизации учебного документооборота.',
  '1992: внедрена многоуровневая модель подготовки.',
];

const defaultAchievements = [
  'Подготовлено более 3500 инженеров и специалистов.',
  'Сформирована сильная научно-педагогическая школа.',
  'Развиваются прикладные проекты в области АСОИУ, баз данных и интеллектуальных систем.',
  'Кафедра сотрудничает с индустриальными партнёрами.',
];

const splitLines = (value: string) =>
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);

const parseLeaders = (value: string): LeaderItem[] =>
  splitLines(value)
    .map((line) => {
      const [name, period] = line.split('|').map((part) => part.trim());
      return { name: name || '', period: period || '' };
    })
    .filter((item) => item.name.length > 0);

export default async function PublicAboutPage() {
  const settings = await getSiteSettings();

  const leaders = parseLeaders(settings.aboutLeaders);
  const leadershipItems = leaders.length ? leaders : defaultLeaders;

  const developmentItems = splitLines(settings.aboutDevelopmentItems);
  const renderedDevelopmentItems = developmentItems.length ? developmentItems : defaultDevelopmentItems;

  const achievements = splitLines(settings.aboutAchievementsItems);
  const renderedAchievements = achievements.length ? achievements : defaultAchievements;

  const aboutIntro =
    settings.aboutIntro.trim() ||
    'Кафедра ИУ5 МГТУ им. Н.Э. Баумана готовит специалистов в области систем обработки информации и управления.';
  const foundationTitle = settings.aboutFoundationTitle.trim() || 'Основание';
  const foundationText =
    settings.aboutFoundationText.trim() ||
    'История кафедры начинается в 1938 году. Она стала одной из первых площадок системной подготовки инженеров в области вычислительных и управляющих систем.';
  const leadershipTitle = settings.aboutLeadershipTitle.trim() || 'Руководство кафедры';
  const developmentTitle = settings.aboutDevelopmentTitle.trim() || 'Развитие';
  const achievementsTitle = settings.aboutAchievementsTitle.trim() || 'Достижения кафедры';
  const todayTitle = settings.aboutTodayTitle.trim() || 'Сегодня';
  const todayText =
    settings.aboutTodayText.trim() ||
    'Сегодня ИУ5 сочетает фундаментальную инженерную подготовку и современные ИТ-направления: программирование, базы данных, сети, аналитику данных и интеллектуальные системы.';

  const imageCards = [
    {
      url: settings.aboutImagePrimaryUrl.trim(),
      caption: settings.aboutImagePrimaryCaption.trim(),
    },
    {
      url: settings.aboutImageSecondaryUrl.trim(),
      caption: settings.aboutImageSecondaryCaption.trim(),
    },
  ].filter((item) => item.url.length > 0);

  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">О кафедре</p>
        <h1 className="mt-3 text-4xl font-bold text-white sm:text-5xl">{settings.aboutTitle}</h1>
        <p className="mt-6 max-w-5xl text-lg leading-8 text-white/75">{aboutIntro}</p>

        {imageCards.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {imageCards.map((item, index) => (
              <figure
                key={`${item.url}-${index}`}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl"
              >
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                  <img
                    src={item.url}
                    alt={item.caption || `Изображение кафедры ${index + 1}`}
                    className="h-72 w-full object-cover"
                  />
                </div>
                {item.caption ? (
                  <figcaption className="mt-3 text-sm leading-6 text-white/65">{item.caption}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        ) : null}

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.06] p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">{foundationTitle}</h2>
            <p className="mt-4 text-base leading-7 text-white/78">{foundationText}</p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">{leadershipTitle}</h2>
            <div className="mt-4 space-y-3">
              {leadershipItems.map((leader) => (
                <div
                  key={`${leader.name}-${leader.period}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <span className="text-white/88">{leader.name}</span>
                  <span className="text-cyan-300">{leader.period}</span>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">{developmentTitle}</h2>
            <ul className="mt-4 space-y-3 text-base leading-7 text-white/78">
              {renderedDevelopmentItems.map((item) => (
                <li key={item} className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.06] p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold text-white">{achievementsTitle}</h2>
            <ul className="mt-4 space-y-3 text-base leading-7 text-white/82">
              {renderedAchievements.map((item) => (
                <li key={item} className="rounded-2xl border border-cyan-400/20 bg-[#07172a]/70 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>

        <article className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
          <h2 className="text-2xl font-semibold text-white">{todayTitle}</h2>
          <p className="mt-4 text-base leading-7 text-white/80">{todayText}</p>
        </article>
      </section>
    </main>
  );
}
