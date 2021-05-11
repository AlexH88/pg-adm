
function resourceConvertion(resource: string) {
  if (resource === 'users') {
    return '';
  } else if (resource === 'printers') {
    return 'printer';
  }
}

function convertForShortRequest(resource: string) {
  const resources: any = {
    users: 'user',
    'hosts-network': 'host',
    'hosts-local': 'host',
    'printers-network': 'printer',
    'printers-local': 'printer'
  };

  return resources[resource] ? resources[resource] : resource;
}

function convertForDataUpdate(resource: string) {
  const resources: any = {
    'hosts-network': 'hosts',
    'hosts-local': 'hosts',
    'printers-network': 'printers',
    'printers-local': 'printers'
  };

  return resources[resource] ? resources[resource] : resource;
}

function getResourceUrl(resource: string) {
  if (resource === 'catalogs') {
    return 'catalogs/groups';
  } else if (resource === 'printers') {
    return 'printers/localhost';
  } else if (resource === 'hosts') {
    return 'hosts';
  }
}

export { resourceConvertion, convertForShortRequest, convertForDataUpdate, getResourceUrl };
