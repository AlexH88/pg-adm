interface IPolicy {
  id: number;
  userGroups: string[];
  printerGroups: string[];
  description: string;
  owner: string;
  name: string;
  state: boolean;
  hours: any;
  days: any;
  action: string;
  alert: boolean;
  counter: number;
  documentFormatSet: any;
  copies?: any;
  pages?: number;
}

interface IRuleGroup {
  id: number;
  name: string;
}

interface IRule {
  id: number;
  usergroups: IRuleGroup[];
  printergroups: IRuleGroup[];
  hours: string;
  days: string;
  action: string;
  alert: boolean;
  counter: number;
  policyId: number;
  seq: number;
}

export {
  IPolicy,
  IRule,
  IRuleGroup,
}
