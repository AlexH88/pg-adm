import * as React from 'react';
import {block} from 'bem-cn';
import './style.styl';

interface IProps {
  dataField: string;
  dataFormat?: Function;
  isSortable?: boolean;
  align?: 'left' | 'right';
  formatter?: <T>(value: string, row: T) => string | number | JSX.Element | null | boolean | undefined;
  sorted?: 'asc' | 'desc';
  autoWidth?: boolean;
}

class TableHeader extends React.PureComponent<IProps, {}> {
  public static defaultProps = {
    align: 'left',
  };
  private b = block('table-header');
  public render() {
    const b = this.b;
    const { children, sorted, isSortable, align } = this.props;
    return (
      <div className={b({ 'is-sortable': isSortable, align })}>
        {children}
        {
          isSortable
          ? (
            <span
              className={
                b('sort', {
                  asc: sorted && sorted === 'asc',
                  desc: sorted && sorted === 'desc',
                })}
            />
          )
          : null
        }
      </div>
    );
  }

}

export { IProps };
export default TableHeader;
