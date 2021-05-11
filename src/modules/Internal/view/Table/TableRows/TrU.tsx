import React, { ReactElement, FC } from 'react';

import cn from 'classnames';

import style from './TrU.styl';

interface OwnProps {
  item: any;
  config: any;
  itemIndex: number;
}

const Tr: FC<OwnProps> = (props): ReactElement<HTMLDivElement> | null => {
  const {
    item: row,
    config,
    itemIndex,
  } = props;

  return (
    <div
      className={style.item}
      style={{
        cursor: 'pointer',
        display: 'flex'
      }}
    >
      {config.showHeaderCheckbox() && (
        <div className={style['item-checkbox']}>
          {config.showItemCheckbox(row) && config.itemCheckbox(row)}
        </div>
      )}

      {config.fields.map((field: any) => {
        const cellClassnames = cn(field.cellClassName, style['item-cell'], {
          [style['item-cell-action']]: field.name === 'actions',
          [style['item-cell-displayName']]: field.name === 'displayName',
        });

        return (
          <div
            className={cellClassnames}
            key={field.name}
            style={field.style}
          >
            {typeof field.render === 'function'
              ? field.render(row, itemIndex)
              : row[field.name]}
          </div>
        );
      })}
    </div>
  );
};

export default Tr;
