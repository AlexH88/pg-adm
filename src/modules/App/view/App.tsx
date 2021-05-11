import * as React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {IReduxState} from 'shared/types/app';
import {block} from 'bem-cn';
import {actions} from '../redux';
import 'shared/view/styles/base.styl';
import './styles.styl';
import './fonts';

interface IDispatchProps {
  loadConfig: typeof actions.loadConfig;
}

interface IStateProps {
  configStatus: boolean;
}

function mapStateToProps(state: IReduxState): IStateProps {
  return {
    configStatus: state.configs.status,
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    loadConfig: actions.loadConfig,
  }, dispatch);
}

class App extends React.Component<IDispatchProps & IStateProps, {}> {
  public componentWillMount() {
    const { loadConfig } = this.props;
    loadConfig();
  };

  public render() {
    const b = block('application');
    const { children, configStatus } = this.props;

    return (
      <div className={b()}>
        {configStatus ? children : null}
      </div>
    );
  }
}

export { App };
export default connect<IStateProps, IDispatchProps, {} >( null, mapDispatchToProps)(App);
