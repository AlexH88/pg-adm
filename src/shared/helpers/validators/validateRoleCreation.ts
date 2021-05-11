import {IRole} from 'modules/Settings/namespace';
import i18next from "i18next";

function validate(values: IRole) {
  const errors: any = {};
  const requiredText = 'Это поле обязательно для заполнения';

  if (!values.name) {
    errors.name = requiredText;
  }

  if (!values.authorities) {
    errors.authorities = requiredText;
  }

  if ( values.authorities !== undefined && values.authorities.length == 0) {
    errors.authorities = requiredText;
  }

  return errors;
}

export {
  validate,
};
