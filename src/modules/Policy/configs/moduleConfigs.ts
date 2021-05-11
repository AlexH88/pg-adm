import i18next from "i18next";

const moduleConfigs = {
  title: i18next.t('PolicyLk.policy'),
  link: '/policies',
  icon: 'policy',
  tag: 'print_policies',
  categories: [
    {
      title: i18next.t('PolicyLk.timePolicies'),
      link: 'time-policies'
    },
    {
      title: i18next.t('PolicyLk.backupPolicies'),
      link: 'backup-policies'
    },
    {
      title: i18next.t('PolicyLk.restrictionPolicies'),
      link: 'restriction-policies'
    },
    {
      link: 'water-marks',
      title: 'Водяные знаки',
      tag: 'water_marks',
      categories: [
        {
          title: i18next.t('PolicyLk.watermarkPolicies'),
          link: 'watermark-policies'
        },
        {
          title: i18next.t('PolicyLk.investigation'),
          link: 'investigation'
        },
      ],
    },
  ]
};

export { moduleConfigs };
