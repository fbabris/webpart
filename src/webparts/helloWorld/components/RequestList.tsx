import * as React from 'react';
import { useEffect, useState } from 'react';
import { IMemberForm, IRequestList, IRequestTypes} from './interfaces/interfaces';
import ModalComponent from './ModalComponent';
import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
  Button,
} from "@fluentui/react-components";
import { DeleteIcon, EditIcon } from '@fluentui/react-icons-mdl2';
import 'office-ui-fabric-core/dist/css/fabric.min.css';
import { PrimaryButton } from '@fluentui/react';
import FormDataManager from './helpers/FormDataManager';
import Services from './helpers/Services';




const RequestList: React.FC<IRequestList> = (props) => {
  const [requestItems, setRequestItems] = useState<IRequestList[]>([]);
  const [selectedItem, setSelectedItem] = useState<IRequestList | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [usersArray, setUsersArray] = useState<{ [key: number]: string }> ({});
  const [requestTypes, setRequestTypes] = React.useState<IRequestTypes[]>([]);
  const formDataManager = new FormDataManager(props.context);
  const services = new Services(props.context);


    useEffect(() => {
    const fetchDataAndUsers = async () => {
      await fetchData();
      await storeSiteUsers();
      requestTypesArray();
      storeTaxonomyData();
    };
  
    fetchDataAndUsers();
  }, [props.context]);

  const handleUpdate = (item: IRequestList) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleDelete = (item: IRequestList) => {
    const confirmed = window.confirm(`Are you sure you want to delete item "${item.Title}"?`);
  
    if (confirmed) {
      deleteItem(item);
    }
  };
  
  

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleSave = async (updatedData: IMemberForm) => {
    try {
        await formDataManager.updateFormData(selectedItem?.ID || 0, updatedData);
        handleModalClose();
        fetchData();
    } catch (error) {
        console.error('Error handling update:', error);
    }
};

const deleteItem = async (item: IRequestList) => {
    try {
      await formDataManager.deleteFormData(item.ID);
      fetchData();
    } catch (error) {
      console.error('Error handling delete:', error);
    }
  };

const handleOpenCreateModal = () => {
  setSelectedItem(null);
  setModalVisible(true);
};

const requestTypesArray = async () => {
  try {
    const requestTypesData = await services.fetchRequestTypeData();
    setRequestTypes(requestTypesData.map((requestTypeData) => ({
      Id: requestTypeData.Id,
      Title: requestTypeData.Title, 
      DisplayOrder: requestTypeData.DisplayOrder,
    })));
    console.log('request types', requestTypesData);
    return requestTypesData;
  } catch (error) {
    console.error('Error fetching Request Types data: ', error);
  }
};

const fetchData = async () => {
  try {
    const items = await formDataManager.readAllFormData();
    setRequestItems(items);
    console.log('fetch items', items);
    return requestItems;
  } catch (error) {
    console.error('Error fetching list data', error);
  }
};

const storeTaxonomyData = async () => {
  try {
    const taxonomyData = await services.fetchTaxonomyData();
    console.log('Taxonomy Data:', taxonomyData);
  } catch (error) {
    console.error('Error fetching taxonomy data:', error);
  }
};

const storeSiteUsers = async () => {
  try {
    const siteUserData = await services.getSiteUsers();
    const usersData:any = {};
    for (const user of siteUserData) {
      if (user.Id && user.Title) {
        usersData[user.Id] = user.Title;
      }
    }
    setUsersArray(usersData);
    return usersArray;
  } catch (error) {
    console.error('Error fetching users data: ', error);
  };
}

const gridClasses = {
  regular: 'ms-Grid-col ms-sm4 ms-md2 ms-lg2',
  large2: 'ms-Grid-col hiddenMdDown ms-lg2',
  large1: 'ms-Grid-col hiddenMdDown ms-lg1',
  small2: 'ms-Grid-col ms-sm2 ms-lg1', 
  small1: 'ms-Grid-col ms-sm1',
  mid3: 'ms-Grid-col hiddenSm ms-md3 ms-lg2',
  hid: 'ms-Grid-col ms-sm12 hiddenXxlDown'
}

const columns = [
  { key: 'Title', fieldName: 'Title', className:gridClasses.regular},
  // { key: 'Description', fieldName: 'Description', className:gridClasses.hid},
  { key: 'DueDate', fieldName: 'DueDate', className:gridClasses.mid3},
  // { key: 'ExecutionDate', fieldName: 'ExecutionDate', className:gridClasses.large1},
  // { key: 'RequestType', fieldName: 'RequestType', className:gridClasses.hid},
  { key: 'RequestArea', fieldName: 'RequestArea', className:gridClasses.large2},
  { key: 'AsignedManager', fieldName: 'Asigned Manager', className:gridClasses.regular},
  { key: 'Tags', fieldName: 'Tags', className:gridClasses.large2},
  { key: 'Status', fieldName: 'Status', className:gridClasses.small2},
  { key: 'EditDelete', fieldName: '', className:gridClasses.small1},

];

  return (
    <div className="ms-Grid">
      <h2>Request List:</h2>
        <Table sortable aria-label="Table with sort" >

        <TableHeader>
          <TableRow className="ms-Grid-row">
            {columns.map((column) => (
              <TableHeaderCell key={column.key} className={column.className}>
                {column.fieldName}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {requestItems.map((item) => (
            <TableRow className="ms-Grid-row" key={item.ID}>
              <TableCell className={gridClasses.regular} >{item.Title}</TableCell>
              {/* <TableCell className={gridClasses.hid} >{item.Description}</TableCell> */}
              <TableCell className={gridClasses.mid3} >{services.formattedDate(item.DueDate)}</TableCell>
              {/* <TableCell className={gridClasses.large1}>{formattedDate(item.ExecutionDate)}</TableCell> */}
              {/* <TableCell className={gridClasses.hid}>{item.RequestType}</TableCell> */}
              <TableCell className={gridClasses.large2}>{item.RequestArea}</TableCell>
              <TableCell className={gridClasses.regular}>{usersArray[item.AsignedManagerId]}</TableCell>
              <TableCell className={gridClasses.large2}>
                {item.Tags.map((tag:any, index:number) => (
                <span key={index}>{tag.Label} </span>
              ))}
              </TableCell>
              <TableCell className={gridClasses.small2}>{item.Status}</TableCell>
              <div className={gridClasses.small1}>
                <TableCell ><Button icon={<EditIcon/>} onClick={() => handleUpdate(item)}></Button></TableCell>
                <TableCell ><Button icon={<DeleteIcon/>} onClick={() => handleDelete(item)}></Button></TableCell> 
              </div>           
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="ms-Grid-row center">          
        <PrimaryButton className="ms-Grid-col ms-sm12" onClick={handleOpenCreateModal}>Create a New Request</PrimaryButton>
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
        />
      )}
    </div>
    );
};

export default RequestList;
