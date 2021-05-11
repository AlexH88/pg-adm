import {initReactI18next, I18nextProvider} from 'react-i18next';
import LanguageDetector from "i18next-browser-languagedetector";
import globalConfig from '../../../config'
import i18next from "i18next";
import ru from '../../../locales/ru.json';
import en from '../../../locales/en.json';

const resources = {
    en: {messages: en},
    ru: {messages: ru}
};

const i18n = i18next.use(LanguageDetector).use(initReactI18next);
i18n.init({
    react: {
        wait: true,
    },
    resources: resources,
    lng: globalConfig.locale,
    fallbackLng: 'en',
    keySeparator: '.',
    interpolation: {
        escapeValue: false,
    },
    ns: ['messages'],
    defaultNS: 'messages',
    fallbackNS: [],
});

/* tslint:disable */
const loadResourceMocks = {
  data: [
    {id: 4, login: 'testlogin4', name: '**aphanasiy', email: 'aphanasiy@gmail.com',
      card_id: 'zq!543', balance: 4, catalog_type: 'ad', groups: [1]},
    {id:11,login:'testlogin10',name:'azat',email:'azat@gmail.com',card_id:'123rty',balance:11,catalog_type:'gen', groups: [1]},
    {id:3,login:'testlogin3',name:'andrey',email:'andrey@gmail.com',card_id:'8787ququ',balance:3,catalog_type:'ad', groups: [2]},
    {id:2,login:'testlogin2',name:'anton',email:'anton@gmail.com',card_id:'676yuy',balance:2,catalog_type:'ad', groups: [2, 4]},
    {id:1,login:'testlogin1',name:'artem',email:'artem@gmail.com',card_id:'55qq77',balance:1,catalog_type:'ad', groups: [3]},
    {id:6,login:'testlogin5',name:'arseniy',email:'arseniy@gmail.com',card_id:'fw2312',balance:6,catalog_type:'gen', groups: [3]},
  ],
  aggregate: {
    total_items: 6,
  },
};

const currentOperator = {
  "data": {
    "id": 1,
    "login": "vasya",
    "email": "",
    "password_hash": "",
    "role_id": 1,
    "role_name": "admins",
    "features": {
      "snmp": true,
      "rfid": true
    },
    "access_rules": {
      'users.get': true,
      'usergroups.get': true,
      'catalogs.get': true,
      'printers.get': true,
      'printergroups.get': true,
      'snmp.get': true,
      'hosts.get': true,
      'journal.get': true,
      'policies.get': true,
      'reports.get': true,
      'actions.get': true,
      'errors.get': true,
      'roles.get': true,
      'operators.get': true,
      'users.post': true,
      'floor.post': true,
      'usergroups.post': true,
      'catalogs.post': true,
      'printers.post': true,
      'printergroups.post': true,
      'policies.rules.post': true,
      'policies.post': true,
      'roles.post': true,
      'operators.post': true,
      'report.post': true,
      'users.put': true,
      'usergroups.put': true,
      'catalogs.put': true,
      'printers.put': true,
      'printergroups.put': true,
      'policies.rules.put': true,
      'policies.put': true,
      'roles.put': true,
      'operators.put': true,
      'users.delete': true,
      'usergroups.delete': true,
      'catalogs.delete': true,
      'printers.delete': true,
      'printergroups.delete': true,
      'policies.rules.delete': true,
      'policies.delete': true,
      'roles.delete': true,
      'operators.delete': true,
      'users.membersip': true,
      'printers.membersip': true,
      'catalogs.sync': true,
      'hosts.sync': true,
      'reports.pdf' : true,
      'readers.get': true,
      'readers.post': true,
      'readers.put': true,
      'readers.delete': true
    }
  }
};

const policyMocks = {
  data: [
    { id: 1, name: 'chpok1', description: 'descr1', owner: 'login1', state: true },
    { id: 2, name: 'chpok2', description: 'descr2', owner: 'login2', state: false },
    { id: 3, name: 'chpok3', description: 'descr3', owner: 'login3', state: true },
    { id: 4, name: 'chpok4', description: 'descr4', owner: 'login4', state: false },
    { id: 5, name: 'chpok5', description: 'descr5', owner: 'login5', state: false },
    { id: 6, name: 'chpok6', description: 'descr6', owner: 'login6', state: false },
  ],
  aggregate: {
    total_items: 6,
  },
}

const loadJobsMocks = {
  data: [
    {id: 1, login: 'testlogin1', printer: 'printer1', host: 'host1', color: true, status: 'printed', catalog_name: 'ad'},
    {id: 2, login: 'testlogin2', printer: 'printer2', host: 'host2', color: false, status: 'inprocess', catalog_name: 'ad'},
    {id: 3, login: 'testlogin3', printer: 'printer3', host: 'host3', color: true, status: 'waiting', catalog_name: 'ad'},
    {id: 4, login: 'testlogin4', printer: 'printer4', host: 'host4', color: false, status: 'blocked', catalog_name: 'ad'},
  ],
  aggregate: {
    total_items: 4,
  },
}

const loadSyncData = {
  sync: ['group1', 'group2', 'group3', 'group4'],
  unsync: ['group5', 'group6', 'group7'],
};

const loadRfireadersMocks = {
  data: [
    { id: 1, uid: '1', ip: '1', status: false },
    { id: 2, uid: '2', ip: '2', status: true },
    { id: 3, uid: '3', ip: '3', status: false },
    { id: 4, uid: '4', ip: '4', status: true },
  ],
  aggregate: {
    total_items: 4,
  },
}

const loadTryDeletingItem = [
  { printer: 'NamePrinter' }
]

const loadPrintersMock = {
  data: [
    {id: 1, name: 'samsung', host: '1230', driver: 'usb', type: 'network', isFollowme: true, rfidr_uid:"123", price: '123', pageCount: 2, jobCount:2, groups: [1,2] },
    {id: 2, name: 'canon', host: '5020', driver: 'vga', type: 'network', isFollowme: false, rfidr_uid:"132", price: '123', pageCount: 3, jobCount:3, groups: [3] },
  ],
  aggregate: {
    total_items: 6,
    total_pages: 5,
    total_jobs: 4,
  },
};

const loadPrinterGroupsMock = {
  data: [
    {id: 1, name: 'samsung' },
  ],
  aggregate: {
    total_items: 6,
    total_pages: 5,
    total_jobs: 4,
  },
};

const createResourceMocks = {
  id: 4,
  login: 'testlogin4',
  name: '**aphanasiy',
  email: 'aphanasiy@gmail.com',
  card_id: 'zq!543',
  balance: 4,
  catalog_type: 'ad',
};

const loadFiltersMocks = {
  results: {
    filters: [
      { param: 'login', type: 'value_filter' },
      { param: 'name', type: 'value_filter' },
      { param: 'group', type: 'multi_filter', values: [{ id: 1, name: 'russkiy' },
      { id: 2, name: 'nerusskiy' }]},
      { param: 'catalog', type: 'multi_filter', values: [{ id: 1, name: 'catalog1' },
      { id: 2, name: 'catalog2' }, { id: 3, name: 'catalog3' }] },
    ],
  },
};

const policyFilters = {
  results: {
    filters: [
      { param: 'name', type: 'value_filter' },
    ]
  }
}

