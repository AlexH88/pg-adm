import i18next from "i18next";

const moduleConfigs = {
  title: i18next.t('Agents.agents'),
  link: '/agents',
  icon: 'agents',
  tag: 'print_agents',
  categories: [
    {
      link: 'hosts-network',
      title: i18next.t('Agents.hostsNetwork'),
    },
    {
      link: 'hosts-local',
      title: i18next.t('Agents.hostsLocal'),
    },
    {
      link: 'hostgroups-local',
      title: 'Группы локальных ПК',
    },
  ]
};

export { moduleConfigs };
