import { Map, fromJS, List } from 'immutable';
import { ShowResourceActions } from '../../namespace';
import { ISnmpReduxState } from '../../namespace';
import { initialState, initialResource } from '../data/initial';

function mainReducer(state: ISnmpReduxState = initialState, action: ShowResourceActions | any): /*IReduxState*/any {
  const imState: Map<string, any> = fromJS(state);
  const { resource } = action.meta ? action.meta : { resource: '' };
  switch (action.type) {

    case 'SHOW_RESOURCE:INIT_RESOURCE':
      return imState.set(resource, { ...initialResource, ...action.payload }).toJS();

    case 'SHOW_RESOURCE:TOGGLE_SPINNER': {
      return imState.set('showSpinner', action.payload).toJS();
    }

    case 'SHOW_RESOURCE:SET_ALERT_DATA': {
      return imState.set('alertData', action.payload).toJS();
    }

    case 'SHOW_RESOURCE:INIT_HEADERS_CONFIG_FINISHED':
      return imState.setIn([resource, 'headers'], action.payload.headers).toJS();

    case 'SHOW_RESOURCE:CHANGE_HEADER': {
      return imState
        .updateIn(
          [resource, 'headers'],
          (headers: List<Map<string, any>>) => {
            return headers.map((header: Map<string, any>) => (
              action.payload.value === header.get('value')
              ? header.set('isConnected', action.payload.isCheck)
              : header
            ));
          },
        )
        .toJS();
    }

    case 'SNMP_SHOW_RESOURCE:LOAD_RESOURCE_SUCCESS': {
      const { payload } = action;

      // console.log('addPrinters в редюсере', payload.addPrinters )

      const oldState = imState.toJS();

      const oldResource = oldState[resource];

      const newResource = {...initialState,
        pages: payload.data.floorNumbers,
        totalFloor: payload.data.floorCount,
        totalPrinter: payload.data.printerCount,
        errorFloors: payload.data.floorErrors,
        addPrinters: payload.addPrinters
      };

      const updResource = {
        ...oldResource,
        ...newResource
        }
      return imState.setIn([resource], updResource).toJS();
    }

    case 'SHOW_RESOURCE:SET_SHORT_RESOURCE': {
      const { meta: { resource }, payload } = action;
      return imState.setIn(['short', resource], payload).toJS();
    }

    case 'SHOW_RESOURCE:SET_ROLE_RESOURCE': {
      const { meta: { resource }, payload } = action;
      return imState.setIn(['short', resource], payload[0]).toJS();
    }

    case 'SHOW_RESOURCE:UPDATE_INDIVIDUAL_RESOURCE_ITEM': {
      const {
        payload: {
          data,
          sort: { by = 'id', order = 'asc' }
        }
      } = action;
      
      const newItem = data;
      const oldData = imState.getIn([resource, 'data']).toJS();

      const stringSort = (a: any, b: any) => {
        var nameA = a[by].toUpperCase();
        var nameB = b[by].toUpperCase();
        if (order === 'asc') {
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        } else {
          if (nameA > nameB) {
            return -1;
          }
          if (nameA < nameB) {
            return 1;
          }
          return 0;
        }
      }

      const numberSort = (a: any, b: any) => {
        if (order === 'asc') {
          return a[by] - b[by];
        } else {
          return b[by] - a[by];
        }
      }

      if (oldData && oldData[0]) {
        const filteredItems = oldData[0].filter((item: any) => item.id !== newItem.id);
        const newData = [...filteredItems, newItem];
        if (['name'].includes(by)) {
          newData.sort((a, b) => stringSort(a,b));
        } else {
          newData.sort((a, b) => numberSort(a,b));
        }
        return imState.setIn([resource, 'data'], {0: newData}).toJS();
      } else {
        return imState.toJS();
      }
    }

    case 'SHOW_RESOURCE:UPDATE_TABLE_RELOAD_PROMPT': {
      const { payload: { data } } = action;
      const oldEntries = imState.getIn([resource, 'prompt']).toJS();
      if (typeof data !== 'undefined' && data.id) {
        if (oldEntries.length > 0) {
          const filteredItems = oldEntries.filter((item: any) => item.id !== data.id);
          const newEntries = [...filteredItems, data];
          return imState.setIn([resource, 'prompt'], newEntries).toJS();
        } else {
          return imState.setIn([resource, 'prompt'], [data]).toJS();
        }
      } else {
        return imState.setIn([resource, 'prompt'], []).toJS();
      }
    }

    case 'SHOW_RESOURCE:LOAD_POLICY_RULE_SUCCESS': {
      const { payload } = action;
      return imState.setIn([resource, 'data'], payload).toJS();
    }

    case 'SHOW_RESOURCE:LOAD_AGGREGATE_SUCCESS':
      return imState
        .setIn([resource, 'aggregate'], action.payload)
        .setIn([resource, 'pages'], action.payload.totalPages)
        .toJS();

    case 'SHOW_RESOURCE:SORT_RESOURCE':
      return imState.setIn(
        [resource, 'sort'],
        {
          by: action.payload,
          order: action.payload === imState.getIn([resource, 'sort', 'by'])
            && imState.getIn([resource, 'sort', 'order']) === 'desc'
            ? 'asc'
            : 'desc',
        },
      ).setIn([resource, 'currentPage'], initialResource.currentPage)
      .toJS();

    case 'SHOW_RESOURCE:CHANGE_PAGE':
      return imState.setIn([resource, 'currentPage'], action.payload.page).toJS();

    case 'SNMP_SHOW_RESOURCE:CHANGE_LOADER': {
      return imState
        .setIn([resource, 'isLoading'], action.payload)
        .toJS();
    }

    case 'SHOW_RESOURCE:PUT_TIMER_ID': {
      return imState
        .setIn([resource, 'timerId'], action.payload)
        .toJS();
    }

    case 'SHOW_RESOURCE:PUT_CURRENT_PAGE_ID': {
      return imState
        .setIn(['floors', 'currentPageId'], action.payload)
        .toJS();
    }

    case 'SHOW_RESOURCE:LOAD_RECURSIVE_RESOURCE':
      return imState
        .setIn([resource, 'pullingData'], true)
        .toJS();

    case 'SHOW_RESOURCE:STOP_LOAD_RECURSIVE_RESOURCE':
      return imState
        .setIn([resource, 'pullingData'], false)
        .toJS();

    case 'SHOW_RESOURCE:EDIT_RULE_RESOURCE': {
      const { payload: { editedRule, index } } = action;
      return imState.setIn(['rules', 'data', index], editedRule).toJS();
    }

    case 'SHOW_RESOURCE:ADD_RULE_RESOURCE': { // #AddRule
      const { payload: { editedRule, index } } = action;
      return imState.setIn(['rules', 'data', index], editedRule).toJS();
    }

    case 'SHOW_RESOURCE:DELETE_RULE': {
      const { payload: { id } } = action;
      const ruleData = imState.getIn(['rules', 'data']);
      return imState
        .setIn(['rules', 'data'], ruleData.filter((rule: Map<string, any>) => rule.get('id') !== id))
        .toJS();
    }

    case 'SHOW_RESOURCE:CHANGE_ORDER_ITEMS' : {
      const { payload } = action;
      return imState.setIn(['rules', 'data'], payload).toJS();
    }

    case 'SHOW_RESOURCE:SET_CURRENT_OPERATOR': {
      const { payload } = action;
      return imState.set('currentOperator', payload).toJS();
    }

    case 'SNMP_SHOW_RESOURCE:PRINTER_SIZE_RATE': {
      return imState
        .setIn([resource, 'printerSize'], action.payload)
        .toJS();
    }

    case 'SNMP_SHOW_RESOURCE:SET_PICTURE': {
      const { payload : { img, resource, id, pictureId, printersArray, addPrinters } } = action;

      const oldState = imState.toJS();
      const oldResource = oldState[resource];

      const newResource = {
        picture: img,
        pictureId: id,
        currentPage: pictureId,
        printers: printersArray,
        addPrinters: addPrinters
      }

      const updResource = {
        ...oldResource,
        ...newResource
      }
      

      return imState.setIn([resource], updResource).toJS();
    }

    default:
      return state;
  }
}

export default mainReducer;
