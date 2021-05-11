function validate(values: any) {
  const errors: any = {};

  const requiredText = 'Новые пароли не совпадают';
  const requiredText2 = 'Это поле обязательно для заполнения';

  if (values.newPassword !== values.repeatNewPassword) {
    errors.repeatNewPassword = requiredText;
  }

  if (!values.oldPassword ) {
    errors.oldPassword = requiredText2;
  }

  if (!values.newPassword ) {
    errors.newPassword = requiredText2;
  }

  if (!values.repeatNewPassword ) {
    errors.repeatNewPassword = requiredText2;
  }

  return errors;
}

export {
  validate,
};
