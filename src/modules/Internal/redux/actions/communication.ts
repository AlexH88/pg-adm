function startEditEntry(id: number) { //k
  return { type: 'INTERNAL_MODULE:START_EDIT_ENTRY', payload: id };
}

function finishEditEntry(editedEntry: any, editedItem: any, shouldBeDeleted?: boolean) { //k
  return { type: 'INTERNAL_MODULE:FINISH_EDIT_ENTRY', payload: {
    editedEntry,
    editedItem,
    shouldBeDeleted
  } };
}

function startCreateEntry() { //k
  return { type: 'INTERNAL_MODULE:START_CREATE_ENTRY' };
}

function finishCreateEntry(renamedEntry: any = null) { //k
  return { type: 'INTERNAL_MODULE:FINISH_CREATE_ENTRY', payload: { renamedEntry } };
}

function startDeleteEntry(id: number) { //k
  return { type: 'INTERNAL_MODULE:START_DELETE_ENTRY', payload: id }
}

function deleteEntry() { //k
  return { type: 'INTERNAL_MODULE:DELETE_ENTRY' }
}

function switchModalStatus(status: boolean, mode: string) { //k
  return { type: 'INTERNAL_MODULE:SWITCH_MODAL_STATUS', payload: { status, mode } };
}

function switchRemoveModal() { //k
  return { type: 'INTERNAL_MODULE:SWITCH_REMOVE_MODAL' };
}

export {
  startEditEntry,
  finishEditEntry,
  startCreateEntry,
  finishCreateEntry,
  startDeleteEntry,
  deleteEntry,
  switchModalStatus,
  switchRemoveModal
};