const rulesMocks = {
  data: [
    {
      id: 1,
      policy_id: 1,
      seq: 0,
      usergroups: [
        { id: 1, name: 'usergroup1' },
        { id: 2, name: 'usergroup2' },
      ],
      printergroups: [
        { id: 1, name: 'printersGroup1' },
        { id: 2, name: 'printersGroup2' },
      ],
      hours: '011111110000011000001111',
      days: '0110100',
      action: 'block',
      alert: true,
      counter: 15,
    },
    {
      id: 2,
      policy_id: 1,
      usergroups: [
        { id: 3, name: 'usergroup3' },
        { id: 4, name: 'usergroup4' },
      ],
      printergroups: [
        { id: 3, name: 'printersGroup3' },
        { id: 4, name: 'printersGroup4' },
      ],
      hours: '011100000000000000000000',
      days: '0110110',
      action: 'permit',
      alert: false,
      counter: 11,
      seq: 0,
    },
    {
      id: 3,
      policy_id: 1,
      usergroups: [
        { id: 5, name: 'usergroup5' },
        { id: 6, name: 'usergroup6' },
      ],
      printergroups: [
        { id: 5, name: 'printersGroup5' },
        { id: 6, name: 'printersGroup6' },
      ],
      hours: '011100000000000000000000',
      days: '0100110',
      action: 'addSign',
      alert: false,
      counter: 1,
      seq: 0,
    },
    {
      "id": 4,
      "policy_id": 1,
      "seq": 1,
      "usergroups": [
        {
          "id": 1,
          "name": "group 1"
        }
      ],
      "printergroups": [],
      "hours": "000111000000000000000000",
      "days": "1000000",
      "action": "force_duplex",
      "alert": false,
      "counter": 0
    },
    {
      id: 5,
      policy_id: 1,
      usergroups: [
        { id: 5, name: 'usergroup5' },
        { id: 6, name: 'usergroup6' },
      ],
      printergroups: [
        { id: 5, name: 'printersGroup5' },
        { id: 6, name: 'printersGroup6' },
      ],
      hours: '011100000000000000000000',
      days: '0100110',
      action: 'permit',
      alert: false,
      counter: 1,
      seq: 0,
    }

  ],
  aggregate: {
    total_items: 6,
  },
}

const groupsMocks = {
  data: [
    {id: 1, name: 'group1'},
    {id: 2, name: 'group2'},
    {id: 3, name: 'group3'},
    {id: 4, name: 'group4'},
    {id: 5, name: 'group5'},
    {id: 6, name: 'group6'},
  ]
}

const loadJobsFiltersMock = {
  filters: [
    {param: "login", type: "value_filter"},
    {param: "printer", type: "value_filter"},
    {param: "title", type: "value_filter"},
    {param: "output_time", type: "calendar"},
    {param: "usergroup", type: "multi_filter", values: [{ id: 1, name: 'russkiy' },
    { id: 2, name: 'nerusskiy' }]},
    {param: "printergroup", type: "multi_filter", values: [{ id: 1, name: 'russkiy' },
    { id: 2, name: 'nerusskiy' }]},
    {param: "catalogs", type: "multi_filter", values: [{ id: 1, name: 'russkiy' },
    { id: 2, name: 'nerusskiy' }]},
    {param: "status", type: "multi_filter", values: [{ id: 1, name: 'russkiy' },
    { id: 2, name: 'nerusskiy' }]},
  ],
}

const loadPrintersFiltersMocks = {
  // results: {
  //   filters: [
  //     { param: 'name', type: 'value_filter' },
  //     { param: 'connection', type: 'value_filter' },
  //     { param: 'host', type: 'multi_filter', values: [{ id: 1, name: 'russkiy' }, { id: 2, name: 'nerusskiy' }]},
  //     { param: 'type', type: 'multi_filter', values: [{ id: 1, name: 'catalog1' }, { id: 2, name: 'catalog2' }, { id: 3, name: 'catalog3' }] },
  //   ],
  // },
  results: {
    filters: [
      {param: "uid", type: "value_filter"},
    ]
  }
};

const loadUsersGroupMocks = [
  { id: 1, name: 'russkiy' },
  { id: 2, name: 'nerusskiy' },
  { id: 3, name: 'users' },
  { id: 4, name: 'admin' },
];

const filterResourceConfigMocks = {
  headers: [
    { title: i18next.t('mocks.filterResourceConfigMocks.name'), value: 'name', isSortable: true, isConnected: true },
    { title: i18next.t('mocks.filterResourceConfigMocks.initialCredit'), value: 'initialCredit', isSortable: true },
    { title: i18next.t('mocks.filterResourceConfigMocks.initialRestricted'), value: 'initialRestricted', isSortable: true },
    { title: i18next.t('mocks.filterResourceConfigMocks.amount'), value: 'amount', isSortable: true },
    { title: i18next.t('mocks.filterResourceConfigMocks.period'), value: 'period', isSortable: true },
    { title: i18next.t('mocks.filterResourceConfigMocks.type'), value: 'type', isSortable: true },
  ],
};

const aggregateStats = [
  {
    value: 'totalItems',
    title: `${i18next.t('mocks.aggregateStats.totalItems')}`
  },
  {
    value: 'totalPages',
    title: `${i18next.t('mocks.aggregateStats.totalPages')}`
  },
  {
    value: 'totalJobs',
    title: `${i18next.t('mocks.aggregateStats.totalJobs')}`
  },
];

