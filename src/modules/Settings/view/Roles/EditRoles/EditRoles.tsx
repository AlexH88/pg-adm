import * as React from 'react';
import {connect} from 'react-redux';
import {IReduxState} from 'shared/types/app';
import {Field, FormProps, reduxForm, WrappedFieldProps} from 'redux-form';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {Button, Checkbox, ICheckboxProps, ITextInputProps, TextInput} from 'shared/view/elements';
import './EditRoles.styl';
import { IDropdownProps } from 'shared/view/elements';
import MultiSelectField from 'shared/view/components/MultiSelectField';
import {IRole, IRuleDescription} from 'modules/Settings/namespace';
import {validate} from 'shared/helpers/validators/validateRoleCreation';
import i18next from "i18next";

interface IOwnProps {
  onCancel(): void;
  onSave(): void;
}

interface IStateProps {
  rules: IRuleDescription[];
  currentOperator: any;
  authorities: [];
}

const b = block('edit-roles');

type IFormProps = FormProps<IRole, IOwnProps, {}> & IOwnProps&IStateProps ;

function mapStateToProps(state: IReduxState): IStateProps {
  return {
    rules: state.settings.ruleDescription,
    currentOperator: state.showResource.currentOperator,
    authorities: state.settings.authorities
  };
}
@reduxForm<IRole, IOwnProps, {}>({
  form: 'editRoles',
  validate,
})

class EditRoles extends React.PureComponent<IFormProps , {}> {

