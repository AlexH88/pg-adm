import * as React from 'react';
import {block} from 'bem-cn';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {IReduxState, TypesResources} from 'shared/types/app';
import {SnmpRadioButtonSelect} from 'shared/view/elements';
import {initialResource} from 'features/showResource/redux/data/initial';
import {changeHeader} from 'features/showResource/redux/actions/communication';
import {IHeader} from 'features/showResource/namespace';
import injectResource from 'shared/helpers/injectResource';
import './DisplaySelect.styl';
import i18next from "i18next";

interface IDispatchProps {
  changeHeader: typeof changeHeader;
}

interface IStateProps {
  headers: IHeader[];
  connectedHeaders: IHeader[];
  selectedHeaders: string[];
}

interface IOwnProps {
  resource: TypesResources;
  disabledValidator?(headers: IHeader[]): string[];
  onAdd?: any;
}

function mapStateToProps(state: IReduxState, ownProps: IOwnProps): IStateProps {
  const resourceState = state.showResource[ownProps.resource];
  const { headers = [] } = resourceState || initialResource;

  let connectedHeaders: any;
  if (ownProps.resource === 'snmp') {
    connectedHeaders = headers;
  } else if (headers) {
    connectedHeaders = headers.filter((header) => header.isConnected);
  } else {
    connectedHeaders = [];
  }

  const selectedHeaders = connectedHeaders.map((header:any) => header.value);

  return {
    headers,
    connectedHeaders,
    selectedHeaders
  };
}

function mapDispatchToProps(dispatch: any, ownProps: IOwnProps): IDispatchProps {
  return bindActionCreators({
    changeHeader: injectResource(ownProps.resource, changeHeader)
  }, dispatch);
}

type Props = IDispatchProps & IStateProps & IOwnProps;

class SnmpDisplaySelect extends React.Component<Props, {}> {
  private b = block('display-select');

  public render() {
    const b = this.b;
    const {
      headers,
      selectedHeaders,
      changeHeader
    } = this.props;
    
    return (
      <div className={b()}>
        <div className={b('multiselect')}>
          <SnmpRadioButtonSelect
            values={headers}
            selectedValues={selectedHeaders}
            onChange={changeHeader}
            onAdd={this.props.onAdd}
          />
        </div>
      </div>
    );
  }
}

export default connect<IStateProps, IDispatchProps, IOwnProps >(mapStateToProps, mapDispatchToProps)(SnmpDisplaySelect);
