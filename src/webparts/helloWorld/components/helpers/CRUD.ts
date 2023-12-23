import { SPFI } from '@pnp/sp';
import { getSP } from '../../../../pnpjsConfig';
import { IMemberForm } from '../interfaces/interfaces';

const LIST_NAME = 'Requests';

export const readAllFormData = async (context: any) => {
  
  const _sp: SPFI = getSP(context);

  try {
    const items = await _sp.web.lists.getByTitle(LIST_NAME).items();
    console.log('fetch promise', items);
    return items.map((item) => ({
      ID: item.ID,
      Title: item.Title,
      Description: item.Description,
      DueDate: item.DueDate,
      ExecutionDate: item.ExecutionDate,
      RequestTypeId: item.RequestTypeId,
      RequestArea: item.RequestArea,
      AsignedManagerId: item.AsignedManagerId,
      Tags: item.Tags,
      Status: item.Status,
      context: item.context,
    }));
  } catch (error) {
    console.error('Error fetching request items', error);
    throw error;
  }
};

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
      throw error;
    }
  };

export const updateFormData = async (id: number, updatedFormData: IMemberForm): Promise<void> => {
  const _sp: SPFI = getSP();
  const dueDate = updatedFormData.DueDate ? new Date(updatedFormData.DueDate) : null;

  try {
    const list = _sp.web.lists.getByTitle(LIST_NAME);
    const itemToUpdate = await list.items.getById(id).update({
      Title: updatedFormData.Title,
      Description: updatedFormData.Description,
      // RequestArea: updatedFormData.RequestArea,
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

