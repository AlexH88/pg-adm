import * as React from 'react';
import {block} from 'bem-cn';
import {Button} from 'shared/view/elements';
import {bind} from 'decko';
import './style.styl';

interface IOwnProps {
  items: string[];
  action: 'sync' | 'unsync' | '';
  onButtonClick(): void;
  syncItems(): void;
  unsyncItems(): void;
}

class ItemsList extends React.PureComponent<IOwnProps, {}> {

  private b = block('items-list');

  public render() {
    const b = this.b;
    const { items, onButtonClick } = this.props;
    return (
      <div className={b('wrapper')}>
        <div className={b()}>
          {items && items.map((item: string, index: number) =>
            <div key={index} className={b('item')}>{item}</div>,
          )}
        </div>
        <div className={b('footer')}>
          <Button
            label="Отмена"
            onClick={onButtonClick}
          />
          <Button
            label="OK"
            type="submit"
            isPrimary
            onClick={this.onSubmitHandler}
          />
        </div>
      </div>
    );
  }

  @bind
  private onSubmitHandler(): void {
    const { action, syncItems, unsyncItems, onButtonClick } = this.props;
    if (action === 'sync') {
      syncItems();
    }
    if (action === 'unsync') {
      unsyncItems();
    }
    onButtonClick();
  }

}

export default ItemsList;
