import React, {FC, ReactElement} from 'react';

import cn from 'classnames';

import style from './TrU.module.styl';
//import { FileTreeNode, Folder, RESOURCE_TYPE } from '../../../store/folders/types';
//import { TableBodyConfig, FieldsColumns } from '../../../features/FileManager/types';

interface OwnProps {
  onDropNativeFiles?: (files: any, folders: any) => void;
  onDrag: Function;
  item: any;
  onRowClick: Function;
  config: any;
}

type Props = OwnProps;

const Tr: FC<Props> = (props): ReactElement<HTMLDivElement> | null => {
  const onDrop = (event: React.DragEvent): void => {
    event.preventDefault();
    const { item, onDropNativeFiles } = props;
    const { files } = event.dataTransfer;
    if (typeof onDropNativeFiles === 'function') {
      onDropNativeFiles(files, item);
    }
  };

  const onDragover = (event: React.SyntheticEvent): void => {
    event.preventDefault();
  };

  const {
    item: row,
    onRowClick,
    config
  } = props;

  return (
    <div
      className={style.item}
      onDrop={onDrop}
      onDragOver={onDragover}
      style={{
        cursor: 'pointer',
        display: 'flex'
      }}
      onClick={(e): void => onRowClick(e)}
    >
      {/*
      <div className={typeof config.selected === 'function' && config.selected(row) ? style['item-checkbox-selected'] : style['item-checkbox-deselected']}>
        {
          typeof config.showItemCheckbox === 'function' && typeof config.itemCheckbox === 'function'
          && config.showItemCheckbox(row)
          && config.itemCheckbox(row)
        }
      </div>
      */}

      {config.fields.map((field) => {
        const cellClassnames = cn(field.cellClassName, style['item-cell'], {
          [style['item-cell-action']]: field.name === 'actions',
          [style['item-cell-icon']]: field.name === 'icon',
          [style['item-cell-displayName']]: field.name === 'displayName',
          [style['item-cell-availableTo']]: field.name === 'availableTo'
        });

        return (
          <div
            className={cellClassnames}
            key={field.name}
            style={field.style}
          >
            <div
              className={style['item-cell-insulation']}
            >
              {typeof field.render === 'function'
                ? field.render(row)
                : row[field.name]}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Tr;
