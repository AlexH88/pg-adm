interface IGroup {
  [ key: string ]: string | number | undefined | boolean;
  id: number;
  name: string;
  initialCredit: number;
  initialRestricted: number;
  amount: number;
  period: string;
  type: boolean;
  catalog_type: string;
}

export {
  IGroup,
};
