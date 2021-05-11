import {IModule} from './shared/types/app';
import * as React from 'react';
import {Redirect, Route} from "react-router-dom";

// @ts-ignore
function getRoutes(modules: Array<IModule<any>>): React.ReactElement<Route.RouteProps> | React.ReactNode {
/*
  const authorities = JSON.parse(localStorage.getItem('authoritiesCurrent'))
  const authoritiesCurrent = []
  if(authorities !== null) {
    authorities.map((item) => {
      authoritiesCurrent.push(item.tag)
    })
  }
*/
  return modules.map((module: IModule<any>) => {
    if (module.getRoutes) {
      const element = module.getRoutes();
      const link = module.getConfigs().link;
//      const tag = module.getConfigs().tag;
      return (
        <Route
          key={link}
          path={link}
          component={
            /*() => element*/
            (props: any) => {
              const credentials: any = localStorage.getItem('userCredentials');
              
              if ( 
                credentials !== null && JSON.parse(credentials).access_token.length && JSON.parse(credentials).refresh_token.length
                ) {
                return element;
              } else {
                return (
                  <Redirect
                    to={{
                      pathname: "/login",
                      state: { from: props.location }
                    }}
                  />
                );
              }
            }
          }
        />
      );
    } 
    return null;
  });
}

export default getRoutes;