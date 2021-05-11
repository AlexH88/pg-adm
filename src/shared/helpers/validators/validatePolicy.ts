import {IPolicy} from 'shared/types/policy';
import i18next from "i18next";

function validate(values: IPolicy) {
  const errors: any = {};

  const requiredText = i18next.t('Validate.requiredField');

  if (!values.name) {
    errors.name = requiredText;
  }

  if (!values.days || (values.days && Array.isArray(values.days.days) && values.days.days.length === 0)) {
    errors.days = requiredText;
  }

  if (!values.hours || (values.hours && Array.isArray(values.hours.hours) && values.hours.hours.length === 0)) {
    errors.hours = requiredText;
  }

  if (values.pages < 0) {
    errors.pages = 'Количество страниц должно быть положительным значением'
  }  

  return errors;
}

export {
  validate,
};
