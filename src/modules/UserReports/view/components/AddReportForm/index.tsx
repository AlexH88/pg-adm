import * as React from 'react';
import {block} from 'bem-cn';

import {connect} from 'react-redux';
import {bind} from 'decko';
import {IReduxState} from 'shared/types/app';
import {Button, Dropdown, IDropdownProps, ITextInputProps, TextInput} from 'shared/view/elements';
import {validate} from 'shared/helpers/validators/validatePolicy';
import {IPolicy} from 'shared/types/policy';
import {Field, FormProps, formValueSelector, reduxForm, WrappedFieldProps} from 'redux-form';
import {typesDiagram} from '../../../configs';

import './style.styl';

interface IOwnProps {
  onCancel(): void;
  onSave(): void;
  labelName: string;
  isDynamic?: boolean;
}

interface IStateProps {
  days: string;
  hours: string;
  userGroupsForm: string[];
  printerGroupsForm: string[];
}

const selector = formValueSelector('add_report');

function mapStateToProps(state: IReduxState): IStateProps {
  return {
    days: selector(state, 'days') as string,
    hours: selector(state, 'hours') as string,
    userGroupsForm: selector(state, 'usergroups') as string[],
    printerGroupsForm: selector(state, 'printergroups') as string[],
  };
}

const b = block('add-report');

type TypeFormProps = FormProps<IPolicy, IOwnProps, {}> & IOwnProps & IStateProps;

@reduxForm<IPolicy, IOwnProps, {}>({
  form: 'add_report',
  validate,
})

class AddReportForm extends React.PureComponent<TypeFormProps, {isChecked?:any}> {

  constructor(props: any) {
    super(props);
    this.state = {
      isChecked: false
    };
  }

  public render() {
    const { invalid, pristine, error, labelName, isDynamic } = this.props;

    return (
        <form onSubmit={this.handleSubmit} className={b()} >
        {
          !isDynamic &&
          <Field label={labelName} name="amount_users" component={this.renderInputField} type="number"/>          
        }
          {/*<Field onChange={this.toggleChange} label="Диаграмма" name="diagram" component={this.renderCheckbox} type="checkbox"/>*/}
          {
            this.state.isChecked ?
                <Field label="Тип диаграммы" name="type" component={this.renderActionField}/>
                :
                null
          }
          <span className={b('general-error')}>{error}</span>
          <div className={b('footer')}>
            <Button
                label="Отмена"
                onClick={this.handleCancel}
            />
            <Button
                label="Сохранить отчет"
                disabled={isDynamic ? false : invalid || pristine}
                type="submit"
                isPrimary
            />
          </div>
        </form>
    );
  }

  // @bind
  // private renderCheckbox(field: WrappedFieldProps<{}> & ICheckboxProps) {
  //   return (
  //       <Checkbox
  //           {...field}
  //           {...field.input}
  //       />
  //   );
  // }

  @bind
  private renderActionField(field: WrappedFieldProps<{}> & IDropdownProps) {
    return (
        <Dropdown
            {...field}
            {...field.input}
            source={typesDiagram}
        />
    );
  }

  @bind
  private renderInputField(field: WrappedFieldProps<{}> & ITextInputProps) {
    const { touched, error } = field.meta;
    return (
        <TextInput
            {...field.input}
            {...field}
            error={touched && error ? error : false}
        />
    );
  }

  @bind
  private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    // if (!1) console.log(event);
    this.props.onSave();
  }

  @bind
  private handleCancel(): void {
    this.props.onCancel();
  }

  // @bind
  // private toggleChange(): void {
  //   this.setState({
  //     isChecked: !this.state.isChecked,
  //   });
  // }

}

export { AddReportForm };
export default connect<{}, {}, IOwnProps >(mapStateToProps, {})(AddReportForm);
