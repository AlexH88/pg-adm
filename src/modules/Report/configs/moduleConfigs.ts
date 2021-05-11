import i18next from "i18next";

const moduleConfigs = {
  title: i18next.t('Report.title'),
  link: '/report',
  icon: 'report',
  tag: 'reports',
  categories: [
    {
      link: 'report_by_users',
      title: 'Отчет по пользователям',
      tag: 'report_by_users'
    },
    {
      link: 'report_by_printers',
      title: 'Отчет по принтерам',
      tag: 'report_by_printers'
    },
    {
      link: 'report_by_group_users',
      title: 'Отчет по группам пользователей',
      tag: 'report_by_group_users'
    },
    {
      link: 'report_by_group_printers',
      title: 'Отчет по группам принтеров',
      tag: 'report_by_group_printers'
    },
  ],
};

export { moduleConfigs };
