import * as React from 'react';
import {block} from 'bem-cn';
import {bind} from 'decko';
import Multiselect from 'shared/view/elements/Multiselect/Multiselect';
import Chip from 'react-toolbox/lib/chip';
import './style.styl';
import * as chip from './chip.styl';
import i18next from "i18next";

interface ISource {
  [value: string]: string;
}

interface IOwnProps {
  label: string;
  value?: string[];
  source?: ISource;
  disabled?: boolean;
  required?: boolean;
  type?: string;
  param?: string;
  maxLength?: number;
  getOptions?: (value: string, filterName: string) => void;
  onChange?: (e: any) => void;
}

class MultiSelectField extends React.PureComponent<IOwnProps, {}> {
  state = {
    stringValue: '',
    source: this.props.source
  };

  private b = block('multi-select-field');

  public render() {
    const b = this.b;
    const {
      label,
      value = [], 
      source = {},
      disabled = false
    } = this.props;

    let strLabel = `Группы ${label}`;
    let chipLabel = `По умолчанию выбраны все группы`;
    let multiselectLabel = `Добавить группу ${label}`;
    if(label == 'Полномочия*') {
      strLabel = 'Полномочия*';
      chipLabel = 'Выберите полномочия';
      multiselectLabel = 'Полномочия*';
    }
    if(label == 'Email адрес') {
      strLabel = '';
      chipLabel = 'Email адрес';
      multiselectLabel = 'Email адрес'
    }

    return (
      <div className={b()}>
        <div className={b('subwrapper')}>
          <div className={b('header')}>
            {/*`Группы ${label}`*/}
            { strLabel }
          </div>
          <div className={b('chipwrapper')}>
            {value && value.length
              ? value.map((item) => (
                  <div key={item} className={b('chip-item')}>
                    <Chip
                      theme={chip}
                      deletable
                      onDeleteClick={this.deleteMultiFilterValue.bind(this, item)}
                    >
                      {source[item]}
                    </Chip>
                  </div>
                )
              )
              : (
                <div className={b('chip-item')}>
                  <Chip theme={chip}>
                    {
                     chipLabel
                    }
                  </Chip>
                </div>
              )
            }
          </div>
        </div>
        <div className={b('subwrapper')}>
          <Multiselect
            label={ multiselectLabel }
            onChange={this.onChange}
            onQueryChange={this.getOptions}
            source={source}
            value={value!}
            disabled={disabled}
          />
        </div>
      </div>
    );
  }

  @bind
  private onChange(newVal: any) {
/*
    const { onChange, source, value = [], label } = this.props;

    let { stringValue } = this.state;
    let newSource = this.state.source
    newSource[stringValue] = stringValue;
    this.setState({source: newSource})

    let newList: any;
    if(label == 'Email адрес') {
      if (onChange && source) {
        let t = []
        if(stringValue != '' && stringValue.length != 0){
          t.push(stringValue)
        }
        newList = new Set([...value, ...newVal, ...t]);
        const arr = Array.from(newList).filter(item => item != '')
        onChange(arr);
      };
    } else {
      if (onChange && source) {
        newList = new Set([...value, ...newVal]);
        onChange(Array.from(newList));
      };
    }
*/
    const {
      onChange,
      source,
      value = []
    } = this.props;

    let newList: any;
    if (onChange && source) {
      newList = new Set([...value, ...newVal]);
//      onChange(Array.from(newList));
      onChange(Array.from(newList).filter(el => el !=''));
    };
  }

  @bind
  private deleteMultiFilterValue(id: string) {
    const { onChange, value = [] } = this.props;

    const newValue = [...value];
    newValue.splice(newValue.indexOf(id), 1);
    if (onChange) { onChange(newValue); };
  }

  @bind
  private getOptions(searchString: string) {
    //const { label } = this.props;
    //if(label == 'Email адрес'){
    //  this.setState({stringValue: searchString})
    //}

    //const { getOptions } = this.props;
    //if (getOptions) { getOptions(searchString, 'name'); }
  }
}

export default MultiSelectField;
