const convertFilters = (resource: string, filterType: string) => {
  let filterSubgroup = '', filterParameter = 'name';

  if (resource === 'users') {
    switch(filterType) {
      case 'usergroups':
      case 'catalogs':
        filterSubgroup = filterType;
        break;
      case 'login':
      case 'name':
        filterSubgroup = resource;
        filterParameter = filterType;
        break;
      default:
        filterSubgroup = 'unspecified';
        console.log(`FilterResource: Filter type ${filterType} is not specified`);
    }
  }
  if (resource === 'usergroups') {
    switch(filterType) {
      case 'catalog':
        filterSubgroup = 'catalogs';
        break;
      case 'name':
        filterSubgroup = 'usergroups';
        break;
      default:
        filterSubgroup = 'unspecified';
        console.log(`FilterResource: Filter type ${filterType} is not specified`);
    }
  }
  if (resource === 'hosts-network') {
    switch(filterType) {
      case 'name':
        filterSubgroup = resource;
        break;
      case 'ip':
        filterSubgroup = resource;
        filterParameter = filterType;
        break;
      default:
        filterSubgroup = 'unspecified';
        console.log(`FilterResource: Filter type ${filterType} is not specified`);
    }
  }
  if (resource === 'hosts-local') {
    switch (filterType) {
      case 'name':
      case 'version':
      case 'active':
      case 'ip':
        filterSubgroup = resource;
        filterParameter = filterType;
        break;
      case 'hostgroups':
        filterSubgroup = filterType;
        break;
      default:
        filterSubgroup = 'unspecified';
        console.log(`FilterResource: Filter type ${filterType} is not specified`);
    }
  }
  if (resource === 'printers-network') {
    switch (filterType) {
      case 'name':
      case 'driver':
        filterSubgroup = resource;
        filterParameter = filterType;
        break;
      case 'host':
        filterSubgroup = 'hosts-network';
        break;
      case 'printergroups':
        filterSubgroup = 'printergroups';
        break;
      default:
        console.log('Filter type not recognised: ', filterType);
    }
  }
  if (resource === 'printers-local') {
    switch (filterType) {
      case 'name':
      case 'driver':
        filterSubgroup = resource;
        filterParameter = filterType;
        break;
      case 'mac':
        filterSubgroup = 'hosts-local';
        filterParameter = filterType;
        break;
      case 'printergroups':
        filterSubgroup = 'printergroups';
        break;
      default:
        console.log('Filter type not recognised: ', filterType);
    }
  }
  if (resource === 'printergroups') {
    switch (filterType) {
      case 'name':
        filterSubgroup = resource;
        break;
      default:
        console.log('Filter type not recognised: ', filterType);
    }
  }
  if (resource === 'jobs') {
    switch (filterType) {
      case 'printer':
        filterSubgroup = 'printers';
        break;
      case 'title':
        filterSubgroup = 'jobs';
        filterParameter = filterType;
        break;
      case 'login':
        filterSubgroup = 'users';
        filterParameter = filterType;
        break;
      case 'usergroups':
      case 'printergroups':
      case 'catalogs':
        filterSubgroup = filterType;
        break;
      default:
        console.log('Filter type not recognised: ', filterType);
    }
  }
  if (resource.includes('policy')) {
    switch (filterType) {
      case 'name':
        filterSubgroup = 'policies';
        filterParameter = filterType;
        break;
      default:
        console.log('Filter type not recognised: ', filterType);
    }
  }
  if (resource === 'reader') {
    switch (filterType) {
      case 'uid':
        filterSubgroup = 'reader';
        filterParameter = filterType;
        break;
      default:
        console.log('Filter type not recognised: ', filterType);
    }
  }

  return {filterSubgroup, filterParameter};
}

export default convertFilters;
