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

interface ILabel {
  dx: number;
  dy: number;
  w: number;
  h: number;
  angle: number;
  type: any; //'image' | 'text' | 'barcode';
  text?: { id: number; label: string; data: string } | null;
  image_data?: string | null;
  opacity: number; 
}

interface IPolicy {
  id: number;
  state: boolean;
  owner: string;
  owner_id: number;
  name: string;
  operator_id: number;
  list_format: {
    orientation: 'portrait' | 'landscape';
    format: 'a3' | 'a4' | 'a5';
  };
  labels: ILabel[];
}

export {
  IRulesResponse,
  IRuleResponse,
  IRuleRequest,
  ILabel,
  IPolicy,
}
