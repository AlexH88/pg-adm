import {IGroup} from 'shared/types/groups';
import i18next from "i18next";

function validate(values: IGroup) {
  const errors: any = {};

  const requiredText = 'Это поле обязательно для заполнения';
  const requiredZero = 'Начисления должны быть больше 0'

  if (!values.id) {
    errors.id = requiredText;
  }

  if (!values.name) {
    errors.name = requiredText;
  }

  if (!values.amount) {
    errors.amount = requiredText;
  }

  if (values.amount === 0) {
    errors.amount = requiredZero;
  }

  if (!values.initialCredit) {
    errors.initialCredit = requiredText;
  }

  if (!values.period) {
    errors.period = requiredText;
  }

  return errors;
}

export {
  validate,
};
