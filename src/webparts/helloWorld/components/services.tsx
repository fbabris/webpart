import { SPFI } from '@pnp/sp';
import { getSP } from '../../../pnpjsConfig';
import { IMemberForm } from './interfaces/interfaces';
import { PnPClientStorage, dateAdd } from "@pnp/core";
// import { ITermSetInfo, ITermStoreInfo } from '@pnp/sp/taxonomy';
// import { ITermStore } from '@pnp/sp-taxonomy';

const LIST_NAME = 'Requests';

export const fetchRequestItems = async (context: any) => {
  
  const _sp: SPFI = getSP(context);

  try {
    const items = await _sp.web.lists.getByTitle(LIST_NAME).items();
    return items.map((item) => ({
      ID: item.ID,
      Title: item.Title,
      Description: item.Description,
      DueDate: item.DueDate,
      ExecutionDate: item.ExecutionDate,
      RequestType: item.RequestType,
      RequestArea: item.RequestArea,
      AsignedManager: item.AsignedManager,
      Tags: item.Tags,
      Status: item.Status,
      context: item.context,
    }));
  } catch (error) {
    console.error('Error fetching request items', error);
    throw error;
  }
};

let formDataStore: IMemberForm[] = [];

export const createFormData = async (formData: IMemberForm): Promise<void> => {
    
    const _sp: SPFI = getSP();
    
    try {
      const list = _sp.web.lists.getByTitle(LIST_NAME);

      const dueDate = formData.DueDate ? new Date(formData.DueDate) : null;

      const item = await list.items.add({
        Title: formData.Title,
        Description: formData.Description,
        // RequestType: formData.requestType,
        RequestArea: formData.RequestArea,
        DueDate: dueDate,
        // Tags: formData.tags,
      });
  
      console.log('Form data submitted to SharePoint:', item.data);
    } catch (error) {
      console.error('Error submitting form data to SharePoint:', error);
      throw error; // Re-throw the error to be handled by the component
    }
  };

export const readAllFormData = (): IMemberForm[] => {
  // Assuming you want to return all form data from the store
  return formDataStore;
  // Perform any additional logic (e.g., API call to fetch data)
};

export const updateFormData = async (id: number, updatedFormData: IMemberForm): Promise<void> => {
    const _sp: SPFI = getSP();
    const dueDate = updatedFormData.DueDate ? new Date(updatedFormData.DueDate) : null;

    try {
      const list = _sp.web.lists.getByTitle(LIST_NAME);
      const itemToUpdate = await list.items.getById(id).update({
        Title: updatedFormData.Title,
        Description: updatedFormData.Description,
        RequestArea: updatedFormData.RequestArea,
        DueDate: dueDate,
      });
  
      console.log('Form data updated in SharePoint:', itemToUpdate.data);
    } catch (error) {
      console.error('Error updating form data in SharePoint:', error);
      throw error;
    }
  };

  export const deleteFormData = async (itemId: number): Promise<void> => {
    const _sp: SPFI = getSP();
  
    try {
      const list = _sp.web.lists.getByTitle(LIST_NAME);
      await list.items.getById(itemId).delete();
  
      console.log('Form data deleted from SharePoint:', itemId);
    } catch (error) {
      console.error('Error deleting form data from SharePoint:', error);
      throw error;
    }
  };

  export const fetchTaxonomyData = async (): Promise<any[]> => {
    const _sp: SPFI = getSP(); 
    try {
      const store = new PnPClientStorage();
  
      // Fetch the taxonomy data and cache the results
      const cachedData = await store.local.getOrPut("taxonomyData", async () => {
        const termStoreId = "944ad0e3-dae2-4ffb-88bc-ba2455ab6cc5"; // Replace with your term store ID
        const termSetId = "dc544f14-4bee-4bef-9ce6-b36622cb704b"; // Replace with your term set ID
  
        const termSet = _sp.termStore.groups.getById(termStoreId).sets.getById(termSetId);
  
        // You can customize this based on your specific requirements
        const termSetData = await termSet.getAllChildrenAsOrderedTree();
        return termSetData;
      }, dateAdd(new Date(), "minute", 30));
      
      return cachedData;
    } catch (error) {
      console.error('Error fetching taxonomy data:', error);
      throw error; // You may want to handle or log the error appropriately
    }
  };

