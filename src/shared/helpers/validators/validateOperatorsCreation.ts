import {IOperator} from 'shared/types/app';
import i18next from "i18next";

function validate(values: IOperator) {
  const errors: any = {};
  const requiredText = i18next.t('Validate.requiredField');
  const requiredEmailErrorText = i18next.t('Validate.requiredFieldMail');
  const reg = /^.+@.+$/;

  if(values.login == 'admin') {
    if (!values.password) {
      errors.login = requiredText;
    }
    return errors;
  } else {
    if (!values.login) {
      errors.login = requiredText;
    }

    if (!values.email) {
      errors.email = requiredText;
    } else if (reg.test(values.email) === false) {
      errors.email = requiredEmailErrorText;
    }

    if (!values.role) {
      errors.role = requiredText;
    }
    return errors;
  }
}

export {
  validate,
};
