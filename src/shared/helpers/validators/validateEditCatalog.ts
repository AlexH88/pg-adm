import {ICatalogEditForm} from 'shared/types/catalog';
import i18next from "i18next";

function validate(values: ICatalogEditForm) {
  const errors: any = {};

  const requiredText = i18next.t('Validate.requiredField');

  /*
  if (!values.id) {
    errors.id = requiredText;
  }

  if (!values.name) {
    errors.name = requiredText;
  }

  if (!values.url) {
    errors.url = requiredText;
  }

  if (!values.base_dn) {
    errors.base_dn = requiredText;
  }

  if (!values.user) {
    errors.user = requiredText;
  }

  if (!values.password) {
    errors.password = requiredText;
  }
  */
  return errors;
}

interface ICatalogFormData {
  url: string;
  user: string;
  password: string;
}

function checkFieldsCatalogForm(data: ICatalogFormData) {
  let { url, user, password } = data;
  if (!url) {
    url = '';
  }
  if (!user) {
    user = '';
  }
  if (!password) {
    password = '';
  }
  return url && url.length > 0
    && user && user.length > 0
    && password && password.length > 0;
}

export {
  validate,
  checkFieldsCatalogForm,
};