const configsDescription = {
  users: {
    params: [
      {name: "login", type: "string", view: i18next.t('mocks.configsDescription.login'), sort: true, use: true, required: true },
      {name: "name", type: "string", view: i18next.t('mocks.configsDescription.name'), sort: false, use: true },
      {name: "email", type: "string", view: i18next.t('mocks.configsDescription.email'), sort: false, use: true},
      {name: "balance", type: "amount", view: i18next.t('mocks.configsDescription.balance'), sort: true, use: true},
      {name: "pageCount", type: "integer", view: i18next.t('mocks.configsDescription.pageCount'), sort: true, use: true},
      {name: "jobCount", type: "integer", view: i18next.t('mocks.configsDescription.jobCount'), sort: true, use: true},
    ],
    permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} ],
    filters: [
      {name: "login", view: i18next.t('mocks.configsDescription.filters.login'), type: "autocompleteFilter"},
      {name: "name", view: i18next.t('mocks.configsDescription.filters.name'), type: "autocompleteFilter"},
      {name: "usergroups", view: i18next.t('mocks.configsDescription.filters.usergroups'), type: "multiFilter"},
      {name: "catalogs", view: i18next.t('mocks.configsDescription.filters.catalogs'), type: "multiFilter"},
    ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.aggregates.totalItems')
      },
      {
        name: 'totalPages',
        view: i18next.t('mocks.configsDescription.aggregates.totalPages')
      },
    ],
  },

  usergroups: {
    params: [
      {name: "name", type: "string", view: "Наименование", sort: true, use: true, required: true },
      {name: "initialCredit", type: "amount", view: "Первоначальный взнос", sort: true, use: true},
      {name: "initialRestricted", type: "boolean", view: "Отрицательный баланс", sort: true, use: true},
      {name: "amount", type: "amount", view: "Размер начисления", sort: true, use: true},
      {name: "period", type: "string", view: "Период", sort: true, use: true},
      {name: "type", type: "boolean", view: "Тип начисления", sort: true, use: true},
      {name: "ldapSource", type: "string", view: "Тип группы", sort: true, use: true},
    ],
    permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} ],
    filters: [
      {name: "name", view: i18next.t('mocks.configsDescription.usergroups.filters.name'), type: "autocompleteFilter"},
      {name: "catalog", view: i18next.t('mocks.configsDescription.usergroups.filters.catalog'), type: "multiFilter"},
    ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.usergroups.aggregates.totalItems')
      },
      {
        name: 'totalPages',
        view: i18next.t('mocks.configsDescription.usergroups.aggregates.totalPages')
      },
    ],
  },

  catalogs: {
    params: [
      { view: i18next.t('mocks.configsDescription.catalogsUpd.params.catalog'), name: 'name', use: true, required: true },
      { view: i18next.t('mocks.configsDescription.catalogsUpd.params.user'), name: 'username', use: true },
      { view: i18next.t('mocks.configsDescription.catalogsUpd.params.host'), name: 'ldapHost', use: true },
      { view: i18next.t('mocks.configsDescription.catalogsUpd.params.port'), name: 'ldapPort', use: true },
      { view: i18next.t('mocks.configsDescription.catalogsUpd.params.baseDn'), name: 'baseDn' },
      { view: i18next.t('mocks.configsDescription.catalogsUpd.params.loginAttr'), name: 'loginAttr' },
      { view: i18next.t('mocks.configsDescription.catalogsUpd.params.emailAttr'), name: 'emailAttr' },
      { view: i18next.t('mocks.configsDescription.catalogsUpd.params.prefix'), name: 'prefix' },
      { view: i18next.t('mocks.configsDescription.catalogsUpd.params.status'), name: 'enabled', use: true }
    ],
    permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} ],
    filters: [
      // {name: "type", view: "По Типу", type: "value_filter"},
    ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.catalogsUpd.aggregates.totalItems')
      },
    ]
  },

  'snmp-monitoring': {
    params: [],
    permissions: [
      //  {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} 
      ],
    filters: [
      // {name: "type", view: "По Типу", type: "value_filter"},
    ],
    aggregates: [
      // {
      //   name: 'totalFloor',
      //   view: 'Итого этажей'
      // },
      // {
      //   name: 'totalPrinters',
      //   view: 'Итого принтеров'
      // },
    ]
  },

  time_policy: {
    params: [
      { view: i18next.t('mocks.configsDescription.timePolicy.params.actively'), name: 'state', sort: true, use: true, required: true },
      { view: i18next.t('mocks.configsDescription.timePolicy.params.name'), name: 'name', sort: false, use: true, required: true },
      { view: i18next.t('mocks.configsDescription.timePolicy.params.description'), name: 'description', sort: false, use: false },
      { view: i18next.t('mocks.configsDescription.timePolicy.params.owner'), name: 'operator', sort: true, use: false },
      { view: i18next.t('mocks.configsDescription.timePolicy.params.userGroups'), name: 'userGroups', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.timePolicy.params.printerGroups'), name: 'printerGroups', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.timePolicy.params.hours'), name: 'hours', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.timePolicy.params.days'), name: 'days', sort: false, use: true },
      //{ view: 'Действие', name: 'action', sort: false, use: false },
      //{ view: 'Оповещение', name: 'alert', sort: false, use: false }
    ],
    filters: [
      {name: "name", view: i18next.t('mocks.configsDescription.timePolicy.filters.name'), type: "autocompleteFilter", use: false},
    ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.timePolicy.aggregates.totalItems')
      },
    ]
  },

  policies: {
    params: [
      { view: i18next.t('mocks.configsDescription.policies.params.state'), name: 'state', sort: true, use: true },
      { view: i18next.t('mocks.configsDescription.policies.params.name'), name: 'name', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.policies.params.description'), name: 'description', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.policies.params.owner'), name: 'owner', sort: true, use: true }
    ],
    filters: [
      {name: "name", view: "Имя", type: "value_filter", use: false},
    ],
    aggregates: [
      {
        name: 'totalItems',
        view: 'Итого записей'
      },
    ]
  },

  agent_policies: {
    params: [
      { view: i18next.t('mocks.configsDescription.agentPolicies.params.state'), name: 'state', sort: true, use: true },
      { view: i18next.t('mocks.configsDescription.agentPolicies.params.name'), name: 'name', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.agentPolicies.params.days'), name: 'days', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.agentPolicies.params.hours'), name: 'hours', sort: true, use: true },
      { view: i18next.t('mocks.configsDescription.agentPolicies.params.hostgroups'), name: 'hostgroups', sort: true, use: true },
      { view: i18next.t('mocks.configsDescription.agentPolicies.params.actions'), name: 'value', sort: false, use: true },
      // { view: '', name: 'state', sort: true, use: true },
    ],
    filters: [
      {name: "name", view: i18next.t('mocks.configsDescription.agentPolicies.filters.name'), type: "value_filter", use: false},
    ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.agentPolicies.aggregates.totalItems')
      },
    ]
  },

  backup_policy: {
    params: [
      { view: i18next.t('mocks.configsDescription.backupPolicy.params.state'), name: 'state', sort: false, use: true, required: true },
      { view: i18next.t('mocks.configsDescription.backupPolicy.params.name'), name: 'name', sort: false, use: true, required: true },
      { view: i18next.t('mocks.configsDescription.backupPolicy.params.owner'), name: 'operator', sort: false, use: false },
      { view: i18next.t('mocks.configsDescription.backupPolicy.params.userGroups'), name: 'userGroups', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.backupPolicy.params.printerGroups'), name: 'printerGroups', sort: false, use: true },
    ],
    filters: [
      {name: "name", view: i18next.t('mocks.configsDescription.backupPolicy.filters.name'), type: "autocompleteFilter", use: false},
    ],
    aggregates: [
      {
        name: 'totalItems',
        view: 'Итого записей'
      },
    ]
  },

  restriction_policy: {
    params: [
      { view: i18next.t('mocks.configsDescription.restrictionPolicy.params.state'), name: 'state', sort: false, use: true, required: true },
      { view: i18next.t('mocks.configsDescription.restrictionPolicy.params.name'), name: 'name', sort: false, use: true, required: true },
      { view: i18next.t('mocks.configsDescription.restrictionPolicy.params.owner'), name: 'operator', sort: false, use: false },
      { view: i18next.t('mocks.configsDescription.restrictionPolicy.params.userGroups'), name: 'userGroups', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.restrictionPolicy.params.printerGroups'), name: 'printerGroups', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.restrictionPolicy.params.color'), name: 'color', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.restrictionPolicy.params.duplex'), name: 'duplex', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.restrictionPolicy.params.documentFormatSet'), name: "documentFormatSet", sort: false, use: true }
      //{ view: 'Режим экономии', name: 'economical', sort: false, use: true },
    ],
    filters: [
      {name: "name", view: i18next.t('mocks.configsDescription.restrictionPolicy.filters.name'), type: "autocompleteFilter", use: false},
    ],
    aggregates: [
      {
        name: 'totalItems',
        view: 'Итого записей'
      },
    ]
  },

  watermark_policy: {
    params: [
      { view: i18next.t('mocks.configsDescription.watermarkPolicy.params.state'), name: 'state', sort: false, use: true, required: true },
      { view: i18next.t('mocks.configsDescription.watermarkPolicy.params.name'), name: 'name', sort: false, use: true, required: true },
      { view: i18next.t('mocks.configsDescription.watermarkPolicy.params.owner'), name: 'operator', sort: false, use: false },
      { view: i18next.t('mocks.configsDescription.watermarkPolicy.params.userGroups'), name: 'userGroups', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.watermarkPolicy.params.printerGroups'), name: 'printerGroups', sort: false, use: true },
    ],
    filters: [
      {name: "name", view: i18next.t("mocks.configsDescription.watermarkPolicy.filters.name"), type: "autocompleteFilter", use: false},
    ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.watermarkPolicy.aggregates.totalItems')
      },
    ]
  },

  rules: {
    params: [
      { view: i18next.t('mocks.configsDescription.rules.params.usergroups'), name: 'usergroups', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.rules.params.printergroups'), name: 'printergroups', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.rules.params.hours'), name: 'hours', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.rules.params.days'), name: 'days', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.rules.params.action'), name: 'action', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.rules.params.alert'), name: 'alert', sort: false, use: true },
      // { view: '', name: 'counter', sort: false, use: true }, Временно не выводим
    ],
  },

  label_policies: {
    params: [
      { view: i18next.t('mocks.configsDescription.labelPolicies.params.actively'), name: 'state', sort: false, use: true, required: true },
      { view: i18next.t('mocks.configsDescription.labelPolicies.params.name'), name: 'name', sort: false, use: true, required: true },
      { view: i18next.t('mocks.configsDescription.labelPolicies.params.owner'), name: 'owner', sort: true, use: true },
      { view: i18next.t('mocks.configsDescription.labelPolicies.params.usergroups'), name: 'usergroups', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.labelPolicies.params.printergroups'), name: 'printergroups', sort: false, use: true },
    ],
    filters: [
      {name: "name", view: i18next.t('mocks.configsDescription.labelPolicies.filters.name'), type: "value_filter", use: false},
    ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.labelPolicies.aggregates.totalItems')
      },
      {
        name: 'totalPages',
        view: i18next.t('mocks.configsDescription.labelPolicies.aggregates.totalPages')
      },
      /*
      {
        name: 'totalJobs',
        view: 'Итого заданий'
      },
      */
    ]
  },


  text_labels: {
    params: [
      { view: i18next.t('mocks.configsDescription.textLabels.params.name'), name: 'name', sort: false, use: true, required: true },
      { view: i18next.t('mocks.configsDescription.textLabels.params.tag'), name: 'data', sort: false, use: true, required: true },
      { view: i18next.t('mocks.configsDescription.textLabels.params.encrypted'), name: 'encrypted', sort: false, use: true, required: true },
    ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.textLabels.aggregates.totalItems')
      },
      {
        name: 'totalPages',
        view: i18next.t('mocks.configsDescription.textLabels.aggregates.totalPages')
      },
      /*
      {
        name: 'totalJobs',
        view: 'Итого заданий'
      },
      */
    ]
  },

  jobs: {
    params: [
      {name: "login", type: "string", view: i18next.t('mocks.configsDescription.jobs.params.login'), sort: true, use: true, required: true},
      {name: "id", type: "int", view: "ID", sort: true, use: false, required: false},
      {name: "catalogName", type: "amount", view: i18next.t('mocks.configsDescription.jobs.params.catalogName'), sort: false, use: false},
      {name: "printer", type: "amount", view: i18next.t('mocks.configsDescription.jobs.params.printer'), sort: true, use: true},
      {name: "host", type: "string", view: i18next.t('mocks.configsDescription.jobs.params.host'), sort: false, use: false},
      {name: "title", type: "string", view: i18next.t('mocks.configsDescription.jobs.params.namefile'), sort: false, use: true},
      {name: "price", type: "amount", view: i18next.t('mocks.configsDescription.jobs.params.price'), sort: false, use: false},
      {name: "spoolSize", type: "int", view: i18next.t('mocks.configsDescription.jobs.params.spoolSize'), sort: false, use: false},
      {name: "pagesPrinted", type: "int", view: i18next.t('mocks.configsDescription.jobs.params.pages'), sort: false, use: false},
      // Disabled on backend atm
      // {name: "queue_pages", type: "int", view: "Страниц в очереди", sort: false, use: false},
      // {name: "ok_pages", type: "int", view: "Распечатанные страницы", sort: false, use: false},      
      // {name: "error_pages", type: "int", view: "Страницы с ошибкой", sort: false, use: false},
      {name: "copies", type: "int", view: i18next.t('mocks.configsDescription.jobs.params.copies'), sort: false, use: false},
      {name: "inputTime", type: "time", view: i18next.t('mocks.configsDescription.jobs.params.inputTime'), sort: true, use: false},
      {name: "outputTime", type: "time", view: i18next.t('mocks.configsDescription.jobs.params.outputTime'), sort: true, use: false},
      {name: "color", type: "boolean", view: i18next.t('mocks.configsDescription.jobs.params.typeprint'), sort: false, use: false},
      {name: "format", type: "string", view: i18next.t('mocks.configsDescription.jobs.params.format'), sort: false, use: false},
      {name: "duplex", type: "boolean", view: i18next.t('mocks.configsDescription.jobs.params.duplex'), sort: false, use: false},
      {name: "status", type: "string", view: i18next.t('mocks.configsDescription.jobs.params.status'), sort: false, use: true, required: true},
      {name: "details", type: "string", view: 'Детали', sort: false, use: true, required: true},
    ],
    permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} ],
    filters: [
      {name: "login", view: i18next.t('mocks.configsDescription.jobs.filters.login'), type: "autocompleteFilter"},
      {name: "printer", view: i18next.t('mocks.configsDescription.jobs.filters.printer'), type: "autocompleteFilter"},
      {name: "title", view: i18next.t('mocks.configsDescription.jobs.filters.filename'), type: "autocompleteFilter"},
      //{name: "outputTime", view: "По времени печати", type: "calendar"}, // Not ready
      {name: "usergroups", view: i18next.t('mocks.configsDescription.jobs.filters.usergroups'), type: "multiFilter"},
      {name: "printergroups", view: i18next.t('mocks.configsDescription.jobs.filters.printergroups'), type: "multiFilter"},
      {name: "catalogs", view: i18next.t('mocks.configsDescription.jobs.filters.catalogs'), type: "multiFilter"},
      {name: "status", view: i18next.t('mocks.configsDescription.jobs.filters.status'), type: "selectFilter", values: [
        {id: 0, name: 'DENY_BALANCE', label: i18next.t('mocks.configsDescription.jobs.filters.danyBalance') },
        {id: 1, name: 'DENY_TIME_POLICY', label: i18next.t('mocks.configsDescription.jobs.filters.danyTimePolicy') },
        {id: 1, name: 'DENY_RESTRICTION_POLICY', label: i18next.t('mocks.configsDescription.jobs.filters.danyRestrictionPolicy') },
        {id: 2, name: 'PRINTED', label: i18next.t('mocks.configsDescription.jobs.filters.printed') },
        {id: 3, name: 'FILE_UPLOAD', label: i18next.t('mocks.configsDescription.jobs.filters.fileUpload') },
        {id: 4, name: 'INIT', label: i18next.t('mocks.configsDescription.jobs.filters.init') },
        {id: 5, name: 'ERROR', label: i18next.t('mocks.configsDescription.jobs.filters.error') },
        {id: 6, name: 'QUEUE', label: i18next.t('mocks.configsDescription.jobs.filters.queue') },
        //{id: 7, name: 'PRINT_DATA', label: 'new - PRINT_DATA' },
        //{id: 8, name: 'FORCE_PRINT', label: 'new - FORCE_PRINT' },
        //{id: 9, name: 'FILE_DOWNLOAD', label: 'new - FILE_DOWNLOAD' }
      ]},
      {name: "color", view: i18next.t('mocks.configsDescription.jobs.filters.colorprint'), type: "selectFilter", values: [
        {id: 0, name: 'true', label: i18next.t('mocks.configsDescription.jobs.filters.Yes') },
        {id: 1, name: 'false', label: i18next.t('mocks.configsDescription.jobs.filters.Not') }
      ]},
      {name: "duplex", view: i18next.t('mocks.configsDescription.jobs.filters.duplex'), type: "selectFilter", values: [
        {id: 0, name: 'true', label: i18next.t('mocks.configsDescription.jobs.filters.Yes') },
        {id: 1, name: 'false', label: i18next.t('mocks.configsDescription.jobs.filters.Not') }
      ]},
      {name: "format", view: i18next.t('mocks.configsDescription.jobs.filters.format'), type: "selectFilter", values: [
        {id: 0, name: 'a3', label: 'A3' },
        {id: 1, name: 'a4', label: 'A4' },
        {id: 2, name: 'a5', label: 'A5' }
      ]},
    ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.jobs.aggregates.totalItems')
      },
      {
        name: 'totalPages',
        view: i18next.t('mocks.configsDescription.jobs.aggregates.totalPages')
      }
    ]
  },

  'printers-network': {
    params: [
      { view: i18next.t('mocks.configsDescription.printersNetwork.params.name'), name: 'name', sort: true, use: true, required: true },
      { view: i18next.t('mocks.configsDescription.printersNetwork.params.driver'), name: 'driver', sort: true, use: true },
//      { view: i18next.t('mocks.configsDescription.printersNetwork.params.mac'), name: 'mac', sort: true, use: false },
      { view: 'IP-адрес', name: 'printerIp', sort: true, use: false },
      // { view: 'Тип', name: 'type', sort: true, use: false },
      { view: i18next.t('mocks.configsDescription.printersNetwork.params.price'), name: 'price', sort: true, use: true },
      { view: i18next.t('mocks.configsDescription.printersNetwork.params.a3Price'), name: 'a3Price', sort: true, use: true },
      { view: i18next.t('mocks.configsDescription.printersNetwork.params.a4Price'), name: 'a4Price', sort: true, use: true },
      { view: i18next.t('mocks.configsDescription.printersNetwork.params.a5Price'), name: 'a5Price', sort: true, use: true },
      { view: i18next.t('mocks.configsDescription.printersNetwork.params.colorCoeff'), name: 'colorCoeff', sort: true, use: false },
      { view: i18next.t('mocks.configsDescription.printersNetwork.params.duplexCoeff'), name: 'duplexCoeff', sort: true, use: false },
      // { view: 'Печать по карте', name: 'is_followme', sort: true, use: false }, // Двухфакторная аутентификация
      // { view: 'Идентификатор считывателя', name: 'rfidr_uid', sort: true, use: false },
      { view: i18next.t('mocks.configsDescription.printersNetwork.params.pageCount'), name: 'pageCount', sort: true, use: false },
      { view: i18next.t('mocks.configsDescription.printersNetwork.params.jobCount'), name: 'jobCount', sort: true, use: false }
    ],
    permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} ],
    filters: [
      {name: "name", view: i18next.t('mocks.configsDescription.printersNetwork.filters.name'), type: "autocompleteFilter"},
      {name: "driver", view: i18next.t('mocks.configsDescription.printersNetwork.filters.driver'), type: "autocompleteFilter"},
      
      // {name: "rfidr_uid", view: "По идентификатору", type: "value_filter"},
      {name: "printergroups", view: i18next.t('mocks.configsDescription.printersNetwork.filters.printergroups'), type: "multiFilter"},
      {name: "host", view: i18next.t('mocks.configsDescription.printersNetwork.filters.host'), type: "autocompleteFilter"},
      // {name: "type", view: "По Типу", type: "multi_filter"},

    ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.printersNetwork.aggregates.totalItems')
      },
      {
        name: 'totalPages',
        view: i18next.t('mocks.configsDescription.printersNetwork.aggregates.totalPages')
      },
      /*
      {
        name: 'totalJobs',
        view: 'Итого заданий'
      }
      */
    ]
  },

  'printers-local': {
    params: [
      { view: i18next.t('mocks.configsDescription.printersLocal.params.name'), name: 'name', sort: true, use: true, required: true },
      { view: i18next.t('mocks.configsDescription.printersLocal.params.driver'), name: 'driver', sort: true, use: true },
      { view: i18next.t('mocks.configsDescription.printersLocal.params.mac'), name: 'mac', sort: true, use: true },
      // { view: 'Тип', name: 'type', sort: true, use: false },
      { view: i18next.t('mocks.configsDescription.printersLocal.params.price'), name: 'price', sort: true, use: true },
      { view: i18next.t('mocks.configsDescription.printersLocal.params.a3Price'), name: 'a3Price', sort: true, use: false },
      { view: i18next.t('mocks.configsDescription.printersLocal.params.a4Price'), name: 'a4Price', sort: true, use: false },
      { view: i18next.t('mocks.configsDescription.printersLocal.params.a5Price'), name: 'a5Price', sort: true, use: false },
      { view: i18next.t('mocks.configsDescription.printersLocal.params.colorCoeff'), name: 'colorCoeff', sort: true, use: false },
      { view: i18next.t('mocks.configsDescription.printersLocal.params.duplexCoeff'), name: 'duplexCoeff', sort: true, use: false },
      // { view: 'Печать по карте', name: 'is_followme', sort: true, use: false }, // Двухфакторная аутентификация
      // { view: 'Идентификатор считывателя', name: 'rfidr_uid', sort: true, use: false },
      // { view: 'Страниц', name: 'page_count', sort: true, use: false },
      // { view: 'Заданий', name: 'job_count', sort: true, use: false },

    ],
    permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} ],
    filters: [
      {name: "name", view: i18next.t('mocks.configsDescription.printersLocal.filters.name'), type: "autocompleteFilter"},
      {name: "driver", view: i18next.t('mocks.configsDescription.printersLocal.filters.driver'), type: "autocompleteFilter"},
      // {name: "rfidr_uid", view: "По идентификатору", type: "value_filter"},
      {name: "printergroups", view: i18next.t('mocks.configsDescription.printersLocal.filters.printergroups'), type: "multiFilter"},
      {name: "mac", view: i18next.t('mocks.configsDescription.printersLocal.filters.mac'), type: "multiFilter"},
      // {name: "type", view: "По Типу", type: "multi_filter"},

    ],
    aggregates: [
      {
        name: 'totalItems',
        view: 'Итого записей'
      },
      {
        name: 'totalPages',
        view: 'Итого страниц'
      },
      /*
      {
        name: 'totalJobs',
        view: 'Итого заданий'
      }
      */
    ]
  },

  'hosts-network': {
    params: [
      { view: i18next.t('mocks.configsDescription.hostsNetwork.params.name'), name: 'name', sort: true, use: true },
      { view: 'IP', name: 'ip', sort: false, use: true }
    ],
    permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} ],
    filters: [
      {name: "name", view: i18next.t('mocks.configsDescription.hostsNetwork.filters.name'), type: "autocompleteFilter"},
      {name: "ip", view: i18next.t('mocks.configsDescription.hostsNetwork.filters.ip'), type: "autocompleteFilter"},
      // {name: "hostgroups", view: "По группам", type: "multiFilter"},
      // {name: "version", view: "По версиям", type: "autocompleteFilter"},
    ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.hostsNetwork.aggregates.totalItems')
      }
    ]
  },


  'agentlogs': {
    params: [
      { view: 'Агент печати', name: 'host', sort: true, use: true, required: false },
      { view: 'Дата', name: 'date', sort: true, use: true },
      { view: 'Уровень логгирования', name: 'level', sort: false, use: true },
      { view: 'Событие', name: 'description', sort: false, use: true },
    ],
    permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} ],
    // filters: [
    //   {name: "name", view: "По имени хоста", type: "autocompleteFilter"},
    //   {name: "ip", view: "По IP", type: "autocompleteFilter"},
    //   // {name: "hostgroups", view: "По группам", type: "multiFilter"},
    //   // {name: "version", view: "По версиям", type: "autocompleteFilter"},
    // ],
    aggregates: [
      {
        name: 'totalItems',
        view: 'Итого записей'
      }
    ]
  },

  'userlogs': {
    params: [
      { view: 'Дата', name: 'date', sort: true, use: true },
      { view: 'Администратор', name: 'adminName', sort: false, use: true },
      { view: 'Пользователь', name: 'userLogin', sort: false, use: true },
      { view: 'Тип', name: 'changeType', sort: false, use: true },
      { view: 'Описание', name: 'description', sort: false, use: true },
    ],
    permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} ],
    // filters: [
    //   {name: "name", view: "По имени хоста", type: "autocompleteFilter"},
    //   {name: "ip", view: "По IP", type: "autocompleteFilter"},
    //   // {name: "hostgroups", view: "По группам", type: "multiFilter"},
    //   // {name: "version", view: "По версиям", type: "autocompleteFilter"},
    // ],
    aggregates: [
      {
        name: 'totalItems',
        view: 'Итого записей'
      }
    ]
  },

  'hosts-local': {
    params: [
      { view: i18next.t('mocks.configsDescription.hostsLocal.params.name'), name: 'name', sort: true, use: true },
      { view: i18next.t('mocks.configsDescription.hostsLocal.params.mac'), name: 'mac', sort: false, use: true },
      { view: 'IP', name: 'ip', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.hostsLocal.params.groups'), name: 'groups', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.hostsLocal.params.version'), name: 'version', sort: false, use: true }
    ],
    permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} ],
    filters: [
      {name: "name", view: i18next.t('mocks.configsDescription.hostsLocal.filters.name'), type: "autocompleteFilter"},
      {name: "ip", view: i18next.t('mocks.configsDescription.hostsLocal.filters.ip'), type: "autocompleteFilter"},
      {name: "hostgroups", view: i18next.t('mocks.configsDescription.hostsLocal.filters.hostgroups'), type: "multiFilter"},
      {name: "version", view: i18next.t('mocks.configsDescription.hostsLocal.filters.version'), type: "autocompleteFilter"},
      {name: "active", view: i18next.t('mocks.configsDescription.hostsLocal.filters.active'), type: "selectFilter", values: [
        {id: 0, name: 'true', label: i18next.t('mocks.configsDescription.hostsLocal.filters.act') },
        {id: 1, name: 'false', label: i18next.t('mocks.configsDescription.hostsLocal.filters.noact') }
      ]},
    ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.hostsLocal.aggregates.totalItems')
      }
    ]
  },

  user_reports: {
    params: [
      { view: 'Дата', name: 'date', sort: true, use: true },
      { view: 'Администратор', name: 'adminName', sort: true, use: true, required: true },
      { view: 'Тип', name: 'eventType', sort: false, use: true },
      { view: 'Описание', name: 'description', sort: false, use: true },
    ],
    // permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} ],
    // filters: [
    //   {name: "printer", view: "По имени принтера", type: "multi_filter"},
    //   {name: "usergroup", view: "По группе пользователей", type: "multi_filter"},
    //   {name: "printergroup", view: "По группе принтеров", type: "multi_filter"},
    //   {name: "output_time", view: "По времени печати", type: "calendar"},
    //   {name: "type", view: "Параметр", type: "multi_filter"}
    // ],
    aggregates: [],
  },

  // user_reports: {
  //   params: [
  //     { view: 'Пользователь', name: 'login', sort: true, use: true, required: true },
  //     { view: 'Общая стоимость', name: 'price', sort: false, use: true },
  //     { view: 'Количество заданий', name: 'jobs', sort: false, use: true },
  //     { view: 'Количество страниц', name: 'pages', sort: false, use: true },
  //   ],
  //   permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} ],
  //   filters: [
  //     {name: "printer", view: "По имени принтера", type: "multi_filter"},
  //     {name: "usergroup", view: "По группе пользователей", type: "multi_filter"},
  //     {name: "printergroup", view: "По группе принтеров", type: "multi_filter"},
  //     {name: "output_time", view: "По времени печати", type: "calendar"},
  //     // {name: "type", view: "Параметр", type: "multi_filter"}
  //   ],
  //   aggregates: [],
  // },

  user_timereports: {
    filters: [
      {name: "interval", view: i18next.t('mocks.configsDescription.userTimereports.filters.interval'), type: "calendar"},
      {name: "step", view: i18next.t('mocks.configsDescription.userTimereports.filters.step'), type: "value_filter"},
      {name: "type", view: i18next.t('mocks.configsDescription.userTimereports.filters.type'), type: "multi_filter", values: [
        {id: 'price', name: i18next.t('mocks.configsDescription.userTimereports.filters.price')},
        {id: 'jobs', name: i18next.t('mocks.configsDescription.userTimereports.filters.jobs')},
        {id: 'pages', name: i18next.t('mocks.configsDescription.userTimereports.filters.pages')},
      ]},
      {name: "value", view: i18next.t('mocks.configsDescription.userTimereports.filters.select'), type: "multi_filter", values: [
        {id: 'petya', name: i18next.t('mocks.configsDescription.userTimereports.filters.name1')},
        {id: 'vasya', name: i18next.t('mocks.configsDescription.userTimereports.filters.name2')},
      ]},
      {name: "output_time", view: i18next.t('mocks.configsDescription.userTimereports.filters.outputTime'), type: "calendar"},

      // {name: "type", view: "Параметр", type: "multi_filter"}
    ],
  },

  user_groups_reports: {
    params: [
      { view: i18next.t('mocks.configsDescription.userGroupsReports.params.groupName'), name: 'group_name', sort: true, use: true, required: true },
      { view: i18next.t('mocks.configsDescription.userGroupsReports.params.price'), name: 'price', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.userGroupsReports.params.jobs'), name: 'jobs', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.userGroupsReports.params.pages'), name: 'pages', sort: false, use: true },
    ],
    permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} ],
    filters: [
      {name: "printer", view: i18next.t('mocks.configsDescription.userGroupsReports.filters.printer'), type: "multi_filter"},
      {name: "printergroup", view: i18next.t('mocks.configsDescription.userGroupsReports.filters.printergroup'), type: "multi_filter"},
      {name: "output_time", view: "По времени печати", type: "calendar"},
      // {name: "type", view: "Параметр", type: "multi_filter"}
    ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.userGroupsReports.filters.totalItems')
      }
    ]
  },

  printer_reports: {
    params: [
      { view: i18next.t('mocks.configsDescription.printerReports.params.printer'), name: 'printer', sort: true, use: true, required: true },
      { view: i18next.t('mocks.configsDescription.printerReports.params.price'), name: 'price', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.printerReports.params.jobs'), name: 'jobs', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.printerReports.params.pages'), name: 'pages', sort: false, use: true },
    ],
    permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} ],
    filters: [
      {name: "user", view: i18next.t('mocks.configsDescription.printerReports.filters.user'), type: "multi_filter"},
      {name: "usergroup", view: i18next.t('mocks.configsDescription.printerReports.filters.usergroup'), type: "multi_filter"},
      {name: "printergroup", view: i18next.t('mocks.configsDescription.printerReports.filters.printergroup'), type: "multi_filter"},
      {name: "output_time", view: i18next.t('mocks.configsDescription.printerReports.filters.outputTime'), type: "calendar"},
      // {name: "type", view: "Параметр", type: "multi_filter"}
    ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.printerReports.aggregates.totalItems')
      }
    ]
  },

  printer_groups_reports: {
    params: [
      { view: i18next.t('mocks.configsDescription.printerGroupsReports.params.groupName'), name: 'group_name', sort: true, use: true, required: true },
      { view: i18next.t('mocks.configsDescription.printerGroupsReports.params.price'), name: 'price', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.printerGroupsReports.params.jobs'), name: 'jobs', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.printerGroupsReports.params.pages'), name: 'pages', sort: false, use: true },
    ],
    permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} ],
    filters: [
      {name: "user", view: i18next.t('mocks.configsDescription.printerGroupsReports.filters.user'), type: "multi_filter"},
      {name: "usergroup", view: i18next.t('mocks.configsDescription.printerGroupsReports.filters.usergroup'), type: "multi_filter"},
      {name: "output_time", view: i18next.t('mocks.configsDescription.printerGroupsReports.filters.outputTime'), type: "calendar"},
      // {name: "type", view: "Параметр", type: "multi_filter"}

    ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.printerGroupsReports.aggregates.totalItems')
      }
    ]
  },

  regular_reports: {
    params: [
      { view: i18next.t('mocks.configsDescription.regularReports.params.type'), name: 'type', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.regularReports.params.period'), name: 'period', sort: false, use: true },
      // { view: 'Содержимое', name: 'content', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.regularReports.params.emails'), name: 'emails', sort: false, use: true },
    ],
    permissions: [ {type: "view", set: true}, {type: "edit", set: false}, {type: "add", set: false}, {type: "delete", set: true} ],
    // filters: [
    //   {name: "report_type", view: "По типу отчета", type: "value_filter"},
    //   {name: "email", view: "По email", type: "value_filter"},
    // ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.regularReports.aggregates.totalItems')
      }
    ]
  },

  snmp: {
    params: [
      { view: i18next.t('mocks.configsDescription.snmp.params.hostname'), name: 'hostname', sort: true, use: true, isConnected: true },
      { view: i18next.t('mocks.configsDescription.snmp.params.modelName'), name: 'model_name', sort: true, use: true, isConnected: true },
    ],
    permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.snmp.params.totalItems')
      },
      {
        name: 'totalPages',
        view: i18next.t('mocks.configsDescription.snmp.params.totalPages')
      },
      /*
      {
        name: 'totalJobs',
        view: 'Итого заданий'
      }
      */
    ]
  },

  snmp_config: {
    params: [
      { view: i18next.t('mocks.configsDescription.snmp.params.hostname'), name: 'name', sort: false, use: true, isConnected: true }
    ],
    permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: true}, {type: "delete", set: true} ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.snmp.params.totalItems')
      }
    ]
  },

  oid: {
    params: [
      { view: i18next.t('mocks.configsDescription.oid.params.firmware'), name: 'firmware', sort: false, use: true, required: true },
      { view: i18next.t('mocks.configsDescription.oid.params.oid'), name: 'oid', sort: false, use: true, required: true },
      { view: i18next.t('mocks.configsDescription.oid.params.vendor'), name: 'vendor', sort: false, use: false },
      { view: i18next.t('mocks.configsDescription.oid.params.deviceStatus'), name: 'device_status', sort: false, use: false },
      { view: i18next.t('mocks.configsDescription.oid.params.printingStatus'), name: 'printing_status', sort: false, use: false },
      { view: i18next.t('mocks.configsDescription.oid.params.printed'), name: 'printed', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.oid.params.blackTonerMax'), name: 'black_toner_max', sort: false, use: false },
      { view: i18next.t('mocks.configsDescription.oid.params.blackTonerCurrent'), name: 'black_toner_current', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.oid.params.blackTonerPercent'), name: 'black_toner_percent', sort: false, use: false },
      { view: i18next.t('mocks.configsDescription.oid.params.cyanTonerMax'), name: 'cyan_toner_max', sort: false, use: false },
      { view: i18next.t('mocks.configsDescription.oid.params.cyanTonerCurrent'), name: 'cyan_toner_current', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.oid.params.cyanTonerPercent'), name: 'cyan_toner_percent', sort: false, use: false },
      { view: i18next.t('mocks.configsDescription.oid.params.yellowTonerMax'), name: 'yellow_toner_max', sort: false, use: false },
      { view: i18next.t('mocks.configsDescription.oid.params.yellowTonerCurrent'), name: 'yellow_toner_current', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.oid.params.yellowTonerPercent'), name: 'yellow_toner_percent', sort: false, use: false },
      { view: i18next.t('mocks.configsDescription.oid.params.magentaTonerMax'), name: 'magenta_toner_max', sort: false, use: false },
      { view: i18next.t('mocks.configsDescription.oid.params.magentaTonerCurrent'), name: 'magenta_toner_current', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.oid.params.magentaTonerPercent'), name: 'magenta_toner_percent', sort: false, use: false },
    ],
    permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.oid.aggregates.totalItems')
      },
      {
        name: 'totalPages',
        view: i18next.t('mocks.configsDescription.oid.aggregates.totalPages')
      },
      /*
      {
        name: 'totalJobs',
        view: 'Итого заданий'
      }
      */
    ]
  },

  printergroups: {
    params: [
      { view: i18next.t('mocks.configsDescription.printergroups.params.name'), name: 'name', sort: true, use: true },
    ],
    permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} ],
    filters: [
      {name: "name", view: i18next.t('mocks.configsDescription.printergroups.filters.name'), type: "autocompleteFilter"},
    ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.printergroups.aggregates.totalItems')
      },
      {
        name: 'totalPages',
        view: i18next.t('mocks.configsDescription.printergroups.aggregates.totalPages')
      },
      /*
      {
        name: 'totalJobs',
        view: 'Итого заданий'
      }
      */
    ]
  },

  hostgroups: {
    params: [
      { view: i18next.t('mocks.configsDescription.hostgroups.params.name'), name: 'name', sort: true, use: true },
      { view: i18next.t('mocks.configsDescription.hostgroups.params.version'), name: 'version', sort: true, use: true },
    ],
    permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} ],
    // filters: [
    //   {name: "name", view: "По наименованию", type: "value_filter"},
    // ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.hostgroups.aggregates.totalItems')
      },
      {
        name: 'totalPages',
        view: i18next.t('mocks.configsDescription.hostgroups.aggregates.totalPages')
      },
      /*
      {
        name: 'totalJobs',
        view: 'Итого заданий'
      }
      */
    ]
  },

  reader: {
    params: [
      { view: i18next.t('mocks.configsDescription.reader.params.uid'), name: 'uid', sort: true, use: true },
      { view: 'IP', name: 'ip', sort: false, use: true },
      { view: 'Принтер', name: 'printerName', sort: false, use: true },
      // { view: 'IP принтера', name: 'printerIp', sort: false, use: true }
    ],
    permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} ],
    filters: [
      // {name: "uid", view: "Идентификатор", type: "autocompleteFilter"},
    ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.reader.aggregates.totalItems')
      }
    ]
  },

  roles: {
    params: [
      { view: 'Название', name: 'name', sort: false, use: true },
      { view: 'Описание', name: 'description', sort: false, use: true },
      { view: 'Полномочия', name: 'authorities', sort: false, use: true },
    ],
    permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} ],
  },

  license: {
    params: [
      { view: 'Лицензия для', name: 'customer', sort: false, use: true },
      { view: 'Действует до', name: 'expirationDate', sort: false, use: true },
      { view: 'Выдана', name: 'manager', sort: false, use: true },
      { view: 'Контракт', name: 'contract', sort: false, use: true },
      { view: 'Ключ', name: 'licenseKey', sort: false, use: true },
    ],
    permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} ],
  },

  action_events: {
    params: [
      { view: i18next.t('mocks.configsDescription.actionEvents.params.op'), name: 'op', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.actionEvents.params.description'), name: 'description', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.actionEvents.params.eventTime'), name: 'event_time', sort: false, use: true },
    ],
    permissions: [ {type: "view", set: false}, {type: "edit", set: false}, {type: "add", set: false}, {type: "delete", set: false} ],
    filters: [
      {name: "name", view: i18next.t('mocks.configsDescription.actionEvents.filters.name'), type: "value_filter"},
      {name: "event_time", view: i18next.t('mocks.configsDescription.actionEvents.filters.eventTime'), type: "calendar"},
    ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.actionEvents.aggregates.totalItems')
      }
    ]
  },

  printer_api_events: {
    params: [
      { view: i18next.t('mocks.configsDescription.printerApiEvents.params.hostname'), name: 'hostname', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.printerApiEvents.params.description'), name: 'description', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.printerApiEvents.params.eventTime'), name: 'event_time', sort: false, use: true },
    ],
    permissions: [ {type: "view", set: false}, {type: "edit", set: false}, {type: "add", set: false}, {type: "delete", set: false} ],
    filters: [
      {name: "hostname", view: i18next.t('mocks.configsDescription.printerApiEvents.filters.hostname'), type: "value_filter"},
    ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.printerApiEvents.aggregates.totalItems')
      }
    ]
  },

  alerts: {
    params: [
      { view: i18next.t('mocks.configsDescription.alerts.params.name'), name: 'name', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.alerts.params.description'), name: 'description', sort: false, use: true },
    ],
    permissions: [ {type: "view", set: true}, {type: "edit", set: true}, {type: "add", set: false}, {type: "delete", set: false} ],
    filters: [
      {name: "name", view: i18next.t('mocks.configsDescription.alerts.filters.name'), type: "value_filter"},
    ],
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.alerts.aggregates.totalItems')
      }
    ]
  },

  blockedprinters: {
    params: [
      // { view: 'Имя принтера', name: 'name', sort: false, use: true },
      { view: i18next.t('mocks.configsDescription.blockedprinters.params.driver'), name: 'driver', sort: false, use: true }
    ],
    permissions: [ {type: "view", set: true}, {type: "add", set: true}, {type: "delete", set: true} ],    
  },

  integration: {
    params: [
      { view: 'Хост', name: 'host', sort: false, use: true },
      { view: 'Порт', name: 'port', sort: false, use: true },
      { view: 'Отправитель', name: 'sender', sort: false, use: true },
      { view: 'Логин', name: 'username', sort: false, use: true },
      { view: 'Статус', name: 'enabled', sort: false, use: true },
    ],
    permissions: [ {type: "view", set: true}, {type: "add", set: true}, {type: "delete", set: true} ],    
  },

  reports: {
    params: [
      { view: 'Имя пользователя', name: 'name', sort: false, use: true },
      { view: 'Логин', name: 'login', sort: false, use: true },
      { view: 'Количество страниц', name: 'pages', sort: false, use: true },
      { view: 'Цена', name: 'price', sort: false, use: true },
      { view: 'Принтер', name: 'printerName', sort: false, use: true },
    ],
    permissions: [ {type: "view", set: true}, {type: "add", set: true}, {type: "delete", set: true} ],    
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.alerts.aggregates.totalItems')
      }
    ]
  },

  report_by_printers: {
    params: [
      { view: 'Имя принтера', name: 'name', sort: false, use: true },
      { view: 'Количество страниц', name: 'pages', sort: false, use: true },
      { view: 'Цена', name: 'price', sort: false, use: true },
    ],
    permissions: [ {type: "view", set: true}, {type: "add", set: true}, {type: "delete", set: true} ],    
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.alerts.aggregates.totalItems')
      }
    ]
  },

  report_by_group_users: {
    params: [
      { view: 'Имя группы', name: 'name', sort: false, use: true },
      { view: 'Количество страниц', name: 'pages', sort: false, use: true },
      { view: 'Цена', name: 'price', sort: false, use: true },
    ],
    permissions: [ {type: "view", set: true}, {type: "add", set: true}, {type: "delete", set: true} ],    
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.alerts.aggregates.totalItems')
      }
    ]
  },

  report_by_group_printers: {
    params: [
      { view: 'Имя группы', name: 'name', sort: false, use: true },
      { view: 'Количество страниц', name: 'pages', sort: false, use: true },
      { view: 'Цена', name: 'price', sort: false, use: true },
    ],
    permissions: [ {type: "view", set: true}, {type: "add", set: true}, {type: "delete", set: true} ],    
    aggregates: [
      {
        name: 'totalItems',
        view: i18next.t('mocks.configsDescription.alerts.aggregates.totalItems')
      }
    ]
  }

};

