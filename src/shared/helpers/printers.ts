// import { IResursStatus } from 'shared/types/app';
// import { INormalizeResursStatus } from 'shared/types/printers';

// TODO: not exist types IResursStatus and INormalizeResursStatus
function normalizeStatus(response: any) {
  const normalStatus: any = { statusCode: response.status_code, field: response.field };
  return normalStatus;
};

export { normalizeStatus };
