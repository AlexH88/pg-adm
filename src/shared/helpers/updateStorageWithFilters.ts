const updateStorageWithFilters = (filterConfigs: any[]) => {
  let filtersToLS: any[] = [];

  for (const filterType in filterConfigs) {
    if (filterConfigs.hasOwnProperty(filterType)) {
      filtersToLS.push({ name: filterType, value: filterConfigs[filterType] });
    }
  }

  return filtersToLS;
}

export default updateStorageWithFilters;
