import { Route, RouteProps } from "react-router-dom";
import AppPage from "../pages/App/AppPage";
import FormPage from "../pages/Form/FormPage";
import SimpleInputPage from "../pages/Form/Simple-Input/SimpleInputPage";
import { ReactElement } from "react";
import { WindowPage } from "../pages/Window";
import ErrorPage from "../pages/Error/ErrorPage";

export interface IElement {
  path?: string | null;
  component?: string | null;
  children?: IElement[];
}


const convertNameToComponent = (name: string) => {
  switch (name) {
    case 'App': return AppPage;
    case 'Form': return FormPage;
    case 'SimpleInput': return SimpleInputPage;
    case 'Window': return WindowPage;
    case 'Error': return ErrorPage;
    default: throw new Error('Unknown Component!');
  }
}

export const defaultPath = resolvePaths([
  {
    path: "",
    component: "SimpleInput",
  },
]);

export function resolvePaths(elements: IElement[]): any{
  if (!(elements && elements?.length > 0)) {
    return defaultPath;
  }
  
  const routes: ReactElement[] = [];
  
  resolvePathsReduntant(elements, routes);

  return routes;
}

function resolvePathsReduntant(elements: IElement[], routes: ReactElement[], path: string = ''): void {
  if (!(elements && elements?.length > 0)) {
    return;
  }

  for (const element of elements) {
    const props: RouteProps = {};

    if (element.path !== null || element.path !== undefined) {
      if (path.endsWith('/')) {
        props.path = path + element.path;
      }
      else {
        props.path = path + '/' + element.path;
      }
    } 

    if (element.component) {
      props.Component = convertNameToComponent(element.component);
    }

    if (element.children) {
      const childRoutes: ReactElement[] = [];

      resolvePathsReduntant(element.children, childRoutes, props.path);

      props.children = childRoutes;
    }

    routes.push(<Route key={props.path ?? element.path} {...props} />);
  }
}