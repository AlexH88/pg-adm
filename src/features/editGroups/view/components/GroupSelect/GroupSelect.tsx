import * as React from 'react';
import {Button, Checkbox} from 'shared/view/elements';
import {block} from 'bem-cn';
import './GroupSelect.styl';
import {IGroup} from '../../../namespace';
import i18next from "i18next";

interface IProps {
  values: IGroup[];
  onChange(id: number, isConnected: boolean): void;
  onClose(): void;
  onSave(): void;
}

const b = block('group-select');
class GroupSelect extends React.PureComponent<IProps, {}> {
  public render() {
    const { values, onChange, onClose, onSave } = this.props;
    return (
        <div className={b()}>
          <div className={b('container')}>
            {
              values.map((value: IGroup, index: number) => {
                return(
                  <div key={index} className={b('checkbox')}>
                    <Checkbox
                      isGreyTheme={value.isSomeConnected}
                      label={value.name}
                      checked={value.isConnected}
                      onChange={onChange.bind(this, value.id)}
                   />
                  </div>
                );
              })
            }
          </div>
          <div className={b('footer')}>
          <Button
            label={i18next.t('features.cancel')}
            onClick={onClose}
          />
          <Button
            label={i18next.t('features.save')}
            type="submit"
            isPrimary
            onClick={onSave}
          />
        </div>
        </div>
    );
  }

}
export default GroupSelect;
