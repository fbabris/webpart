import * as React from 'react';
import { useEffect, useState } from 'react';
import { IMemberForm, IRequestList, IRequestTypes, Tag} from './interfaces/interfaces';
import ModalComponent from './ModalComponent';
import 'office-ui-fabric-core/dist/css/fabric.min.css';
import { PrimaryButton } from '@fluentui/react';
import FormDataManager from './helpers/FormDataManager';
import Services from './helpers/Services';
import SearchForm from './SearchForm';
import * as moment from 'moment';
import { ITermInfo } from "@pnp/spfx-controls-react/node_modules/@pnp/sp/taxonomy/";
import ListTable from './ListTable';




const RequestList: React.FC<IRequestList> = (props) => {
  const [requestItems, setRequestItems] = useState<IRequestList[]>([]);
  const [selectedItem, setSelectedItem] = useState<IRequestList | undefined>(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [usersArray, setUsersArray] = useState<{ [key: number]: string }> ({});
  const [requestTypes, setRequestTypes] = React.useState<IRequestTypes[]>([]);
  const [isUserManager, setIsUserManager] = useState<boolean>(false);
  const [sortConfig, setSortConfig] = useState<{ column: string; direction: 'asc' | 'desc' }>({ column: 'Title', direction: 'asc' });
  const [filteredRequestItems, setFilteredRequestItems] = useState<IRequestList[]>([]);
  const formDataManager = new FormDataManager(props.context);
  const services = new Services(props.context);



  const storeSiteUsers = async (): Promise<{ [key: number]: string }|undefined> => {
    try {
      const siteUserData = await services.getSiteUsers();
      const usersData:{ [key: number]: string } = {};
      for (const user of siteUserData) {
        if (user.Id && user.Title) {
          usersData[user.Id] = user.Title;
        }
      }
      setUsersArray(usersData);
      return usersArray;
    } catch (error) {
      console.error('Error fetching users data: ', error);
      throw error;
    }
  }

  const requestTypesArray = async ():Promise<IRequestTypes[]|undefined> => {
    try {
      const requestTypesData = await services.fetchRequestTypeData();
      setRequestTypes(requestTypesData.map((requestTypeData) => ({
        Id: requestTypeData.Id,
        Title: requestTypeData.Title, 
        DisplayOrder: requestTypeData.DisplayOrder,
      })));
      return requestTypesData;
    } catch (error) {
      console.error('Error fetching Request Types data: ', error);
    }
  }
  
  const handleUpdate = (item: IRequestList):void => {
    setSelectedItem(item);
    setModalVisible(true);
  }

  const handleOpenCreateModal = ():void => {
    setSelectedItem(undefined);
    setModalVisible(true);
  };

  const fetchAndSetData = async(): Promise<void> => {
    try {
      const items = await formDataManager.readAllFormData();
      setRequestItems(items);
      setFilteredRequestItems(items);
      await storeSiteUsers();
      await requestTypesArray();
      const userIsManager = await services.userIsManager();
      setIsUserManager(userIsManager);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const deleteItem = async (item: IRequestList):Promise<void> => {
    try {
      await formDataManager.deleteFormData(item.ID);
      await fetchAndSetData();
    } catch (error) {
      console.error('Error handling delete:', error);
    }
  }

  const handleDelete = (item: IRequestList):void => {
    const confirmed = window.confirm(`Are you sure you want to delete item "${item.Title}"?`);
  
    if (confirmed) {
      deleteItem(item);
    }
  }

  const handleModalClose = ():void => {
    fetchAndSetData();
    setSelectedItem(undefined);
    setModalVisible(false);
  }

  const handleSave = async (updatedData: IMemberForm):Promise<void> => {
    try {
        await formDataManager.updateFormData(selectedItem?.ID || 0, updatedData);
        handleModalClose();
        
    } catch (error) {
        console.error('Error handling update:', error);
    }
  }

  useEffect(() => {    
    fetchAndSetData();
  }, [props.context]);

const handleSort = (column: string):void => {
  const newDirection = sortConfig.column === column && sortConfig.direction === 'asc' ? 'desc' : 'asc';
  setSortConfig({ column, direction: newDirection });

  const sortedData = [...filteredRequestItems].sort((a, b) => {
    const aValue = a[column];
    const bValue = b[column];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return newDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    } else if (aValue instanceof Date && bValue instanceof Date) {
      return newDirection === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
    }

    return 0;
  });
  setFilteredRequestItems(sortedData);
}

const searchFormSubmit = (searchArray: IMemberForm): void => {
  let filteredItems = [...requestItems];

  for (const [key, value] of Object.entries(searchArray)) {
    if (value !== undefined) {
      if (key === 'Title' && value!=="") {
        filteredItems = filteredItems.filter((item) => item.Title.toLowerCase().includes(value.toLowerCase())
        );
      } else if (key === 'RequestTypeId' && value !== 0) {
        filteredItems = filteredItems.filter((item) => item.RequestTypeId === value);
      } else if (key === 'AsignedManagerId' && value !== 0){
        filteredItems = filteredItems.filter((item)=> item.AsignedManagerId === value);
      } else if (key === 'Status' && value !== ""){
        filteredItems = filteredItems.filter((item)=> item.Status === value);
      } else if (key === 'DueDate' && value !== undefined){
        filteredItems = filteredItems.filter((item) => {
          const dueDate = moment(item.DueDate).toDate(); 
          if(dueDate && dueDate instanceof Date) { 
            return dueDate >= value;
          }          
          return false;
        });
      } else if (key === 'DueDateEnd' && value !== undefined){
        filteredItems = filteredItems.filter((item) => {
          const dueDateEnd = moment(item.DueDate).toDate(); 
          if(dueDateEnd && dueDateEnd instanceof Date) { 
            return dueDateEnd <= value;
          }          
          return false;
        });
      }else if (key === 'ExecutionDate' && value !== undefined){
        filteredItems = filteredItems.filter((item) => {
          const executionDate = moment(item.ExecutionDate).toDate(); 
          if(executionDate && executionDate instanceof Date) { 
            return executionDate >= value;
          }          
          return false;
        });
      } else if (key === 'ExecutionDateEnd' && value !== undefined){
        filteredItems = filteredItems.filter((item) => {
          const executionDateEnd = moment(item.ExecutionDate).toDate(); 
          if(executionDateEnd && executionDateEnd instanceof Date) { 
            return executionDateEnd <= value;
          }          
          return false;
        });
      } else if (key === 'Tags' && value.length>0){
        const labelNames = value.map((term:ITermInfo) => (term.labels.length > 0 ? term.labels[0].name : ''));
        filteredItems = filteredItems.filter((item) => {
          const itemLabelNames = item.Tags.map((tag: Tag) => tag.Label)
          return labelNames.every((labelName:string) => itemLabelNames.includes(labelName));
        });
      } else if (key === 'RequestArea' && value !== ''){
        filteredItems = filteredItems.filter((item)=> item.RequestArea === value);
      }
    }
  }

  setFilteredRequestItems(filteredItems);
}

  return (

    <>
      <SearchForm 
        requestTypes={requestTypes}
        context={props.context}
        onSubmit={searchFormSubmit}
      />
      <ListTable
        handleSort={handleSort}
        filteredRequestItems={filteredRequestItems}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
        sortConfig={sortConfig}
        usersArray={usersArray}
      />
      <div className='ms-Grid'>
        <div className="ms-Grid-row center">          
          {!(isUserManager) && (<PrimaryButton className="ms-Grid-col ms-sm12" onClick={handleOpenCreateModal}>Create a New Request</PrimaryButton>)}
        </div>  
        {modalVisible && (
          <ModalComponent
            requestTypes={requestTypes}
            initialData={selectedItem}
            mode={selectedItem ? "update" : "create"}
            onSubmit={handleSave}
            isModalOpen={true}
            hideModal={handleModalClose}
            context={props.context}
            userIsManager={isUserManager}
          />
        )}
      </div>
    </>
  );
};

export default RequestList;
