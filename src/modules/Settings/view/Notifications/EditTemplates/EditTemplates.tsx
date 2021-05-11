import * as React from 'react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import { IReduxState, ITemplate } from 'shared/types/app';
import { Field, reduxForm, WrappedFieldProps, FormProps, formValueSelector } from 'redux-form';
import { block } from 'bem-cn';
import { bind } from 'decko';
import { Button, Checkbox, ICheckboxProps, TextInput, ITextInputProps, IDropdownProps } from 'shared/view/elements';
import {Tabs} from 'shared/view/components';
import './EditTemlates.styl';
import { validate } from 'shared/helpers/validators/validateTemplatesEdition';
import StatefulDropdown from 'shared/view/components/StatefulDropdown';
import injectResource from 'shared/helpers/injectResource';
import ShowResourceActions from 'features/showResource/redux/actions';
import i18next from "i18next";
import HtmlEditor from '../HtmlEditor/HtmlEditor'
import MultiSelectField from 'shared/view/components/MultiSelectField';
import Dropdown from 'shared/view/components/StatefulDropdown';

interface IOwnProps {
  onCancel(): void;
  onSave(): void;
}

interface IStateProps {
  modalMode: any;
  body: string;
  enabled: boolean;
  destination: boolean;
  groupLeader: boolean;
  email: boolean;
  users?: any;
  scheduled: boolean;
}

interface IDispatchProps {
  loadResource: typeof ShowResourceActions.loadResource;
}

const b = block('edit-templates');

type IFormProps = FormProps<ITemplate, IOwnProps, {}> & IOwnProps & IStateProps & IDispatchProps;
const selector = formValueSelector('editTemplates');

function mapStateToProps(state: IReduxState): IStateProps {
  const modalMode = state.settings.modalMode || '';
  let users = [];
  if(state.hasOwnProperty('showResource')){
    if(state.showResource.hasOwnProperty('users')){
      if(state.showResource.users.hasOwnProperty('data')){
        if(state.showResource.users.data.hasOwnProperty('0')){
          users = state.showResource.users.data['0'];
        }
      }
    }
  }

  return {
    modalMode: modalMode,
    body: selector(state, 'body') as string,
    enabled: selector(state, 'enabled') as boolean,
    destination: selector(state, 'destination') as boolean,
    groupLeader: selector(state, 'groupLeader') as boolean,
    email: selector(state, 'email') as boolean,
    users: users,
    scheduled: selector(state, 'scheduled') as boolean,
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    loadResource: injectResource('users', ShowResourceActions.loadResource),
  }, dispatch);
}

@reduxForm<ITemplate, IOwnProps, {}>({
  form: 'editTemplates',
  validate,
})

class EditTemplates extends React.PureComponent<IFormProps , {}> {
  componentWillMount() {
    const { loadResource } = this.props;
    loadResource(false, false);
  }

