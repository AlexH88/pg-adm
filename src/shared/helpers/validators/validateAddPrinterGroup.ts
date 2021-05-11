import {IPrinter} from 'shared/types/printers';

function validate(values: IPrinter) {
  const errors: any = {};

  const requiredText = 'Это поле обязательно для заполнения';

  if (!values.name) {
    errors.name = requiredText;
  }

  if (/^\s+$/.test(values.name)) {
    errors.name = 'Название группы не может быть пустым';
  }

  return errors;
}

export {
  validate
};
