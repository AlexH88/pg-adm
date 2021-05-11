// import { IUser } from 'shared/types/users';
import i18next from "i18next";

function validate(values: any) {
  const errors: any = {};

  const requiredText = i18next.t('Validate.requiredField');

  if (!values.name) {
    errors.name = requiredText;
  }

  if (values.rfid && !values.uid) {
    errors.uid = requiredText;
  }

  return errors;
}

function validateOidForm(values: any) {
  const errors: any = {};

  const requiredText = i18next.t('Validate.requiredField');

  if (!values.firmname) {
    errors.firmname = requiredText;
  }

  return errors;
}

export {
  validate,
  validateOidForm
};
