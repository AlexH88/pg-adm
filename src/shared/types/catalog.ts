interface ICatalog {
  // [index: string]: string | number | undefined | boolean;
  id: number;
  name: string;
  type: string;
  catalog_type: string;
  err_code: string;
}

interface ICatalogEditForm {
  id: number;
  name: string;
  base_dn: string;
  url: string;
  type: 'EDirectory' | 'Active Directory';
  user: string;
  password: string;
}

export {
    ICatalog,
    ICatalogEditForm,
};
