function validate(values: any) {
  const errors: any = {};

  const emailError = 'Введите корректный почтовый адрес';
  // tslint:disable
  const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // tslint:enable
  if (!emailReg.test(values['first-email'])) {
    errors['first-email'] = emailError;
  }

  if (values.email && values.email.length) {
    const emailsArrayErrors = [] as Array<{ email: string }>;
    values.email.forEach((email: { email: string }, index: number) => {
      const emailErrors = {} as { email: string };
      if (!emailReg.test(email.email)) {
        emailErrors.email = emailError;
        emailsArrayErrors[index] = emailErrors;
      }
    });

    if (emailsArrayErrors.length) {
      errors.email = emailsArrayErrors;
    }
  }

  return errors;
}

export {
  validate,
};
