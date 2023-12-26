import { IMemberForm } from '../interfaces/interfaces';
import Services from './Services';

class FormDataManager extends Services {
// private AsignedManagerIdField = this.findInternalName('AsignedManagerId');

public async readAllFormData() {
  try {
    const list = await this.list();
    let items = await list.items();
    const manager = await this.userIsManager();
    console.log('is this manager', manager);
    if (!manager) {
        const userId = await this.getUserId();
      items = items.filter((item) => item.AuthorId === userId);
      console.log('is this user a manager', manager, 'userId', userId)
    }    
    
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
  }

  public async createFormData(formData: IMemberForm): Promise<void> {
    try {
      const dueDate = formData.DueDate ? new Date(formData.DueDate) : null;
        const list = await this.list();
      await list.items.add({
        Title: formData.Title,
        Description: formData.Description,
        RequestTypeId: formData.RequestTypeId,
        RequestArea: formData.RequestArea,
        DueDate: dueDate,
        'n55b0e94a31948c0be73f8d6ffcf24ec0': formData.Tags,
        AsignedManagerId: formData.AsignedManagerId,
      });
    } catch (error) {
      console.error('Error submitting form data to SharePoint:', error);
      throw error;
    }
  }

  public async updateFormData(id: number, updatedFormData: IMemberForm): Promise<void> {
    const dueDate = updatedFormData.DueDate ? new Date(updatedFormData.DueDate) : null;

    try {
      const list = await this.list();
      const itemToUpdate = await list.items.getById(id).update({
        Title: updatedFormData.Title,
        Description: updatedFormData.Description,
        RequestArea: updatedFormData.RequestArea,
        RequestTypeId: updatedFormData.RequestTypeId,
        DueDate: dueDate,
        'n55b0e94a31948c0be73f8d6ffcf24ec0': updatedFormData.Tags,
        AsignedManagerId: updatedFormData.AsignedManagerId,
      });

      console.log('Form data updated in SharePoint:', itemToUpdate.data);
    } catch (error) {
      console.error('Error updating form data in SharePoint:', error);
      throw error;
    }
  }

  public async deleteFormData(itemId: number): Promise<void> {
    try {
      const list = await this.list();
      await list.items.getById(itemId).delete();

      console.log('Form data deleted from SharePoint:', itemId);
    } catch (error) {
      console.error('Error deleting form data from SharePoint:', error);
      throw error;
    }
  }
}

export default FormDataManager;