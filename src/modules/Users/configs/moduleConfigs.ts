import i18next from "i18next";

const moduleConfigs = {
  title: i18next.t('UsersLk.users'),
  link: '/home',
  icon: 'users',
  tag: 'user_management',
  categories: [
    {
      link: 'users',
      title: i18next.t('UsersLk.usersL'),
    }, {
      link: 'usergroups',
      title: i18next.t('UsersLk.usergroupsL'),
    },
/*
    {
      link: 'catalogs',
      title: 'Каталоги'
    }
*/
  ],
};

export { moduleConfigs };