  public render() {
    const { invalid, pristine, error, rules, currentOperator, authorities } = this.props;
    let filteredCategoriesVsRules = this.filterCategoriesVsRules();
    const credentials = {}
    authorities.forEach(function(item, i) {
      credentials[item['orderPosition']] = item['description'];
    });

console.log('ERROR! - ', error)

    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <Field
          label="Название роли*"
          name="name"
          component={this._renderField}
          type="text"
        />
        <Field
          label="Описание роли"
          name="description"
          component={this._renderField}
          type="text"
        />
        <Field
          label="Полномочия*"
          name="authorities"
          value={credentials}
          component={(field: any) => this._renderDropdownField(field, credentials)}
        />
{/*
        <Field label="Описание" name="description" component={this._renderField} type="text" />
*/}
        {/*
        <span className={b('check-label')}> Правила доступа:</span>
        <div className={b('actions')}>
          <Button
            theme={addIconTheme}
            label="Разрешить всё"
            isPrimary
            onClick={this.addAll}
          />
          <div className={b('del')}>
            <Button
              theme={delIconTheme}
              label="Запретить всё"
              onClick={this.delAll}
              isPrimary
            />
          </div>
        </div>
        <div className={b('check-field')}>
          { filteredCategoriesVsRules.map(cat => (
            <div key={cat.categoryDisplayName} className={b('field-wrapper')} style={{marginBottom: '1em'}}>
              {//need to toggle plus to minus and use pure CSS to show/hide rules
                // input with empty name="" should not submit in form
                (
                  <label className={cat.rules.length > 1 ? b('tree-toggle') : ''}>
                    { cat.rules.length > 1 ? <input type="checkbox" className="input-hide" name="" /> : null }
                    { cat.rules.length > 1 ? <div className="custom-checkbox-tree"></div> : null }
                    { cat.rules.length > 1 ? <span>{ cat.categoryDisplayName }</span> : null }
                    <div className={"tree-toggle-children-list"}>
                      { //this div will be toggled according CSS rules as general sibling of .input-hide
                        cat.rules.map((rule: any) => {
                          return rule.children && rule.children.length > 1 ?
                            ( <div key={rule.name} className={b('field-wrapper')}
                                style={{padding: '0.5em 0 0.5em 1.75em'}}>
                                <label className={b('tree-toggle')}>
                                  <input type="checkbox" className="input-hide" name="" />
                                  <div className="custom-checkbox-tree"></div>
                                  <span>{ rule.displayNameTree }</span>
                                  <div className={"tree-toggle-children-list"}>
                                    {
                                      rule.children.map((r: any) => (
                                      <div key={r.name} className={b('field-wrapper')}
                                        style={{paddingLeft: '1.75em'}}>
                                        <Field
                                          label={ r.displayNameTree }
                                          name={r.name}
                                          component={this._renderCheckboxField}
                                          type="checkbox"
                                          value={true}
                                        />
                                      </div>
                                      ))
                                    }
                                  </div>
                                </label>
                              </div>
                            )
                            :
                            (
                              <div key={rule.name} className={b('field-wrapper')}
                                style={cat.rules.length > 1 ? {paddingLeft: '1.75em'} : {}}>
                                <Field
                                  label={ rule.children && rule.children.length === 1 ?
                                    rule.children[0].displayNameUniqueChild : rule.displayName
                                  }
                                  name={rule.name}
                                  component={this._renderCheckboxField}
                                  type="checkbox"
                                  value={true}
                                />
                              </div>
                            )
                          }
                        )
                      }
                    </div>
                  </label>
                )
              }
            </div>
            )
          )}
        </div>
        */}
        <span className={b('general-error')}>{error}</span>
        <div className={b('footer')}>
          <Button
            label={i18next.t('EditRoles.cancel')}
            onClick={this.handleCancel}
          />
          <Button
            label={i18next.t('EditRoles.save')}
            disabled={invalid || pristine}
            type="submit"
            isPrimary
          />
        </div>
      </form>
    );
  }

  @bind
  private _renderDropdownField(field: WrappedFieldProps<{}> & IDropdownProps, source: any) {
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
        getOptions={/*this.getOptions*/() => {}}
        label={field.label}
      />
    );
  }

  @bind
  filterCategoriesVsRules() {
    const { rules, currentOperator } = this.props;
    // let filteredRulesCO : any[] = []; // access rules of current operator that has true value
    let categories : any = {};
    let filteredCategoriesVsRules : any[] = [];
    let rulesToCheck = { ...currentOperator.access_rules };

    // if server_rules is not empty
    if(currentOperator.server_rules && Object.keys(currentOperator.server_rules).length > 0) {
      rulesToCheck = { ...currentOperator.access_rules, ...currentOperator.server_rules }
    }
    for (let key in rulesToCheck) {
      // if (currentOperator.access_rules[key]) {
        let rule = key.replace(/\./g, '--');
        // filteredRulesCO.push(rule);
        //split display name for separate category and rule names
        let fullRule : IRuleDescription | any = rules.find(r => r.name === rule);
        //check if displayName of rule has 2 words part like "Все принтеры" and if it has, split rule accordingly
        let arrayDisplayName = fullRule && fullRule.displayName && (fullRule.displayName.match(/[А-Я][а-я]+\s[а-я]+/g) &&
          fullRule.displayName.match(/[А-Я][а-я]+\s[а-я]+/g).length !== 0 ?
          fullRule.displayName.split(/([А-Я][а-я]+\s[а-я]+)/g).map((el: string) => el.trim())
          : fullRule.displayName.split(" "));

        if (fullRule) {
          let categoryDisplayName = arrayDisplayName && arrayDisplayName.length > 1 ? arrayDisplayName.shift() : arrayDisplayName[0];
          //"Отчёты" has a long phrase of 3 words rule, that should not be separated
          if (categoryDisplayName === 'Отчёты' || arrayDisplayName.length === 1) {
            fullRule.displayNameTree = arrayDisplayName.join(" ");
          } else {
            let displayNameUniqueChild = arrayDisplayName.join(" ");
            fullRule.displayNameTree = arrayDisplayName.shift();
            fullRule.children = [{ ...fullRule, displayNameUniqueChild, displayNameTree: arrayDisplayName.join(" ")}];
          }
          //use categories as hash/dictionary to filter
          if (!categories[categoryDisplayName]) {
            categories[categoryDisplayName] = true;
            filteredCategoriesVsRules.push({
              categoryDisplayName,
              rules: [{...fullRule}]
            });
          } else {
            filteredCategoriesVsRules.map(el => {
              if(el.categoryDisplayName === categoryDisplayName){
                el.rules = el.rules.concat(fullRule);
              }
              return el;
            });
          }
        // }
      }
    }
    // let newRules = rules; //rules.filter(r => filteredRulesCO.includes(r.name));
    filteredCategoriesVsRules.forEach(cat => {
      let rulesOld = [...cat.rules];
      let rules: any[] = [];
      let displayNameTreeArr: any = {};

      rulesOld.forEach((rule) => {
          if (!displayNameTreeArr[rule.displayNameTree]) {
            displayNameTreeArr[rule.displayNameTree] = true;
            rules.push(rule);
          } else {
            rules.map(r => {
              if (r.displayNameTree === rule.displayNameTree) {
                r.children = r.children.concat(rule.children);
              }
              return r;
            });
          }
      });
      cat.rules = rules;
    });
    // console.log('filteredCategoriesVsRules: ', filteredCategoriesVsRules);
    return filteredCategoriesVsRules;
  }

  @bind
  private _renderCheckboxField(field: WrappedFieldProps<{}>&ICheckboxProps) {
    return (
      <Checkbox
        {...field.input}
        {...field}
      />
    );
  }

  @bind
  private addAll() {
    const { rules, change } = this.props;
    rules.forEach((rule: IRuleDescription) => {
      if (change) {
        return change(rule.name, true);
      }
    });
  }

  @bind
  private delAll() {
    const { rules, change } = this.props;
    rules.forEach((rule: IRuleDescription) => {
      if (change) {
        return change(rule.name, false);
      }
    });
  }

  @bind
  private _renderField(field: WrappedFieldProps<{}>&ITextInputProps) {
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
    this.props.onSave();
  }

  @bind
  private handleCancel(): void {
    this.props.onCancel();
  }

}

export { EditRoles };
export default connect<IStateProps, {}, IOwnProps >(mapStateToProps, {})(EditRoles);
