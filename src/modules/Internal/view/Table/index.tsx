import React, { ReactElement, FC } from 'react';

import cn from 'classnames';

import TrU from './TableRows/TrU';

import style from './UserFileFolderTable.styl';

interface Props {
  config?: any;
  data: any[];
}

const UserFileFolderTable: FC<Props> = (props): ReactElement<HTMLDivElement> => {
  const {
    config,
    data,
  } = props;

  const renderItemsList = (items: any[]): Array<ReactElement<HTMLDivElement>> => {
    return items.map((item: any, index: number) => (
      <TrU
        key={item.oidFormula}
        item={item}
        itemIndex={index}
        config={config}
      />
    ));
  };

  let content = <div />;

  if (data.length === 0) {
    content = (
      <div className={style['file-manager-empty']}>
        {config.emptyInfo()}
      </div>
    )
  } else {
    content = (
      <>
        <div>
          <div className={style.header}>
            {config.showHeaderCheckbox() && (
              <div className={style['header-checkbox']}>
                {config.headerCheckbox()}
              </div>
            )}
            {config.fields.map((field: any) => {
              const headerClassnames = cn(field.headerClassName, style['header-cell'], {
                [style['header-cell-action']]: field.name === 'actions'
              });

              return (
                <div
                  className={headerClassnames}
                  key={field.name}
                  style={field.style}
                >
                  {typeof field.header === 'function' ? field.header() : field.header}
                </div>
              );
            })}
          </div>
          <div className={style.items}>
            {renderItemsList(data)}
          </div>
        </div>
      </>
    )
  }

  return (
    <div className={style['file-manager']}>
      <div className={style['file-manager-content']}>
        {content}
      </div>
    </div>
  );
};

export default UserFileFolderTable;
