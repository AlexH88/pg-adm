import i18next from "i18next";

const moduleConfigs = {
  title: 'События',
  link: '/reports',
  icon: 'reports',
  tag: 'events',
  turnedOff: false,
  categories: [
    // {
    //   link: 'static',
    //   title: 'Статические',
    //   categories: [
    //     {
    //       link: 'by-users',
    //       title: 'По пользователям'
    //     },
    //     {
    //       link: 'by-users-groups',
    //       title: 'По группам пользователей'
    //     },
    //     {
    //       link: 'by-printer',
    //       title: 'По принтерам'
    //     },
    //     {
    //       link: 'by-printer-groups',
    //       title: 'По группам принтеров'
    //     },
    //   ],
    // },
    // {
    //   link: 'dynamic',
    //   title: 'Динамические',
    //   categories: [
    //     {
    //       link: 'by-users-dynamic',
    //       title: 'По пользователям'
    //     },
    //     {
    //       link: 'by-users-groups-dynamic',
    //       title: 'По группам пользователей'
    //     },
    //     {
    //       link: 'by-printer-dynamic',
    //       title: 'По принтерам'
    //     },
    //     {
    //       link: 'by-printer-groups-dynamic',
    //       title: 'По группам принтеров'
    //     },
    //   ],
    // },
    // {
    //     link: 'regular-reports',
    //     title: 'Регулярные отчеты',
    // },
    // {
    //   link: 'admin-action',
    //   title: 'Действия администратора',
    // },
    {
      link: 'events',
      title: 'Администратор',
    },
    {
      link: 'userlogs',
      title: 'Пользователь',
    },
    {
      link: 'agentlogs',
      title: 'Агент',
    },
  ],
  // categories: [
  //   {
  //     link: 'by-users',
  //     title: 'По пользователям',
  //     categories: [/*
  //       {
  //         link: 'total-stats',
  //         title: 'Общая статистика',
  //       },*/
  //       {
  //         link: 'time-stats',
  //         title: 'Статистика по времени',
  //       },
  //     ],
  //   },
  //   {
  //     link: 'by-users-groups',
  //     title: 'По группам пользователей',
  //     categories: [/*
  //       {
  //         link: 'groups-total-stats',
  //         title: 'Общая статистика',
  //       }
  //     */],
  //   },
  //   {
  //     link: 'by-printer',
  //     title: 'По принтерам',
  //     categories: [/*
  //       {
  //         link: 'printer-total-stats',
  //         title: 'Общая статистика',
  //       }
  //     */],
  //   },
  //   {
  //     link: 'by-printer-groups',
  //     title: 'По группам принтеров',
  //     categories: [/*
  //       {
  //         link: 'printer-groups-total-stats',
  //         title: 'Общая статистика',
  //       }
  //     */],
  //   },
  //   {
  //     link: 'regular-reports',
  //     title: 'Регулярные отчеты',
  //   },
  // ],
};

const timePeriods = [
  { value: 'day', label: i18next.t('Reports.day') },
  { value: 'week', label: i18next.t('Reports.week') },
  { value: 'year', label: i18next.t('Reports.year') },
];

const orderBy = [
	{ value: 'price', label: i18next.t('Reports.price') },
	{ value: 'jobs', label: i18next.t('Reports.jobs') },
  { value: 'pages', label: i18next.t('Reports.pages') },
];

const typesDiagram = [
  { label: i18next.t('Reports.bargraph'), value: '0' },
  { label: i18next.t('Reports.piechart'), value: '1' },
];

export { moduleConfigs, typesDiagram, timePeriods, orderBy };