const chartMocks = [
	{
      id: 1,
      login: 'u1',
      catalog_name: 'c1',
      data: [16, 18, 4, 11, 6, 6, 11, 10, 21, 1, 5, 2, 19, 21, 15, 5, 7, 16, 6, 13, 2, 8, 15, 11, 8, 6, 1, 3, 13, 2]
  },
  {
      id: 2,
      login: 'u2',
      catalog_name: 'c2',
      data: [1, 3, 7, 17, 17, 14, 2, 2, 13, 10, 17, 1, 17, 14, 30, 18, 7, 17, 15, 19, 8, 15, 17, 17, 12, 12, 9, 5, 20, 21]
  },
  {
      login: 'u3',
      catalog_name: 'c3',
      data: [10, 15, 16, 2, 13, 10, 11, 15, 2, 1, 4, 5, 16, 3, 12, 11, 9, 14, 19, 2, 2, 13, 10, 16, 19, 15, 18, 3, 18, 14]
  }
];

const LoadOperatorsMocks = {
  data: [
    {"id": 1, "login": "admin01", "email": "admin@admin.admin", 'role_name': 'admins'},
    {"id": 2, "login": "admin02", "email": "admin@admin.admin", 'role_name': 'users'},
    {"id": 3, "login": "admin03", "email": "admin@admin.admin", 'role_name': 'guests'},
    {"id": 4, "login": "admin04", "email": "admin@admin.admin", 'role_name': 'admins'},
  ]
};

const SavedReportsMocks = {
  data: [
    {"report_type" : "Test_report_type1", "period" : "Month", "email" : "admin@admin.ru"},
    {"report_type" : "Test_report_type2", "period" : "Week", "email" : "admin1@admin.ru"},
    {"report_type" : "Test_report_type3", "period" : "Day", "email" : "admin2@admin.ru"},
    {"report_type" : "Test_report_type4", "period" : "Hour", "email" : "admin@admin.ru"},
  ]
};

export {
  createResourceMocks,
  loadResourceMocks,
  loadPrinterGroupsMock,
  loadFiltersMocks,
  loadUsersGroupMocks,
  filterResourceConfigMocks,
  aggregateStats,
  loadSyncData,
  configsDescription,
  loadJobsMocks,
  loadJobsFiltersMock,
  loadPrintersMock,
  loadPrintersFiltersMocks,
  loadRfireadersMocks,
  loadTryDeletingItem,
  policyMocks,
  policyFilters,
  rulesMocks,
  groupsMocks,
  chartMocks,
  LoadOperatorsMocks,
  SavedReportsMocks,
  currentOperator
}
