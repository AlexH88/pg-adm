import * as React from 'react';
import {block} from 'bem-cn';
import {connect} from 'react-redux';
import {push} from 'connected-react-router'
import {bindActionCreators} from 'redux';
import * as logo from './images/logo.png';
import * as avatar from './images/avatar.png';
import {actions as thisActions} from '../../../../modules/Settings/redux';
import {logout, changePassword, switchModalStatus} from 'modules/Login/redux/actions/communication';
import './Header.styl';
import { Modal } from 'shared/view/components';
import ChangePassword from './ChangePassword';

interface IDispatchProps {
  getLicenseInfo: typeof thisActions.getLicenseInfo;
  handleLogout: typeof logout;
  historyPush: typeof push;
  changePassword: typeof changePassword;
  switchModalStatus: typeof switchModalStatus;
}

interface IStateProps {
  currentOperator: any;
  stopDate: any;
  showModal: any;
}

function mapStateToProps(state: any) {
  const { currentOperator } = state.showResource;

  return {
    currentOperator,
    stopDate: state.settings.licenseData.stopDate,
    showModal: state.login.showModal
  };
}

function mapDispatchToProps(dispatch: any) {
    return bindActionCreators({
      getLicenseInfo: thisActions.getLicenseInfo,
      handleLogout: logout,
      switchModalStatus: switchModalStatus,
      changePassword: changePassword,
      historyPush: push
    }, dispatch);
}

/*****************helper */

function numDaysBetween(d1: Date, d2: Date) {
  const diff = Math.abs(d1.getTime() - d2.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
/*********** */

class Header extends React.PureComponent<IDispatchProps & IStateProps, {}> {
  private b = block('header');

  public state = {
    menu: false,
  }

  public componentDidMount() {
    this.props.getLicenseInfo();
  }

  public render() {

    const b = this.b;
    const {
      currentOperator = {},
      stopDate,
      handleLogout,
      changePassword,
      switchModalStatus,
      historyPush,
      showModal
    } = this.props;

    let diffDayTillLicenseStop = numDaysBetween(new Date(stopDate), new Date());
    let login = localStorage.getItem('currentUser') || ''

    return (
      <div className={b()}>
        <div className={b('title')}>
          {/*<img className={b('logo')} src={logo} />*/}
          {/* <img onClick={() => { historyPush('/status/status') }} className={b('logo')} src={logo} /> */}
          <img onClick={() => { historyPush('/status') }} className={b('logo')} src={logo} />

          <div className={b('name')}>PrinterGuard</div>
          {/*<span onClick={() => { history.push('/settings/about') }} className={b('about')}>О программе</span>*/}
          {/* ((new Date(stopDate)) >= new Date()) ?
            (
              diffDayTillLicenseStop < 30
                ? (
                  <span className={b('info-license')}>
                    <span className={b('info_icon')}></span>
                    <span className={'info_popup'}>У вас {diffDayTillLicenseStop > 1
                      ? `осталось ${diffDayTillLicenseStop} дн. `
                      : `остался ${diffDayTillLicenseStop} день ` } до истечения лицензии
                    </span>
                  </span>
                )
                : null
            )
            : (
              <span className={b('info-license')}>
                <span className={b('info_icon')} />
                <span className={'info_popup'}>Лицензия истекла</span>
              </span>
            )
          */}
        </div>
        
        <div className={b('user')}>
          <div className={b('user-link')}>
            <div className={b('avatar-wrapper')}>
              <img className={b('avatar')} src={avatar} />
            </div>
            <div className={b('username')} onClick={() => this.setState({ menu: !this.state.menu})}>{login}</div>
          </div>
        </div>

        {this.state.menu &&
          <div className={b('menu')}>
            <div className={b('logout')} onClick={() => switchModalStatus(true)}>Сменить пароль</div>
            <div className={b('logout')} onClick={() => handleLogout()}>Выйти</div>
          </div>
        }

        <Modal
          isOpen={showModal}
          title='Смена пароля'
          onClose={null}
        >
          <ChangePassword
            onSave={() => changePassword()}
            onCancel={() => switchModalStatus(false)}
          />
        </Modal>
        
      </div>
    );
  }
}

export default connect<IStateProps, IDispatchProps, {}>(mapStateToProps, mapDispatchToProps)(Header);
