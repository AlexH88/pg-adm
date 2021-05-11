
function validate(values: any) {
  const errors: any = {};

  const requiredTextPicture = 'Загрузите изображение';

  if (!values.floorPicture) {
    errors.floorPicture = requiredTextPicture;
    // console.log('валидация картинки',values.floorPicture)
  } 

  return errors;
}

export {
  validate,
};