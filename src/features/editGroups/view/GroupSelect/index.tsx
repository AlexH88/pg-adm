import * as React from 'react';
import {Button, Checkbox} from 'shared/view/elements';
import {block} from 'bem-cn';
import './GroupSelect.styl';
import * as btnTheme from './button.styl';
import {IGroup} from '../../namespace';
import i18next from "i18next";

interface IProps {
  values: IGroup[];
  onChange(id: number, isConnected: boolean): void;
  onClose(): void;
  onSave(): void;
  searchInput: string;
}

const b = block('group-select');
class GroupSelect extends React.PureComponent<IProps, {}> {
  public render() {
    const { values, onChange, onClose, onSave, searchInput } = this.props;
    return (
        <div className={b()}>
          <div className={b('container')}>
            {
              searchInput ?
              values.map((value: IGroup, index: number) => {
                if(value.name.toLowerCase().indexOf(searchInput.toLowerCase()) > -1){
                  return(
                    <div key={index} className={b('checkbox')}>
                      <Checkbox
                        isGreyTheme={value.isSomeConnected}
                        label={value.name}
                        checked={value.isConnected}
                        onChange={onChange.bind(this, value.id)}
                        disabled={value.ldapSource ? true : false}
                      />
                    </div>
                  )
                }
              }) :
              values.map((value: IGroup, index: number) => (
                <div key={index} className={b('checkbox')}>
                  <Checkbox
                    isGreyTheme={value.isSomeConnected}
                    label={value.name}
                    checked={value.isConnected}
                    onChange={onChange.bind(this, value.id)}
                    disabled={value.ldapSource ? true : false}
                  />
                </div>
              ))
            }
          </div>
          <div className={b('footer')}>
            <Button
              label={i18next.t('features.cancel')}
              theme={btnTheme}
              onClick={onClose}
            />
            <Button
              label={i18next.t('features.save')}
              theme={btnTheme}
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
