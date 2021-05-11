interface IRules {
  [key: string]: boolean;
}

interface IRoleResponse {
  id: number;
  name: string;
  description: string;
  access_rules: IRules;
}

interface IRuleDescriptionResponse {
  name: string;
  display_name: string;
}

export {
  IRoleResponse,
  IRuleDescriptionResponse
}
