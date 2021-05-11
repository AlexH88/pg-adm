import {IOperator} from 'shared/types/app';

function sendOperatorsDataConverter(data: IOperator) {
  const convertedData = {
    login: data.login,
    email: data.email,
    role: data.role,
    password: data.password,
  };
  return convertedData;
}

export {sendOperatorsDataConverter}
