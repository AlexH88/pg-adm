interface IUser {
  [index: string]: any; // TODO
  catalog_type: string;
  login: string;
  card_id: string;
  name: string;
  job_count: number | null;
  catalog_name: string;
  id: number;
  balance: number | null;
  email: string;
  page_count: number | null;
  actions?: string[];
  password?: string;
  groups: number[];
}

// TODO: use converters and create comfortable resources types inside system

export {
  IUser,
};
