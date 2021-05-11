import * as React from 'react';
import {Route} from 'react-router-dom';
import TemplateLayout from 'modules/templates/view/Layout/Layout';
import Jobs from './view/Jobs/Jobs';
import * as Namespace from './namespace';
import {Module} from 'shared/types/app';
import {moduleConfigs} from './configs';

class JournalModule extends Module<{}> {
  
  public static configs = moduleConfigs;

  public getConfigs() {
    return JournalModule.configs;
  }

  public getRoutes() {
    return (
      <TemplateLayout key={JournalModule.configs.link}>
        <Route key="journal" path={JournalModule.configs.link} component={Jobs} />
      </TemplateLayout>
    );
  }
}

export { JournalModule, Namespace };
