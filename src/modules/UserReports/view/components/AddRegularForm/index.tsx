import * as React from 'react';
import {block} from 'bem-cn';
import * as addIconTheme from './themes/addIcon.styl';
import * as substractIconTheme from './themes/substractIcon.styl';
// import { Checkbox } from 'shared/view/elements';
import {connect} from 'react-redux';
import {bind} from 'decko';
import {IReduxState} from 'shared/types/app';
import {Button, Dropdown, IDropdownProps, ITextInputProps, TextInput} from 'shared/view/elements';
import {formatGroup} from 'shared/helpers/reduxFormFormatters';
import {validate} from 'shared/helpers/validators/validateRegularForm';
import {IPolicy} from 'shared/types/policy';
import {Field, FieldArray, FormProps, reduxForm, WrappedFieldProps} from 'redux-form';
import {orderBy, timePeriods} from '../../../configs';
import {Namespace as FilterNamespace} from 'features/filterResource';

import './style.styl';

// import { convertDataForMultiselect } from "../../../../../shared/helpers/formatData";

interface IOwnProps {
  onCancel(): void;
  onSave(): void;
  labelName: string;
  data: string;
  type: string;
}

interface IStateProps {
  filtersData: FilterNamespace.IResourceReduxState;
  initialValues: any;
}

const formName = 'add_regular';

function mapStateToProps(state: IReduxState, ownProps: IOwnProps): IStateProps {
  return {
    filtersData: state.filterResource[ownProps.data],
    initialValues: {
      'type': ownProps.type,
      'filters' : {},/*state.filterResource[ownProps.data].filters,*/
    }
  };
}

const b = block('add-regular');

type TypeFormProps = FormProps<IPolicy, IOwnProps, {}> & IOwnProps & IStateProps;

@reduxForm<IPolicy, IOwnProps, {}>({
  form: formName,
  validate,
  enableReinitialize : true
})

class AddRegularForm extends React.PureComponent<TypeFormProps, {}> {


  public render() {
    const { invalid, pristine, error, filtersData/*, labelName */} = this.props;
    const printerGroup = filtersData.filterConfigs.printergroup;
		/*format={this.formatType}*/
    /*filtersData.filterConfigs.type*/
    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <span hidden>
          <Field
            label="type"
            name="type"
            component={this.renderInputField}
            type="text"
          />
          <Field
            label="filters"
            name="filters"
            component={this.renderInputField}
            type="text"
          />
          {/*<Field*/}
            {/*format={this.formatGroup}*/}
            {/*value={filtersData.filterConfigs.usergroup}*/}
            {/*label={labelName}*/}
            {/*name="usergroup"*/}
            {/*component={this.renderInputField}*/}
            {/*type="text"*/}
            {/*disabled*/}
          {/*/>*/}
          <Field
            format={printerGroup ? this.formatGroup : null}
            value={printerGroup ? printerGroup : filtersData.filterConfigs.printer}
            label="Принтеры"
            name={printerGroup ? 'printergroup' : 'printer'}
            component={this.renderInputField}
            type="text"
            disabled
          />
        </span>
        <Field label="Период выпуска" name="period" component={this.renderActionField} type="text"/>
        {/*<Field label="По цене" name="price" component={this.renderCheckbox} type="checkbox"/><br/>*/}
        {/*<Field label="По количеству заданий" name="jobs" component={this.renderCheckbox} type="checkbox"/><br/>*/}
        {/*<Field label="По количеству страниц" name="page" component={this.renderCheckbox} type="checkbox"/>*/}
        <Field label="Сортировать по" name="order_by" component={this.renderOrderByField} />
        <FieldArray name="emails" component={this.renderEmails}/>
        <span className={b('general-error')}>{error}</span>
        <div className={b('footer')}>
          <Button
            label="Отмена"
            onClick={this.handleCancel}
          />
          <Button
            label="Сохранить отчет"
            disabled={invalid || pristine}
            type="submit"
            isPrimary
          />
        </div>
      </form>
    );
  }

  @bind
  private formatGroup(_: string, name: string): string {
    const { filtersData } = this.props;
    return formatGroup(filtersData, name);
  }

  // @bind
  // private formatType(_: string, name: string): string {
  //   const { filtersData } = this.props;
  //   return formatType(filtersData, name);
  // }

  @bind
  private renderActionField(field: WrappedFieldProps<{}> & IDropdownProps) {
    return (
      <Dropdown
        {...field}
        {...field.input}
        source={timePeriods}
      />
    );
  }

  @bind
  private renderOrderByField(field: WrappedFieldProps<{}> & IDropdownProps) {
    return (
      <Dropdown
        {...field}
        {...field.input}
        source={orderBy}
      />
    );
  }

  @bind
  private renderEmails({ fields }: any) {
    return (
      <div className={b('emails-fields')}>
        <Field label="E-mail" name="first-email" component={this.renderInputField} type="text"/>
        {fields.map((email: string, index: number) =>
          <div key={index} className={b('email-wrapper')}>
            <Field label="E-mail" name={`${email}.email`} component={this.renderInputField} type="text"/>
            <Button label="" theme={substractIconTheme} onClick={this.removeEmailField.bind(this, fields, index)} />
          </div>,
        )}
        <div className={b('add-email-wrapper')}>
          <Button
            label="Добавить email"
            theme={addIconTheme}
            isPrimary
            onClick={this.addEmailField.bind(this, fields)}
          />
        </div>
      </div>
    );
  }

  @bind
  private removeEmailField(fields: any, index: number) {
    fields.remove(index);
  }

  @bind
  private addEmailField(fields: any) {
    fields.push({});
  }

  @bind
  private renderInputField(field: WrappedFieldProps<{}> & ITextInputProps) {
    const { touched, error } = field.meta;
    return (
      <TextInput
        {...field.input}
        {...field}
        value={field.val}
        error={touched && error ? error : false}
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

    // @bind
    // private renderCheckbox(field: WrappedFieldProps<{}> & ICheckboxProps) {
    //     return (
    //         <Checkbox
    //             {...field}
    //             {...field.input}
    //         />
    //     );
    // }

}

export { AddRegularForm };
export default connect<{}, {}, IOwnProps >(mapStateToProps, {})(AddRegularForm);
