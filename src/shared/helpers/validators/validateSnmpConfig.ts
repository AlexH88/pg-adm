// import { IUser } from 'shared/types/users';

function validate(values: any) {
  const errors: any = {};

  const requiredText = 'Это поле обязательно';

  if (!values.type) {
    errors.type = requiredText;
  }

  if (!values.name) {
    errors.name = requiredText;
  }

  if (!values.oidFormula) {
    errors.oidFormula = requiredText;
  }

  return errors;
}

function validateName(values: any) {
  const errors: any = {};

  const requiredText = 'Это поле обязательно';

  if (!values.name) {
    errors.name = requiredText;
  }

  return errors;
}

export {
  validate,
  validateName
};
