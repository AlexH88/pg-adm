import React, {FC, ReactElement} from 'react';

import cn from 'classnames';
import TrU from './TableRows/TrU';
import SortControls from './SortControls';

import style from './Table.module.styl';

//import { Spinner } from '../../features/Spinners/views/spinner';
//import Pagination from '../elements/Pagination/pagination';
//import { TableBodyConfig, FieldsColumns } from '../../features/FileManager/types';
//import { FileTreeNode, Folder } from '../../store/folders/types';

interface Props {
  onRowClick: (folders: any, event: any) => void;
  onPageChange?: (e: any) => void;
  onSortChange?: (field: string, direction: string) => void;
  onDropNativeFiles?(files: any, folders: any): void;
  onDrag?: any;
  config?: any;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  sort?: any;
  showSpinner?: boolean;
  data: any[];
}

const UserFileFolderTable: FC<Props> = (props): ReactElement<HTMLDivElement> => {
  const {
    showSpinner = false,
    showPagination,
    currentPage,
    totalPages,
    sort,
    onPageChange,
    onSortChange,
    onDropNativeFiles,
    onDrag,
    config,
    onRowClick,
    data
  } = props;

  const renderItemsList = (items: any[]): ReactElement<HTMLDivElement>[] => {
    const chunks: any = [];
    let j = 0;
    let currentStreak = null;

    for (let i = 0; i < items.length; i += 1) {
      const selected = config && typeof config.selected === 'function' && config.selected(items[i]);
      if (currentStreak === null) {
        if (selected) {
          chunks[j]={ selected: [items[i]] };
          currentStreak = 'selected';
        } else {
          chunks[j]={ deselected: [items[i]] };
          currentStreak = 'deselected';
        }
      } else {
        if (selected) {
          if (currentStreak === 'selected') {
            chunks[j].selected.push(items[i]);
          } else if (currentStreak === 'deselected') {
            j += 1;
            chunks[j]={ selected: [items[i]] };
            currentStreak = 'selected';
          }
        } else {
          if (currentStreak === 'selected') {
            j += 1;
            chunks[j]={ deselected: [items[i]] };
            currentStreak = 'deselected';
          } else if (currentStreak === 'deselected') {
            chunks[j].deselected.push(items[i]);
          }
        }
      }
    }

    const chunksQuantity = chunks.length;

    return chunks.map((c, i) => {
      const streakType = Object.keys(c)[0];

      const streakLength = c[streakType].length;

      return (
        <div
          key={i}
          className={cn(style['chunk-wrapper'], style[`chunk-wrapper-${streakType}`])}
        >
          {streakType === 'selected' && (
            <div className={style['decoration']}>
              {config && typeof config.leftDecor === 'function' && config.leftDecor()}
            </div>
          )}

          <div className={style['chunk-content']}>
            {c[streakType].map((item: any, j: number) => {
              return (
                <div
                  key={typeof item.hash !== 'undefined' ? item.hash : item.id}
                  className={cn(style['item-wrapper'], style[`item-wrapper-${streakType}`])}
                >
                  {streakType === 'deselected' && (
                    <div className={style['decoration']}>
                      {config && typeof config.leftDecor === 'function' && config.leftDecor()}
                    </div>
                  )}

                  <div className={style['item-content']}>
                    <TrU
                      onDropNativeFiles={onDropNativeFiles}
                      onDrag={onDrag}
                      item={item}
                      onRowClick={typeof onRowClick === 'function' ? (e: Event): void => onRowClick(item, e) : null}
                      config={config}
                    />
                    {(j < streakLength - 1) && <div className={style[`file-manager-divider-${streakType}`]} />}
                  </div>

                  {streakType === 'deselected' && (
                    <div className={style['decoration']}>
                      {config && typeof config.rightDecor === 'function' && config.rightDecor()}
                    </div>
                  )}
                </div>
              )
            })}
            {(i < chunksQuantity - 1) && <div className={style['file-manager-divider-transparent']} />}
          </div>

          {streakType === 'selected' && (
            <div className={style['decoration']}>
              {config && typeof config.rightDecor === 'function' && config.rightDecor()}
            </div>
          )}
        </div>
      )
    });
  }

  let content = <div />;

  /*
  if (data.length === 0) {
    content = (
      <div className={style['file-manager-empty']}>
        {config && typeof config.emptyInfo === 'function' && config.emptyInfo()}
      </div>
    )
  } else {
    */
    content = (
      <>
        <div>
          <div className={style.header}>
            {config && typeof config.leftDecor === 'function' && config.leftDecor()}
            {/*
            <div className={style['header-checkbox']}>
              {
                config &&
                typeof config.showHeaderCheckbox === 'function' && typeof config.headerCheckbox === 'function'
                && config.showHeaderCheckbox()
                && config.headerCheckbox()
              }
            </div>
            */}
            {config && config.fields.map((field) => {
              const headerClassnames = cn(field.headerClassName, style['header-cell'], {
                [style['header-cell-action']]: field.name === 'actions',
                [style['header-cell-availableTo']]: field.name === 'availableTo',
              });

              return (
                <div
                  className={headerClassnames}
                  key={field.name}
                  style={field.style}
                >
                  <div className={ style['header-cell-insulation'] }>
                    {typeof field.header === 'function' ? field.header() : field.header}
                  </div>
                  {field.sortable === true && (
                    <SortControls
                      onClick={onSortChange}
                      name={field.name}
                      state={
                        (Object.keys(sort).length === 0 && typeof config.defaultSort[field.name] !== 'undefined')
                          ? config.defaultSort[field.name]
                          : sort[field.name]
                      }
                    />
                  )}
                </div>
              );
            })}
            {config && typeof config.rightDecor === 'function' && config.rightDecor()}
          </div>
          <div className={style.items}>
           {data.length > 0 ? renderItemsList(data) : <div style={{ marginBottom: '16px', textAlign: 'center' }}>Отметки не заданы</div>}
          </div>
        </div>
      </>
    );
  //}

  return (
    <div className={style['file-manager']}>
      <div className={style['file-manager-content']}>
        {/*
        <Spinner
          style={{ marginTop: '20px' }}
          show={showSpinner}
        />
        */}
        {content}
      </div>
      {/*(showPagination && typeof totalPages === 'number' && totalPages > 1 ) && (
        <Pagination
          current={currentPage + 1}
          totalPages={totalPages}
          onPageChange={(n) => onPageChange(n)}
        />
      )*/}
    </div>
  );
};

export default UserFileFolderTable;
