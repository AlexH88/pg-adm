// import { IRuleGroup } from 'shared/types/policy';
// import {IResource} from "../../../../shared/types/app";
// import {IChangeOrderItems} from "../../../../features/showResource/namespace/actionTypes";

function switchEditModal() {
  return { type : 'SNMP_MODULE:SWITCH_EDIT_MODAL' };
}

function switchRemoveModal() {
  return { type : 'SNMP_MODULE:SWITCH_REMOVE_MODAL' };
}

function startEditFirmware(row: any) {
  return { type: 'SNMP_MODULE:START_EDIT_FIRMWARE', payload: row };
}

function startDeleteFirmware(row: any) {
  return { type: 'SNMP_MODULE:START_REMOVE_FIRMWARE', payload: row };
}

function saveFirmvare() {
  return { type: 'SNMP_MODULE:SAVE_FIRMWARE' };
}

function acceptDeleteFirmware() {
  return { type: 'SNMP_MODULE:ACCEPT_DELETE_FIRMWARE' };
}

export {
  switchEditModal,
  switchRemoveModal,
  startEditFirmware,
  startDeleteFirmware,
  saveFirmvare,
  acceptDeleteFirmware
};
