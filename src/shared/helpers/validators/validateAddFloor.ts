import { IPrinter } from 'shared/types/printers';

function validate(values: IPrinter) {
  const errors: any = {};

  const requiredText = 'Введите номер этажа';
  const requiredTextNumber = 'Значение должно быть номером';
  const requiredTextPicture = 'Загрузите изображение';

  if (!values.floorPicture) {
    errors.floorPicture = requiredTextPicture;
    // console.log('валидация картинки',values.floorPicture)
  } 
  
  if (!values.floorNumber) {
    errors.floorNumber = requiredText;
  } 
  
  if (isNaN(values.floorNumber) && values.floorNumber) {
    errors.floorNumber = requiredTextNumber;
  }

  return errors;
}

export {
  validate,
};
