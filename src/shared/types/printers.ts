interface IPrinter {
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
  floorNumber: any;
  floorPicture: any;
};

interface INormalizeResourceStatus {
  statusCode: string | number;
  field: string;
}

export { IPrinter, INormalizeResourceStatus };
