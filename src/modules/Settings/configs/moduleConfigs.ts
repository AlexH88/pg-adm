import i18next from "i18next";

const moduleConfigs = {
  title: i18next.t('SettingsLk.settings'),
  link: '/settings',
  icon: 'settings',
  tag: 'general',
  categories: [
    {
      link: 'administration',
      title: i18next.t('SettingsLk.administration'),
      tag: 'admin_management',
      categories: [
        {
          link: 'roles',
          title: i18next.t('SettingsLk.roles'),
          tag: 'roles',
        },
        {
          link: 'operators',
          title: i18next.t('SettingsLk.operators'),
          tag: 'operators',
        },
      ],
    },
    {
      link: 'features',
      title: i18next.t('SettingsLk.features'),
      turnedOff: true,
    },
    {
      link: 'blocked_printers',
      title: i18next.t('SettingsLk.blockedPrinters'),
      tag: 'blocked_printers',
    },
    {
      link: 'notifications',
      title: 'Уведомления',
      tag: 'notifications',
    },
    {
      link: 'license',
      title: 'Управление лицензиями',
      tag: 'license',
    },
    {
      link: 'smtp',
      title: i18next.t('SettingsLk.smtp'),
      turnedOff: true,
    },
  ],
};

export { moduleConfigs };
