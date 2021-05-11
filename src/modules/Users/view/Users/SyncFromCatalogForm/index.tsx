import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IReduxState } from 'shared/types/app';
import { block } from 'bem-cn';
import { bind } from 'decko';
import { Button, Checkbox } from 'shared/view/elements';
import { actions } from '../../../redux';
import './style.styl';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import * as circularTheme from './circularTheme.styl';
import {TextInput} from 'shared/view/elements';

interface IState {
  currentCatalog: number | null;
  currentGroupsList: any[];
  mounted: boolean;
  searchStr: string;
}
interface IOwnProps {
  onCancel(): void;
  onConfirm(): void;
}
 
interface IDispatchProps {
  getCatalogs: typeof actions.getCatalogs;
  getCatalogGroups: typeof actions.getCatalogGroups;
  updateCatalogGroups: typeof actions.updateCatalogGroups;
}

interface IStateProps {
  availableCatalogs: any[];
  availableCatalogGroups: any;
}

function mapStateToProps(state: IReduxState): IStateProps {
  return {
    availableCatalogs: state.users.availableCatalogs,
    availableCatalogGroups: state.users.availableCatalogGroups
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    getCatalogs: actions.getCatalogs,
    getCatalogGroups: actions.getCatalogGroups,
    updateCatalogGroups: actions.updateCatalogGroups
  }, dispatch);
}

const b = block('sync-from-catalog');

class SyncFromCatalogForm extends React.PureComponent<IStateProps & IDispatchProps & IOwnProps, IState> {
  state = {
    currentCatalog: null,
    currentGroupsList: [],
    mounted: false,
    searchStr: ''
  }

  componentDidMount() {
    const { getCatalogs } = this.props;
    getCatalogs();
  }

  componentDidUpdate() {
    const {
      getCatalogGroups
    } = this.props;

    const {
      currentCatalog,
      mounted
    } = this.state;

    if (!mounted && currentCatalog !== null) {
      getCatalogGroups(currentCatalog);
      this.setState({ mounted: true });
    }
  }

  componentWillUnmount() {
    const {
      getCatalogGroups
    } = this.props;

    const {
      currentCatalog,
      mounted
    } = this.state;

    getCatalogGroups(currentCatalog);
  }

  static getDerivedStateFromProps(nextProps: any, state: any) {
    if (
      nextProps.availableCatalogGroups[state.currentCatalog]
      && state.currentGroupsList.length !== nextProps.availableCatalogGroups[state.currentCatalog].length
    ) {
      return {
        ...state,
        currentGroupsList: nextProps.availableCatalogGroups[state.currentCatalog]
      }
    } else if (
      state.currentCatalog === null &&
      nextProps.availableCatalogs.length > 0
    ) {
      return {
        ...state,
        currentCatalog: nextProps.availableCatalogs[0].settings.id
      }
    }
    return state;
  }

  public render() {
    const {
      availableCatalogs
    } = this.props;

    const {
      currentGroupsList
    } = this.state;

    return (
      <div className={b()} >
        <div style={{ display: 'flex' }}>
          <div
            style={{
              width: '200px',
              border: '1px solid #a9a9a9',
              borderRadius: '5px',
              marginRight: '16px',
              marginBottom: '16px',
              marginTop: '16px'
            }}
          >
            <ul style={{
              padding: '8px',
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}>
              {availableCatalogs.map((c: any) => (
                <li
                  key={c.settings.id}
                  style={{
                    listStyle: 'none',
                    padding: '4px 8px',
                    backgroundColor: '#2196f3',
                    borderRadius: '5px',
                    color: 'white',
                    cursor: 'pointer',
                    marginBottom: '5px'
                  }}
                  onClick={() => this.handleChooseCatalog(c.settings.id)}
                >
                  {c.settings.name}
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              border: '1px solid #a9a9a9',
              borderRadius: '5px',
              overflow: 'hidden',
              marginBottom: '16px',
              marginTop: '16px'
            }}
          >

            <div style={{
              padding: '0px 0',
              marginLeft: '7px',
              marginRight: '7px',
              marginTop: '7px',
              marginBottom: '0px',
              position: 'relative'
            }}>
              <TextInput
                label="Поиск"
                value={this.state.searchStr}
                onChange={this.handleChangeSearch}
              />
            </div>

            <div
              style={{
                width: '300px',
                height: '400px',
                overflowX: 'hidden',
                overflowY: 'scroll',
                padding: '8px'
              }}
            >
            {
              currentGroupsList.length > 0
              ?
                currentGroupsList.map((g: any) => {
                  if(g.name.toLowerCase().indexOf(this.state.searchStr.toLowerCase()) > -1){
                    return (
                      <li
                        key={g.id}
                        style={{
                          listStyle: 'none'
                        }}
                      >
                        <Checkbox
                          name={g.id.toString()}
                          label={g.name}
                          checked={g.loginEnabled}
                          onChange={() => {this.handleToggleCheckbox(g.id)}}
                        />
                      </li>
                    )
                  }
                })
              :
                availableCatalogs.length != 0
                ?
                <ProgressBar theme={circularTheme} type="circular" mode="indeterminate" />
                :
                null
            }
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            label="Отмена"
            onClick={this.handleCancel}
          />
          <Button
            label="Сохранить"
            //disabled={invalid || pristine}
            disabled={availableCatalogs.length == 0}
            onClick={() => {this.handleSync()}}
            type="submit"
            isPrimary
          />
        </div>
      </div>
    );
  }

  @bind
  private handleChangeSearch(event) {
    this.setState({searchStr: event});
  }

  @bind
  private handleToggleCheckbox(id: number): void {
    const {
      currentGroupsList
    } = this.state;

    const newGroupsList = [...currentGroupsList].map((g: any) => {
      if (g.id === id) {
        g.loginEnabled = !g.loginEnabled;
      }
      return g;
    });

    this.setState({ currentGroupsList: newGroupsList })
  }

  @bind
  private handleChooseCatalog(id: number): void {
    const {
      getCatalogGroups
    } = this.props;
    const {
      currentCatalog
    } = this.state;

    if (id !== currentCatalog) {
      this.setState({
        currentCatalog: id,
        currentGroupsList: []
      });

      getCatalogGroups(id);
    }
  }

  @bind
  private handleSync(): void {
    const {
      updateCatalogGroups,
      getCatalogGroups,
      onConfirm
    } = this.props;

    const {
      currentGroupsList,
      currentCatalog
    } = this.state;

    const chosenGroupsIdList = [...currentGroupsList]
      .filter((g: any) => g.loginEnabled)
      .map((g: any) => g.id);

    updateCatalogGroups(currentCatalog, chosenGroupsIdList);
    getCatalogGroups(currentCatalog);
    onConfirm();
  }

  @bind
  private handleCancel(): void {
    this.props.onCancel();
  }
}

export { SyncFromCatalogForm };
export default connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(SyncFromCatalogForm);
