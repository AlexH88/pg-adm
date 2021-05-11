
interface IGroupHeaderConfigs {
  [index: string]: any;
  color: string[];
  status: {
    printed: any;
    inprocess: any;
    wait: any;
    deny_funds: any,
    deny_policy: any,
    corrupted: any,
    queue: any,
  };
}

interface ICatalogHeaderConfigs {
  type: {
    ad: string;
    edir: string;
  };
}

interface IAgregate {
  value: string;
  title: string;
}

export {
  IAgregate,
  IGroupHeaderConfigs,
  ICatalogHeaderConfigs,
};
