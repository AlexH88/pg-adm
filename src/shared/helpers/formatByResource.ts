
// Function will formatt returned value depending on resourse string
function formatByResource(resource: string, instance: any): any {
  switch (resource) {
  case 'users':
    return {
      login: instance.login,
      name: instance.name,
      email: instance.email,
      card: instance.card,
      balance: instance.balance,
      id: instance.id,
    };
  case 'groups':
    return {
      name: instance.name,
      initialCredit: instance.initialCredit,
      initialRestricted: instance.initialRestricted ? 0 : 1,
      amount: instance.amount,
      period: instance.period,
      type: instance.type,
      id: instance.id,
    };
  case 'catalogs': {
    return instance;
  }
  default:
    return instance;
  }
};

export default formatByResource;
