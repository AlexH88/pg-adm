import * as React from 'react';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {IConfigHeaders, IReduxState} from 'shared/types/app';
import {Namespace as FilterResourseNS} from 'features/filterResource';
import {selectors as ShowResourceSelectors} from 'features/showResource';
import {actions} from '../../redux';
import {actions as showResourceActions} from '../../../../features/showResource/redux';
import {selectors} from '../../redux/actions';
import {IAgregate, IChoosenEditPolicy, IMode} from '../../namespace';
import FilterResource from 'features/filterResource/view/FilterResource/FilterResource';
import i18next from "i18next";
import { InvestigationShowResource } from '../../../../features/investigationShowResource';


interface IDispatchProps {}

interface IStateProps {}

interface ILocation {
  location: any;
}

type Props = IDispatchProps & IStateProps & ILocation;

function mapState(state: IReduxState): IStateProps {
  return {}
}

function mapDispatch(dispatch: any): IDispatchProps {
  return {}
}

const b = block('policies');

class Investigation extends React.PureComponent<Props, {}> {
  state = {
    editedWatermarkPolicy: null
  }

  public render() {
    return (
        <div className={b()}>
          <FilterResource
            configs={null}
            resource={null}
            label={i18next.t('PolicyLk.investigationHeader')}
            noDisplaySelect
          />

          <InvestigationShowResource
            onAdd={null}
            resource={"investigation"}
            configs={{
              sort: {
                by: 'id',
                order: 'asc',
              },
            }}
          />

        </div>
    );
  }

}

export { Investigation };
export default connect<IStateProps, IDispatchProps, {} >(mapState, mapDispatch)(Investigation);
