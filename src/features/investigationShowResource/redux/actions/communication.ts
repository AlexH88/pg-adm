import {IResource} from 'shared/types/app';
import { IGetHashData, IChangeModalStatusPayload, ISwitchModalStatusAction} from '../../namespace/actionTypes';


function getHashData(data: string): IGetHashData {
  return { type: 'SHOW_INVESTIGATION_RESOURCE:GET_HASH_DATA', payload: data };
}

function switchModalStatus({ status, mode }: IChangeModalStatusPayload): ISwitchModalStatusAction {
  return { type: 'SHOW_INVESTIGATION_RESOURCE:SWITCH_MODAL_STATUS', payload: { status, mode } };
}

export {
  getHashData,
  switchModalStatus
};
