import * as React from 'react';
import {block} from 'bem-cn';
import {modulesLinks} from 'modules';
import MenuItem from './MenuItem';
import './Menu.styl';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions as showResourceActions} from '../../../../features/showResource/redux';
import i18next from "i18next";

import { actions as loginActions } from '../../../../modules/Login/redux';

interface IOwnProps {
  section?: string;
}

interface IDispatchProps {
  loadCurrentOperator: typeof showResourceActions.loadCurrentOperator;
  loadAuthorities: typeof loginActions.loadAuthorities;
}

interface IStateProps {
  currentOperator: any;
  authoritiesCurrent: [];
  serverRules: any;
  licenseBlockedAccessRules: string[];
}

function mapState(state: any): IStateProps {
  const currentOperator: any = state.showResource.currentOperator || {};

  return {
    currentOperator: currentOperator.access_rules,
    authoritiesCurrent: state.login.authoritiesCurrent,
    serverRules: currentOperator.server_rules,
    licenseBlockedAccessRules: state.settings.licenseData.blockedAccessRules
  };
}

function mapDispatch(dispatch: any): IDispatchProps {
  return bindActionCreators({
    loadCurrentOperator: showResourceActions.loadCurrentOperator,
    loadAuthorities: loginActions.loadAuthorities,
  }, dispatch);
}

let denied: any = { };

function mapRules(accessRules: any, serverRules?: any): any {
  let denied: any = {
    users: true,
    usergroups: true,
    catalogs: true,
    printers: true, // allprinters
    printergroups: true,
    hosts: true, // printservers
    journal: true,
    policies: true,
    reports: true,
    actions: true,
    errors: true,
    roles: true,
    operators: true,
    readers: true,
    report: true,
//    integration: true
  };

  let rules = {...accessRules};

  if (serverRules && Object.keys(serverRules).length > 0) {
    rules = {...accessRules, ...serverRules};
  }

  for (const key in rules) {
    // if rule.get is false all other methods should be hide as well
    if (rules.hasOwnProperty(key) && key.includes('.get') && rules[key]) {
      denied[key.replace('.get', '')] = false;
    } else if (key.includes('.get') && !rules[key]) {
      denied[key.replace('.get', '')] = true;
    }
  }
  return denied;
}

function mapper(module: any) {
  return {
    icon: module.icon,
    title: module.title,
    link : module.link,
    tag: module.tag,
    categories: module.categories && module.categories.length ? module.categories.map(mapper).filter(filterer) : [],
    turnedOff: module.turnedOff
  };
}

function filterer(module: any) {
  if (denied[module.link] || denied[module.link.replace('/', '')] || module.turnedOff) {
    return false;
  }

  if (module.categories && module.categories.length > 0) {
    return module.categories.filter(filterer);
  }

  return true;
}

function filterMainMenuItems(items: any): any[] {
  // filter according server admin_settings too
  return items.filter((item: any) => (
    item.categories.length !== 0
    || item.link === '/report' && !denied.report && !item.turnedOff
    || item.link === '/journal' && !denied.journal && !item.turnedOff
    || item.link === '/policies' && !denied.policies && !item.turnedOff
    || item.link === '/status' && !denied.status && !item.turnedOff
    // || item.link === '/reports' && !denied.reports && !item.turnedOff
  )); // ссылки без детей
}

class Menu extends React.PureComponent<IDispatchProps & IStateProps & IOwnProps, {}> {
  componentDidMount() {
    const {loadAuthorities} = this.props;
    loadAuthorities();
  }

  private b = block('menu');

  public componentWillReceiveProps(nextProps: IDispatchProps & IStateProps) {
    // if we change license we need to load currentOperator, we should reload currentOperator and update menu data
    let newLRules = nextProps.licenseBlockedAccessRules;
    let oldLRules = this.props.licenseBlockedAccessRules;
    if (
      this.props.currentOperator
      && oldLRules
      && newLRules
      && oldLRules.length > 0
      && newLRules.length !== oldLRules.length
    ) {
      this.props.loadCurrentOperator();
    }
  }

  public render() {
    const b = this.b;
    const { currentOperator, serverRules, section, authoritiesCurrent } = this.props;
    // mapRules according permissions in /current operator vs server admin_settings/
    denied = mapRules(currentOperator, serverRules);
    // console.log('denied: ', denied);

    const mappedModules = modulesLinks.map(mapper);
    const filteredModules = filterMainMenuItems(mappedModules.filter(filterer));

    const authoritiesArray = []
    if(authoritiesCurrent.length > 0) {
      authoritiesCurrent.map((module: any) => {
        authoritiesArray.push(module.tag)
      })

      authoritiesCurrent.forEach((module: any) => {
/*        if(module.tag == 'integration') {
          authoritiesArray.push('integration_email')
        }
*/
        if(module.tag == 'admin_management' && !authoritiesArray.includes('general') ) {
          authoritiesArray.push('general1')
        }
        if(module.tag == 'general' && !authoritiesArray.includes('admin_management') ) {
          authoritiesArray.push('general2')
        }
      })

      if(authoritiesArray.includes('general1') || authoritiesArray.includes('general2') ) {
        authoritiesArray.forEach((item, i) => {
          if(item == 'general') {
            delete authoritiesArray[i]
          }
        })
      }

    }

    let newModule1 = {
      title: i18next.t('SettingsLk.settings'),
      link: '/settings',
      icon: 'settings',
      tag: 'general1',
      categories: [
        {
          link: 'administration',
          title: i18next.t('SettingsLk.administration'),
          tag: 'admin_management',
          categories: [
            {
              link: 'roles',
              title: i18next.t('SettingsLk.roles'),
              tag: 'roles',
            },
            {
              link: 'operators',
              title: i18next.t('SettingsLk.operators'),
              tag: 'operators',
            },
          ],
        },
      ],
    };

    let newModule2 = {
      title: i18next.t('SettingsLk.settings'),
      link: '/settings',
      icon: 'settings',
      tag: 'general2',
      categories: [
        {
          link: 'blocked_printers',
          title: i18next.t('SettingsLk.blockedPrinters'),
          tag: 'blocked_printers',
        },
      ],
    };

    filteredModules.push(newModule1);
    filteredModules.push(newModule2)

    return (
      <div className={b()}>
        {
          filteredModules.map((module, index) => {
            if (
              (section === 'internal' && module.link !== '/internal')
              || (section !== 'internal' && module.link === '/internal')
            ) {
              return null;
            } else if(authoritiesArray.includes(module.tag) /*|| module.tag ==='status'*//*|| authoritiesArray.length == 0*/){
              return (
                <MenuItem
                  key={index}
                  link={module.link}
                  icon={module.icon}
                  title={module.title}
                  categories={module.categories}
                  turnedOff={module.turnedOff}
                />
              );
            }
        })
      }
      </div>
    );
  }
}

export { Menu };
export default connect<IStateProps, IDispatchProps, {} >(mapState, mapDispatch)(Menu);
