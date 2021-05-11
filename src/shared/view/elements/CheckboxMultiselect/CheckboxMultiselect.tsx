import * as React from 'react';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {Card} from 'react-toolbox/lib/card';
import {Checkbox} from 'shared/view/elements';
import './CheckboxMultiselect.styl';
import * as cardTheme from './cardTheme.styl';

export interface IValue {
  value: string;
  title: string;
  disabled?: boolean;
  required?: boolean;
}

interface IOwnProps {
  title: string;
  values: IValue[];
  selectedValues: string[];
  onChange: (value: string, isCheck: boolean) => void;
  onOpenChange?(opened: boolean): void;
}

interface IState {
  isShow: boolean;
}

class CheckboxMultiselect extends React.PureComponent<IOwnProps, IState> {
  public state = {
    isShow: false,
  };

  private b = block('checkbox-multiselect-wrapper');

  public render() {
    const b = this.b;
    const { title, values, onChange } = this.props;
    const { isShow } = this.state;

    const disabled = values.length === 0;

    return (
      <div className={b()} >
        <div
          className={isShow ? b('button-dark') : b('button')}
          style={disabled ? { color: '#bbb' } : { }}
          onClick={disabled ? () => {} : this.togglePopover}
        >
          {title}
          <span className={b('expander')} />
        </div>

        <div className={b('popover', { activated: isShow })}>
          <Card theme={cardTheme}>
            {
              values.map((value: IValue, index) => !value.required
                ? (
                  <div key={index} className={b('checkbox')}>
                    <Checkbox
                      label={value.title}
                      disabled={value.disabled || false}
                      littleStyle
                      onChange={onChange.bind(this, value.value)}
                      checked={this.isChecked(value)}
                    />
                  </div>
                ) : null)
            }
          </Card>
        </div>
        {isShow && <div onClick={this.togglePopover} className={b('overlay')}/>}
          </div>
    );
  }

  @bind
  private isChecked(value: IValue) {
    const { selectedValues } = this.props;
    return Boolean(selectedValues.find(foundValue => foundValue === value.value));
  }

  @bind
  private togglePopover() {
    this.setState((prevState) => {
      const isShow = !Boolean(prevState.isShow);

      if (this.props.onOpenChange) {
        this.props.onOpenChange(isShow);
      }

      return { isShow };
    });
  }
}

export default CheckboxMultiselect;
