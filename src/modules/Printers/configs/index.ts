import i18next from "i18next";

const moduleConfigs = {
  title: i18next.t('PrinterLk.printers'),
  link: '/printers',
  icon: 'printers',
  tag: 'printers',
  categories: [
    {
      link: 'printers-network',
      title: i18next.t('PrinterLk.printersNetwork'),
    },
    {
      link: 'printers-local',
      title: i18next.t('PrinterLk.printersLocal'),
    },
    {
      link: 'printergroups',
      title: i18next.t('PrinterLk.printergroups'),
    },
    {
      link: 'readers',
      title: 'Считыватели',
    },
    {
      link: 'snmp-monitoring',
      title: 'SNMP Мониторинг',
    }
  ]
};

export { moduleConfigs };
