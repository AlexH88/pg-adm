import * as React from 'react';
import {block} from 'bem-cn';
import CurrencyInput from 'react-currency-input';
import './style.styl';

interface IOwnProps {
  label: string;
  disabled?: boolean;
  value: string;
  prefix: string;
  onChange(e: React.FormEvent<HTMLInputElement>): void;
}

class Currency extends React.Component<IOwnProps, {}> {

  private b = block('currency-wrapper');

  public render() {
    const b = this.b;
    const { label, value, onChange, prefix, disabled } = this.props;
    return (
      <div className={b({disabled: disabled})}>
        <span className={b('label')}>{label}</span>
        <div className={b('frame')}>
          <CurrencyInput
            value={value}
//            prefix={prefix}
            prefix={ Number(value) < 0 ? `-${prefix}` : `${prefix}` }
            onChange={onChange}
          />
          <div className={b('bar')}/>
        </div>
      </div>
    );
  }
}

export default Currency;
