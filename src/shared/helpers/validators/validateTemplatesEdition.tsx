import { ITemplate } from 'shared/types/app';
import i18next from "i18next";

function validate(values: ITemplate) {
  const errors: any = {};
  const requiredText = 'Это поле обязательно для заполнения';

  if (!values.email) {
    errors.email = requiredText;
  }

  if (!values.emails) {
    errors.emails = requiredText;
  }

  if ( values.emails !== null && typeof(values.emails) == 'object') {
    if(values.emails.length == 0) {
      errors.emails = requiredText;
    }
  }

  return errors;
}

export {
  validate
};
