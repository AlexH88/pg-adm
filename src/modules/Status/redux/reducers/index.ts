import {fromJS, Map} from 'immutable';
import {IReduxState} from '../../namespace';
import initialState from '../data/initial';
import {StatusModuleActions} from '../../namespace/actionTypes';

function mainReducer(state: IReduxState = initialState, action: StatusModuleActions): /*IReduxState*/any {
  const imState: Map<string, any> = fromJS(state);
  switch (action.type) {
    case 'STATUS_MODULE:SET_CURRENT_CHARTS' : {
      return imState.set('currentCharts', action.payload).toJS();
    }

    case 'STATUS_MODULE:TOGGLE_CHART' : {
      const { payload: { value, isCheck } } = action;
      return imState
        .updateIn(
          ['currentCharts'],
          (items: any) => items.map((item: any) => (
            value === item.get('value') ? item.set('isConnected', isCheck) : item
          )),
        )
        .toJS();
    }

    case 'STATUS_MODULE:SET_CHART_DATA' : {
      return imState.setIn(['chartsData', action.payload.chartName], action.payload.data).toJS();
    }

    case 'STATUS_MODULE:SET_REPLACED_CHART' : {
      return imState.setIn(['replaced', action.payload.chartName], action.payload.replaced).toJS();
    }

    case 'STATUS_MODULE:SWITCH_MODAL_STATUS': {
      return imState.set('showModal', action.payload.status)
      .set('modalMode', action.payload.mode).toJS();
    }

    case 'STATUS_MODULE:SET_SETTINGS_CHART': {
      return imState.set('settings', action.payload)
    }

    case 'STATUS_MODULE:CLEAR_SETTINGS_CHART': {
      return imState.set('settings', null)
    }

    default:
      return state;
  }
}

export default mainReducer;
