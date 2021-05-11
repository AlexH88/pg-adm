import {IReduxState, IResource} from 'shared/types/app';

function getResourceById(resource: string, state: IReduxState, id: number): IResource | null {
  let resourceItem: IResource | null | undefined = null;
  
  const data = state.showResource[resource].data as IResource[][];
  Object.values(data).forEach((page: IResource[]) => {
    if (!resourceItem) {
      resourceItem = page.find((itemResource: IResource) => itemResource.id === id);
    }
  });

  return resourceItem ? resourceItem : null;
};

export default getResourceById;
