function makeUsersBase() {
  const users: any = {};
  const oneUser = {
    name: 'some name',
    email: 'test@example.com',
    card_id: 'c',
    balance: 0,
    catalog_name: 'catalog 1',
    catalog_type: 'gen',
    page_count: 0,
    job_count: 0,
    groups: [],
  };
  let counter: number = 0;
  for ( let i = 0; i < 10; i++ ) {
    users[i] = {
      aggregate: {
        total_items: 150,
      },
      data: [],
    };

    for ( let y = 0; y < 15; y++ ) {
      users[i].data.push({
        ...oneUser,
        login: `user number ${counter}`,
        id: counter,
      });
      counter++;
    }
  }
  return users;
};

const userMocks = makeUsersBase();

export {
  userMocks,
};
