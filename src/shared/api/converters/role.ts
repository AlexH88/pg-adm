import {Namespace as NSRole} from 'modules/Settings';

function sendRoleDataConverter(data: NSRole.IData) {
  const convertedData = {
    name: data.name,
    description: data.description,
    access_rules: data.accessRules,
  };
  return convertedData;
}

export {sendRoleDataConverter}
