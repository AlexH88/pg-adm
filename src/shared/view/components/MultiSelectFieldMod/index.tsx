import * as React from 'react';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {IconButton, TextInput} from 'shared/view/elements';
import Chip from 'react-toolbox/lib/chip';
import './style.styl';
import * as chip from './chip.styl';
import * as textfield from './textfield.styl';
import AddIcon from './addIcon';

//interface ISource {
//  [value: string]: string;
//}

interface IOwnProps {
  label: string;
  value?: string[];
  //source?: ISource;
  disabled?: boolean;
  required?: boolean;
  type?: string;
  param?: string;
  maxLength?: number;
  //getOptions?: (value: string, filterName: string) => void;
  onChange?: (e: any) => void;
}

class MultiSelectField extends React.PureComponent<IOwnProps, {}> {
  state = {
    currentInputValue: ''
  }

  private b = block('multi-select-field');

  public render() {
    const b = this.b;
    const {
      label,
      value = []
    } = this.props;
    
    return (
      <div className={b()}>
        {/*
        <div className={b('header')}>
          {label}
        </div>
        */}

        <div
          //className={b('subwrapper')}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            //border: '1px solid blue'
          }}
        >
          <div
            //className={b('subwrapper')}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              //border: '1px solid red',
              flex: '0 0 250px'
            }}
          >
            {/*
            <Multiselect
              label={`Добавить группу ${label}`}
              onChange={this.onChange}
              onQueryChange={this.getOptions}
              source={source}
              value={value!}
            />
            */}
            <div
              style={{
                flex: '1 0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch'
              }}
            >
              <TextInput
                label={label}
                theme={textfield}
                //label={`Добавить значение`}
                onChange={this.onChange}
                value={this.state.currentInputValue}
                //error={touched && error ? error : false}
              />
            </div>
            <div
              style={{
                padding: '14px 0',
                marginBottom: '4px',
                marginLeft: '8px'
              }}
            >
              <IconButton
                onClick={() => { this.onAdd() }}
                icon={<AddIcon/>}
              />
            </div>
          </div>

          <div
            className={b('chipwrapper')}
            style={{
              flex: '1 0 auto'
            }}
          >
            {value && value.length
              ? value.map((item) => (
                  <div key={item} className={b('chip-item')}>
                    <Chip
                      theme={chip}
                      deletable
                      onDeleteClick={this.deleteMultiFilterValue.bind(this, item)}
                    >
                      {item}
                    </Chip>
                  </div>
                )
              )
              : (
                <div className={b('chip-item')}>
                  <Chip theme={chip}>
                    Пусто
                  </Chip>
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
  }

  @bind
  private onChange(input: React.FormEvent<HTMLInputElement>) {
    this.setState({ currentInputValue: input });
  }
  
  @bind
  private onAdd() {
    const {
      onChange,
      value = []
    } = this.props;

    const newVal = this.state.currentInputValue;

    let newList: any;
    if (onChange) {
      newList = new Set([...value, newVal]);
      onChange(Array.from(newList));
    };
    this.setState({ currentInputValue: '' });
  }

  @bind
  private deleteMultiFilterValue(id: string) {
    const { onChange, value = [] } = this.props;

    const newValue = [...value];
    newValue.splice(newValue.indexOf(id), 1);
    if (onChange) { onChange(newValue); };
  }
}

export default MultiSelectField;