  public render() {
    const { invalid, pristine, error, modalMode, body, users, destination, groupLeader, scheduled } = this.props;

    const objSource = {};
    users.forEach((item, i) => {
        objSource[item.email] = `${item.login} ${item.email}`;
    });

    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <Tabs>
          Предпросмотр
          <div dangerouslySetInnerHTML={this.createMarkup(body)} />
          Редактор
          <>
            <Field
              label="Активно"
              name="enabled"
              component={this._renderCheckboxField}
              type="checkbox"
            />
            <Field
              label="Название уведомления"
              name="title"
              component={this._renderField}
              type="text"
            />
            <Field
              label="Тема письма"
              name="subject"
              component={this._renderField}
              type="text"
            />

            <Field
              label="Тело письма"
              name="body"
              component={this._renderReader}
            />
          </>
          {
            destination && !scheduled
            ?
            [
              (
                <>Адресат</>
              ),
              (
                <>
                  <Field
                    label="Выбранный адрес"
                    name="email"
                    component={this._renderCheckboxField}
                    type="checkbox"
                  />
                  <Field
                    label="Email адрес"
                    name="emails"
                    component={(field: any) => this._renderDropdownField(field, objSource)}
                    type="text"
                  />
                  <Field
                    label="Руководитель группы"
                    name="sendToGroup"
                    component={this._renderCheckboxField}
                    type="checkbox"
                    disabled={groupLeader ? false : true}
                  />
                </>
              )
            ]
            : (destination && scheduled)
            ?
            [
              (
                <>Адресат</>
              ),
              (
                <>
                  <Field
                    label="Выбранный адрес"
                    name="email"
                    component={this._renderCheckboxField}
                    type="checkbox"
                  />
                  <Field
                    label="Email адрес"
                    name="emails"
                    component={(field: any) => this._renderDropdownField(field, objSource)}
                    type="text"
                  />
                  <Field
                    label="Руководитель группы"
                    name="sendToGroup"
                    component={this._renderCheckboxField}
                    type="checkbox"
                    disabled={groupLeader ? false : true}
                  />
                </>
              ),
              (
                <>Периодичность</>
              ),
              (
                <>
                  <Field
                    label="Период"
                    name="periodicity"
                    source={[
                      { value: 'HOURLY', label: `каждый час` },
                      { value: 'DAILY', label: `ежедневно` },
                      { value: 'WEEKLY', label: `еженедельно` },
                    ]}
                    defaultValue="DAILY"
                    component={this._renderDropdownFieldPeriod}
                  />
                </>
              )
            ]
            :
            (!destination && scheduled)
            ?
            [
              (
                <>Периодичность</>
              ),
              (
                <>
                  <Field
                    label="Период"
                    name="periodicity"
                    source={[
                      { value: 'HOURLY', label: `каждый час` },
                      { value: 'DAILY', label: `ежедневно` },
                      { value: 'WEEKLY', label: `еженедельно` },
                    ]}
                    defaultValue="DAILY"
                    component={this._renderDropdownFieldPeriod}
                  />
                </>
              )
            ]
            :
            null
          }

        </Tabs>
        <div className={b('footer')}>
          <Button
            label={i18next.t('EditOperators.cancel')}
            onClick={this.handleCancel}
          />
          <Button
            label={i18next.t('EditOperators.save')}
            disabled={invalid || pristine}
            type="submit"
            isPrimary
          />
        </div>
      </form>
    );
  }

  @bind
  private createMarkup( htmlString) {
    return { __html: htmlString }
  }

  @bind
  private _renderReader(field: WrappedFieldProps<{}>) {
    return (
      <HtmlEditor field={field.input} />
    );
  }

  @bind
  private _renderCheckboxField(field: WrappedFieldProps<{}>&ICheckboxProps) {
    return (
      <div className={b('checkbox-wrapper')}>
        <Checkbox
          {...field.input}
          {...field}
        />
      </div>
    );
  }

  @bind
  private _renderField(field: WrappedFieldProps<{}>&ITextInputProps) {
    const { touched, error } = field.meta;
    return (
      <TextInput
        {...field.input}
        {...field}
        error={touched && error ? error : ''}
      />
    );
  }

  @bind
  private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    this.props.onSave();
  }

  @bind
  private handleCancel(): void {
    this.props.onCancel();
  }

  @bind
//  private _renderDropdownField(field: any, source: any) {
  private _renderDropdownField(field: WrappedFieldProps<{}> & IDropdownProps, source: any) {
    const { email } = this.props;
    const {
      input: {
        value,
        onChange,
        ...inputProps
      },
      label,
      ...fieldProps
    } = field;

    return (
      <MultiSelectField
        {...fieldProps}
        {...inputProps}
        onChange={onChange}
        value={value}
        source={source}
        getOptions={null}
        label={field.label}
        disabled={!email}
      />
    );
  }

  @bind
  private _renderDropdownFieldPeriod(field: any) {
    const { touched, error } = field.meta;

    return (
      <div className={b('dropdown-wrapper')}>
        <Dropdown
          {...field.input}
          {...field}
          error={touched && error ? error : null}
        />
      </div>
    );
  }

}

export { EditTemplates };
export default connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(EditTemplates);
