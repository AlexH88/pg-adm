import * as React from 'react';
import {Icon} from 'shared/view/elements';
import {actions} from '../../../redux';

interface IOwnProps {
  catalogType: 'gen' | 'ad';
  id: number;
  editHandler: any;
  deleteHandler: any;
  syncHandler?: typeof actions.switchSyncModal | boolean;
}

class Actions extends React.PureComponent<IOwnProps, {}> {
  public render() {
    const { catalogType, id, editHandler, deleteHandler, syncHandler } = this.props;
    return (
      <span>
        {
          catalogType === 'gen' && deleteHandler
            ? [
              <Icon
                key={0}
                icon="pen_off"
                onClick={editHandler ? editHandler.bind(this, { mode: 'edit', id }) : null}
              />,
              <Icon
                key={1}
                icon="trash_off"
                onClick={deleteHandler ? deleteHandler.bind(this, id) : null}
              />,
            ]
            : null
        }
        {
          catalogType !== 'gen' && editHandler ?
            [
            <Icon
              key={2}
              icon="pen"
              onClick={editHandler ? editHandler.bind(this, { mode: 'partial-edit', id }) : null}
            />,
            <Icon
                key={1}
                icon="trash"
                onClick={deleteHandler}
            />,
            ]
          : null
        }
        {
          syncHandler
          ? syncHandler && catalogType !== 'gen'
            ? <Icon
              icon="sync"
              onClick={syncHandler}
            />
            : <Icon
                  icon="sync_off"
              />
          : null
        }
      </span>
    );
  }
}

export default Actions;
