import * as React from 'react';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {IFilterHeader, IReduxState, TypesResources} from 'shared/types/app';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../../redux';
import {AutocompleteFilter, DisplaySelect, FilterSelect, SelectedFilters, SnmpDisplaySelect } from 'shared/view/components';
import {initialResource} from '../../redux/data/initial';
import {IFilter, IFilterConfigs, IResourceReduxState} from '../../namespace';
import injectResource from 'shared/helpers/injectResource';
import i18next from "i18next";
import './FilterResource.styl';

// import { AutocompleteSearch } from 'shared/view/components';

interface IState {
  configsInitialised: boolean;
}

interface IDispatchProps {
  initResource: typeof actions.initResource;
  loadFilters: typeof actions.loadFilters;
  onChooseFilter: typeof actions.onChooseFilter;
  onChangeFilter: typeof actions.onChangeFilter;
  acceptFilter: typeof actions.acceptFilter;
  getFilterOptions: typeof actions.getFilterOptions;
  getSearchOptions: typeof actions.getSearchOptions;
}

interface IStateProps {
  filters: IFilter[];
  filterConfigs: IFilterConfigs;
  filterOptions: any;
}

interface IOwnProps {
  label?: string;
  resource: TypesResources;
  configs: Partial<IResourceReduxState>;
  isHidden?: boolean;
  filterDisabledValidator?(headers: IFilterHeader[]): string[];
  changeHeaderByFilter?(activeHeader: string): void;
  noDisplaySelect?: boolean;
  snmpDisplaySelect?: boolean
  search?: boolean;
  showSettings?: any;
  onAdd?: any;
}

function mapStateToProps(state: IReduxState, ownProps: IOwnProps): IStateProps {
  const { filters, filterConfigs, filterOptions } = state.filterResource[ownProps.resource] || initialResource;
  return { filters, filterConfigs, filterOptions };
}

function mapDispatchToProps(dispatch: any, ownProps: IOwnProps): IDispatchProps {
  return bindActionCreators({
    acceptFilter: injectResource(ownProps.resource, actions.acceptFilter),
    onChooseFilter: injectResource(ownProps.resource, actions.onChooseFilter),
    initResource: injectResource(ownProps.resource, actions.initResource),
    loadFilters: injectResource(ownProps.resource, actions.loadFilters),
    onChangeFilter: injectResource(ownProps.resource, actions.onChangeFilter),
    getFilterOptions: injectResource(ownProps.resource, actions.getFilterOptions),
    getSearchOptions: injectResource(ownProps.resource, actions.getSearchOptions),
  }, dispatch);
}

class FilterResource extends React.PureComponent<IDispatchProps&IStateProps&IOwnProps, {} > {
  public state: IState = {
    configsInitialised: false
  };

  private b = block('filter-resource');

  public componentDidUpdate() {
    const { configsInitialised } = this.state;
    const { loadFilters, initResource, configs } = this.props;

    if (
      !configsInitialised
      && configs.headers
      && configs.headers.length
    ) {
      initResource(configs);
      loadFilters();
      this.setState({configsInitialised: true});
    }
  }

  @bind
  private changeFilter(name: string, value: any) {

    const { changeHeaderByFilter, onChangeFilter } = this.props;

     if(typeof(value) == 'object'){
       let valueWithoutVoids = value.filter(item => {
         return item !== ''
       })
       value = valueWithoutVoids
     }

    onChangeFilter(name, value);
    if (changeHeaderByFilter) { changeHeaderByFilter(value) }
  }

  @bind
  private chooseFilter(name: string, isChecked: boolean) {
    const { onChooseFilter, filters } = this.props;
    const presetOptions = filters.filter(f => f.name === name)[0].values;
    onChooseFilter(name, isChecked, presetOptions);
  }

  public render() {
    const b = this.b;
    const {
      filters,
      acceptFilter,
      filterConfigs,
      filterDisabledValidator,
      label,
      filterOptions,
      getFilterOptions,
      getSearchOptions,
      onChangeFilter,
      resource,
      noDisplaySelect,
      search,
      showSettings,
      snmpDisplaySelect
    } = this.props;

    return (
      <div className={b()}>
        <div className={b('caption')}>
          {label && (
            <div className={b('title')}>
              {
                label.split('>').map((item, index) => (
                  <span key={index}>{index !== 0 ? <span className="big-dot">&#903;</span> : null}{item}</span>
                ))
              }
            </div>
          )}
          <section className={b('filters')}>
            {
              filters.length
                ? (
                  <FilterSelect
                    headers={filters}
                    onChange={this.chooseFilter}
                    disabledValidator={filterDisabledValidator}
                  />
                )
                : null
            }

            {!noDisplaySelect && <DisplaySelect resource={resource}/>}

            {snmpDisplaySelect && <SnmpDisplaySelect resource={resource} onAdd={this.props.onAdd} /> }

            {showSettings && 
              <div style={
                {
                  display: 'flex',
                  cursor: 'pointer',
                  color: '#9e9e9e',
                  whiteSpace: 'nowrap',
                  marginLeft: '15px'
                }
              }
                onClick={showSettings}
              >
                Настройки отчета
              </div>}
          </section>
        </div>

        {search &&  <AutocompleteFilter
                      // onChange={onChangeFilter.bind(this, name)}
                      // value={'admin'}
                      // source={filterOptions}
                      // getOptions={getFilterOptions}
                      getOptions={getSearchOptions}
                      filterName={i18next.t('Search.search')}
                      label={ resource == 'userlogs' ? 'Поиск по имени' : i18next.t('Search.search')}
                      acceptFilter={acceptFilter}
                      // onRemove={onChooseFilter.bind(this, name, false)}
                    />
        }


        <SelectedFilters
          resource={resource}
          value={filterConfigs}
          headers={filters}
          getOptions={getFilterOptions}
          filterOptions={filterOptions}
          onChangeFilter={this.changeFilter}
          onChooseFilter={this.chooseFilter}
          acceptFilter={acceptFilter}
        />
      </div>
    );
  }

}

export { FilterResource };
export default connect<IStateProps, IDispatchProps, IOwnProps >(mapStateToProps, mapDispatchToProps)(FilterResource);
