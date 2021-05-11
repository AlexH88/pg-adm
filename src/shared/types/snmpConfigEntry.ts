interface ISnmpConfigEntry {
  id: number;
  name: string;
  host: string;
  driver: string;
  type: string;
  isFollowme: boolean;
  rfidrUid: string;
  price: string;
  pageCount: number;
  jobCount: number;
  groups: number[];
};

export { ISnmpConfigEntry };
