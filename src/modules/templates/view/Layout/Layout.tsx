import * as React from 'react';
import {connect} from 'react-redux';
import {block} from 'bem-cn';
import {Footer, Header} from 'shared/view/components';
import Menu from 'shared/view/components/Menu/Menu';
import './Layout.styl';
import {bindActionCreators} from 'redux';

const closeAlert = () => ({
  type: 'SHOW_RESOURCE:SET_ALERT_DATA',
  payload: {
    isShowAlert: false,
    message: null,
    type: 'info',
  },
});

interface IOwnAlertProps {
  type: string;
  message: string;
  isShowAlert: boolean;
  closeAlert: any;
}

const mapStateTopProps = (state: any) => ({
  type: state.showResource.alertData.type,
  message: state.showResource.alertData.message,
  isShowAlert: state.showResource.alertData.isShowAlert,
});

const mapDispatchToProps = (dispatch: any) => (
  bindActionCreators({ closeAlert }, dispatch)
);

class Alerts extends React.Component<IOwnAlertProps, {}> {
  private b = block('alerts-wrapper');

  public render() {
    const b = this.b;
    const { type, message, isShowAlert, closeAlert } = this.props;

    const color: any = ({
      info: '#2ea5ff',
      warning: 'rgb(255, 204, 46)',
      error: 'red',
    } as any)[type];

    return (
      <div onClick={closeAlert} style={{ display: isShowAlert ? 'flex' : 'none' }} className={b()}>
        <div className={b('message')}>
          <div className={b('message-icon')}>
            <div style={{ color, borderColor: color }}>
              {type === 'error' || type === 'warning' ? '!' : 'i'}
            </div>
          </div>
          <div className={b('message-content')}>
            {message}
          </div>
        </div>
      </div>
    );
  }

}

const AlertsWrapper = connect(mapStateTopProps, mapDispatchToProps)(Alerts);

export interface IProps {
  onlyContent?: boolean;
  section?: string;
}

class Layout extends React.PureComponent<IProps, {}> {
  private b = block('layout');

  public render() {
    const b = this.b;
    const { children, onlyContent, section } = this.props;
    return (
      <div className={b()}>
        {!onlyContent ? <Header /> : null}
        <div className={b('content')}>
          <div className={b('sidebar')}>
            <Menu section={section} />
          </div>
          <div className={b('description')}>
            {children}
          </div>
        </div>
        {!onlyContent ? <Footer /> : null}
        <AlertsWrapper />
      </div>
    );
  }
}

export default Layout;
