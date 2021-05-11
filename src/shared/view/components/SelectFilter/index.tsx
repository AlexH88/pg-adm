import * as React from 'react';
import {block} from 'bem-cn';
import {bind} from 'decko';
import Dropdown from 'shared/view/components/StatefulDropdown';
import {convertSourceToOptionData} from 'shared/helpers/formatData';
import './style.styl';
import {IconButton} from 'shared/view/elements';
import CloseIcon from './closeIcon';

interface ISource {
  id: number;
  name: string;
  label: string;
  isChecked: boolean
}

interface IOwnProps {
  label: string;
  value?: string;
  source?: ISource[];
  disabled?: boolean;
  required?: boolean;
  type?: string;
  maxLength?: number;
  onChange?: (value: string) => void;
  acceptFilter: () => void;
  onRemove?(): void;
}

class SelectFilter extends React.PureComponent<IOwnProps, {}> {

  private b = block('select-filter');

  public render() {
    const b = this.b;
    const {
      label,
      value,
      onRemove,
      source = []
    } = this.props;

    return (
      <div className={b()}>
        <Dropdown
          label={label}
          source={convertSourceToOptionData(source)}
          onChange={this.onChange}
          value={value ? value : ''}
        />
        {
          onRemove
            ? (
              <div className={b('button-rem')}>
                <IconButton
                  onClick={onRemove}
                  icon={<CloseIcon/>}
                />
              </div>
            )
            : null
        }
      </div>
    );
  }

  @bind
  private onChange(value: string) {
    const { onChange, acceptFilter } = this.props;
    if (onChange) { onChange(value); };
    acceptFilter();
  }
}

export default SelectFilter;
