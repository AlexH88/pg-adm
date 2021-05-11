import {IReduxState, IResource} from 'shared/types/app';

function getResourceByTag(resource: string, state: IReduxState, tag: string): IResource | null {
  let resourceItem: IResource | null | undefined = null;
  
  const data = state.showResource[resource].data as IResource[][];
  Object.values(data).forEach((page: IResource[]) => {
    if (!resourceItem) {
      resourceItem = page.find((itemResource: IResource) => itemResource.tag === tag);
    }
  });

  return resourceItem ? resourceItem : null;
};

export default getResourceByTag;
