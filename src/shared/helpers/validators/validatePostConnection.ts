import {IPostConnectionConfig} from 'shared/types/postConnectionConfig';
import i18next from "i18next";

function validate(values: IPostConnectionConfig, mode: any) {
  const errors: any = {};

  const requiredText = i18next.t('Validate.requiredField');
/*
  if (!values.host) {
    errors.host = requiredText;
  }

  if (!values.port) {
    errors.port = requiredText;
  }

  if (!values.sender) {
    errors.sender = requiredText;
  }

  if (!values.password) {
    errors.password = requiredText;
  }

  if (!values.login) {
    errors.login = requiredText;
  }
*/
  return errors;
}

export {
  validate,
};
