import {IReport} from 'shared/types/app';
import i18next from "i18next";

function validate(values: IReport) {
  const errors: any = {};
  const requiredText = i18next.t('Validate.requiredField');
  const requiredTextData = i18next.t('Validate.requiredFieldDays');
  const requiredTextDataDiv = 'Начальная дата должна быть меньше конечной';

  if (!values.startDate) {
    errors.startDate = requiredText;
  }

  if (!values.endDate) {
    errors.endDate = requiredText;
  }

  if(values.startDate && values.endDate){
    let d1 = new Date(values.startDate);
    let d2 = new Date(values.endDate);
    let daysLag = Math.ceil(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 3600 * 24));
    if(daysLag > 30){
      errors.endDate = requiredTextData;
    }
    if(d2.getTime() < d1.getTime()) {
      errors.endDate = requiredTextDataDiv;
    }

  }

  if (!values.type) {
    errors.type = requiredText;
  }

  return errors;
}

export {
  validate,
};
