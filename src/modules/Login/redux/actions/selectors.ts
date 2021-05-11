import {IReduxState} from 'shared/types/app';
import {IRuleGroup} from 'shared/types/policy';

function getRuleById(state: IReduxState, id: number): any {
  const showResource = state.showResource as any;
  return showResource.rules.data.find((rule: any) => id === rule.id);
}

function getPrinterGroups(state: IReduxState): IRuleGroup[] {
  return state.policy.printerGroups;
}

function getUserGroups(state: IReduxState): IRuleGroup[] {
  return state.policy.userGroups;
}

function getRuleData(state: IReduxState) {
  const showResource = state.showResource as any;
  return showResource.rules.data;
}

function getPoliciesData(state: IReduxState) {
  const showResource = state.showResource as any;

  // TODO Костыль: переделывает объект в массив
  function remake(data : any) {
    let arr = [];
    for(var i = 0 ; i < data.length; i++)
      arr.push(data[i][i]);
    return arr;
  }

  return showResource.policies ? remake(showResource.policies.data) : [];
}

function getId(data : any) : number { //#AddRule
  return data.length + 1;
}

export {
  getRuleById,
  getPrinterGroups,
  getUserGroups,
  getRuleData,
  getPoliciesData,
  getId
}
