interface IRuleResponse {
  id: number;
  policy_id: number;
  seq: number;
  usergroups: Array<{ id: number, name: string }>;
  printergroups: Array<{ id: number, name: string }>;
  hours: string;
  days: string;
  action: string;
  alert: boolean;
  counter: number;
}

interface IRulesResponse {
  data: IRuleResponse[];
}

type IPeriod = 'day' | 'week' | 'month';

interface IRuleRequest {
  id: number;
  policy_id: number;
  usergroups: number[];
  printergroups: number[];
  hours: string;
  days: string;
  action: string;
  alert: boolean;
  counter: number;
}

export {
  IRulesResponse,
  IRuleResponse,
  IRuleRequest,
  IPeriod
}
