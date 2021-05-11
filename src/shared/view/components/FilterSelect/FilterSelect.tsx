import * as React from 'react';
import {block} from 'bem-cn';
import {CheckboxMultiselect} from 'shared/view/elements';
import './FilterSelect.styl';
import i18next from "i18next";

interface IValues {
  id: number;
  name: string;
}

interface IHeader {
  name: string;
  type: string;
  isConnected: boolean;
  values?: IValues[];
  title: string;
}

interface IProps {
  headers: IHeader[];
  onChange: (value: string, isCheck: boolean) => void;
  disabledValidator?(headers: IHeader[]): string[];
}

class FilterSelect extends React.Component<IProps, {}> {

  private b = block('filter-select');

  public render() {
    const b = this.b;
    const { headers, onChange } = this.props;
    const value = headers
      .filter(header => header.isConnected)
      .map(header => header.name);
    const sources = this.getValues(headers);
    return (
      <div className={b()}>
        <div className={b('multiselect')}>
          <CheckboxMultiselect
            values={sources}
            title={i18next.t('FilterSelect.addFilter')}
            selectedValues={value}
            onChange={onChange}
          />
        </div>
      </div>
    );
  }

  private getValues(values: IHeader[]) {
    const { disabledValidator } = this.props;
    let disabledFilters = [] as string[];
    if (disabledValidator) {
      disabledFilters = disabledValidator(values);
    }
    return values.map(item => ({ value: item.name, title: item.title, disabled: disabledFilters.includes(item.name) }));
  }

}

export default FilterSelect;
