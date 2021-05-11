const convertFiltersShow = (filterConfigs: any) => {
  const modifiedFilterConfigs: any = {};

  Object.keys(filterConfigs).forEach((param) => {
    switch(param) {
      case 'usergroups':
      case 'hostgroups':
      case 'printergroups':
        modifiedFilterConfigs['groups'] = filterConfigs[param];
        break;
      default:
        modifiedFilterConfigs[param] = filterConfigs[param];
    }
  });
  return modifiedFilterConfigs;
}

export default convertFiltersShow;
