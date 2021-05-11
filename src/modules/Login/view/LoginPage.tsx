import * as React from 'react';
import {bind} from 'decko';
import {block} from 'bem-cn';
import {connect} from 'react-redux';
//import { IReduxState } from '../namespace/index';
import {IReduxState} from 'shared/types/app';
import {bindActionCreators} from 'redux';
import {Redirect, RouteComponentProps, withRouter} from 'react-router-dom';
import {Field, FormProps, reduxForm, WrappedFieldProps} from 'redux-form';
import {Button, ITextInputProps, TextInput} from 'shared/view/elements';
import injectResource from 'shared/helpers/injectResource';
import { actions as loginActions } from '../redux';
import { validate } from 'shared/helpers/validators/validatePolicy';
import './LoginPage.styl';
import * as logo from './images/logo.png';
import i18next from "i18next";

interface ILogin {
  username: string;
  password: string;
}

interface IDispatchProps {
  authorize: typeof loginActions.authorize;
  setServerData: typeof loginActions.setServerData;
  loadAuthorities: typeof loginActions.loadAuthorities;
}

interface IStateProps {
  loginError: boolean;
}

interface IRouterProps {
  history: any;
}

function mapStateToProps(state: IReduxState): IStateProps {
  const { loginError } = state.login;
  return {
    loginError
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    authorize: injectResource('login', loginActions.authorize),
    setServerData: injectResource('login', loginActions.setServerData),
//    loadAuthorities: injectResource('login', loginActions.loadAuthorities),
    loadAuthorities: loginActions.loadAuthorities,
  }, dispatch);
}

const b = block('auth-box-in');

type TypeFormProps = FormProps<ILogin, {}, {}> & RouteComponentProps<IRouterProps> & IDispatchProps & IStateProps;
//type TypeFormProps = FormProps<ILogin, {}, {}> & IDispatchProps & IStateProps;

@reduxForm<ILogin, {}, {}>({
  form: 'logIn',
  // validate
})



class Login extends React.PureComponent<TypeFormProps, {}> {
  @bind
  private onSubmit(event: any) {
    let { from } = this.props.location.state as any || { from: { pathname: "/home" } };
//    let { from } = this.props.location.state as any || { from: { pathname: "/status" } };
    event.preventDefault();
    const { authorize, loadAuthorities } = this.props;
    authorize(from.pathname);
  }

  public render() {
    const { loginError, invalid, pristine } = this.props;

    const credentials: any = localStorage.getItem('userCredentials');

    if (
      credentials !== null
      && JSON.parse(credentials).access_token.length !== 0
      && JSON.parse(credentials).refresh_token.length !== 0
    ) {
        return <Redirect to='/home' />;
//        return <Redirect to='/status' />;
    }

    return (
        <div className="reg-wrap">
          <div className="auth-box">
            <div className={b()}>
              <div className={b('logo')}>
                <img className={b('logo-img')} src={logo} alt="PrinterGuard"/>
                <span className={b('logo-title')}>PrinterGuard</span>
              </div>
              <form onSubmit={this.onSubmit}>
                <div className={b('fields')}>
                  <Field
                    label={i18next.t('LoginForm.login')}
                    name="username"
                    component={this._renderInputField}
                    type="text"
                  />
                  <Field
                    label={i18next.t('LoginForm.password')}
                    name="password"
                    component={this._renderInputField}
                    type="password"
                  />

                  {loginError && (
                    <span className="error-message">
                      {i18next.t('LoginForm.errorMessage')}
                    </span>
                  )}
                </div>

                <div className={b('button')}>
                  <Button
                    label={i18next.t('LoginForm.comeIn')}
                    disabled={invalid || pristine}
                    type="submit"
                    isPrimary
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
    );
  }

  @bind
  private _renderInputField(field: WrappedFieldProps<{}> & ITextInputProps) {
    const { touched, error } = field.meta;
    return (
      <TextInput
        {...field.input}
        {...field}
        error={touched && error ? error : false}
      />
    );
  }
}

export { Login };
export default withRouter(connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(Login));
//export default connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(Login);
