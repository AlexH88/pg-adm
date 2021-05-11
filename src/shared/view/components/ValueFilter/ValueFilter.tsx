import * as React from 'react';
import {block} from 'bem-cn';
import * as button from './button.styl';

import {Button, TextInput} from 'shared/view/elements';

import './ValueFilter.styl';

interface IOwnProps {
  label: string;
  value?: string;
  onChange(e: React.FormEvent<HTMLInputElement>): void;
  onAcceptFilter(): void;
  onRemoveFilter(): void;
}

class ValueFilter extends React.PureComponent<IOwnProps, {}> {

  private b = block('value-filter');

  public render() {
    const b = this.b;
    const { label, onChange, onAcceptFilter, onRemoveFilter, value } = this.props;
    return (
      <div className={b()}>
        <TextInput
          label={label}
          onChange={onChange}
          value={value || ''}
          onEnter={onAcceptFilter}
          onBlur={onAcceptFilter}
        />
        <div className={b('button')}>
          <Button label="ok" theme={button} onClick={onAcceptFilter}/>
        </div>
        <div className={b('button-rem')}>
          <Button label="x" theme={button} onClick={onRemoveFilter}/>
        </div>
      </div>
    );
  }
}

export default ValueFilter;
