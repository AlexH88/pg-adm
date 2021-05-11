import {IUser} from 'shared/types/users';
import i18next from "i18next";

function validate(values: IUser) {
  const errors: any = {};

  const requiredText = i18next.t('Validate.requiredField');
  const wrongEmailFormatText = 'Неправильный формат Email';

  if(values.ldapSource) {
    return errors;
  } else {
    if (!values.login) {
      errors.login = requiredText;
    }

    if (!values.name) {
      errors.name = requiredText;
    }

    if (!values.email) {
      errors.email = requiredText;
    }

    if (!/^.+@.+$/.test(values.email) && !(typeof values.email === 'undefined') ) {
      errors.email = wrongEmailFormatText;
    }

    return errors;
  }

}

export {
  validate,
};

