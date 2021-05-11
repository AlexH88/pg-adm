/* tslint:disable */
const totalStats = {
  data: [
    {
      login: 'user1',
      catalog_name: 'catalog1',
      price: 100,
      job: 10,
      pages: 3,
    },
    {
      login: 'user2',
      catalog_name: 'catalog2',
      price: 110,
      job: 11,
      pages: 4,
    },
    {
      login: 'user4',
      catalog_name: 'catalog4',
      price: 111,
      job: 5,
      pages: 1,
    },
    {
      login: 'user5',
      catalog_name: 'catalog5',
      price: 122,
      job: 2,
      pages: 10,
    },
  ],
  aggregate: {
    total_items: 6,
  },
};

const loadTotalStatsFiltersMock = {
  filters: [
    { param: 'login', type: 'value_filter' },
    { param: 'printer', type: 'value_filter' },
    { param: 'usergroup', type: 'multi_filter', values: [{ id: 1, name: 'usergroup1' }, { id: 2, name: 'usergroup2' }] },
    { param: 'printergroup', type: 'multi_filter', values: [{ id: 1, name: 'printergroup1' }, { id: 2, name: 'printergroup2' }] },
    { param: 'output_time', type: 'calendar' },
    { param: 'type', type: 'select_filter',
    values: [{ id: 1, name: 'price', label: 'Общая стоимость' }, { id: 2, name: 'job', label: 'Количество заданий' }, { id: 3, name: 'pages', label: 'Количество страниц' }] },
  ],
};


export {
  totalStats,
  loadTotalStatsFiltersMock,
}
