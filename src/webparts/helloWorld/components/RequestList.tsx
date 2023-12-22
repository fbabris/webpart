import * as React from 'react';
import { useEffect, useState } from 'react';
import { deleteFormData, readAllFormData, updateFormData} from './CRUD';
import { IRequestList} from './interfaces/interfaces';
import ModalComponent from './ModalComponent';
import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
  TableCellLayout,
  Button,
} from "@fluentui/react-components";
import { DeleteIcon, EditIcon } from '@fluentui/react-icons-mdl2';
import { fetchTaxonomyData, formattedDate, getSiteUsers } from './services';

const RequestList: React.FC<IRequestList> = (props) => {
  const [requestItems, setRequestItems] = useState<IRequestList[]>([]);
  const [selectedItem, setSelectedItem] = useState<IRequestList | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [usersArray, setUsersArray] = useState<{ [key: number]: string }> ({});

  const columns = [
    { key: 'Title', name: 'Title', fieldName: 'Title', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'Description', name: 'Description', fieldName: 'Description', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'DueDate', name: 'Due Date', fieldName: 'DueDate', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'ExecutionDate', name: 'Execution Date', fieldName: 'ExecutionDate', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'RequestType', name: 'Request Type', fieldName: 'RequestType', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'RequestArea', name: 'Request Area', fieldName: 'RequestArea', minWidth: 100, maxWidth: 300, isResizable: true },
    { key: 'AsignedManager', name: 'Asigned Manager', fieldName: 'AsignedManager', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'Tags', name: 'Tags', fieldName: 'Tags', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'Status', name: 'Status', fieldName: 'Status', minWidth: 100, maxWidth: 200, isResizable: true },
  ];

  useEffect(() => {
    const fetchDataAndUsers = async () => {
      await fetchData();
      await storeSiteUsers();
      storeTaxonomyData();
    };
  
    fetchDataAndUsers();
  }, [props.context]);

  const handleUpdate = (item: IRequestList) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleDelete = async (item: IRequestList) => {
    try {
      await deleteFormData(item.ID);
      fetchData();
    } catch (error) {
      console.error('Error handling delete:', error);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleSave = async (updatedData: IRequestList) => {
    try {
        await updateFormData(selectedItem?.ID || 0, updatedData);
        handleModalClose();
        fetchData();
    } catch (error) {
        console.error('Error handling update:', error);
    }
};

const handleOpenCreateModal = () => {
  setSelectedItem(null);
  setModalVisible(true);
};

const fetchData = async () => {
  try {
    const items = await readAllFormData(props.context);
    setRequestItems(items);
    return requestItems;
  } catch (error) {
    console.error('Error fetching list data', error);
  }
};

const storeTaxonomyData = async () => {
  try {
    const taxonomyData = await fetchTaxonomyData();
    console.log('Taxonomy Data:', taxonomyData);
  } catch (error) {
    console.error('Error fetching taxonomy data:', error);
  }
};

const storeSiteUsers = async () => {
  try {
    const siteUserData = await getSiteUsers(props.context);
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

  return (
    <div>
      <h2>Request List:</h2>
        <Table sortable aria-label="Table with sort" >

        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHeaderCell key={column.key}>
                {column.fieldName}
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {requestItems.map((item) => (
            <TableRow key={item.ID}>
              <TableCell>
                <TableCellLayout main="span">
                  {item.Title}
                </TableCellLayout>
              </TableCell>
              <TableCell>
                <TableCellLayout main="span">
                  {item.Description}
                </TableCellLayout>
              </TableCell>
              <TableCell>{formattedDate(item.DueDate)}</TableCell>
              <TableCell>{formattedDate(item.ExecutionDate)}</TableCell>
              <TableCell>{item.RequestType}</TableCell>
              <TableCell>{item.RequestArea}</TableCell>
              <TableCell>{usersArray[item.AsignedManagerId]}</TableCell>
              <TableCell>
                {item.Tags.map((tag:any, index:number) => (
                <span key={index}>{tag.Label}</span>
              ))}
              </TableCell>
              <TableCell>{item.Status}</TableCell>
              <TableCell><Button icon={<EditIcon/>} onClick={() => handleUpdate(item)}></Button></TableCell>
              <TableCell><Button icon={<DeleteIcon/>} onClick={() => handleDelete(item)}></Button></TableCell>            
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <button onClick={handleOpenCreateModal}>Create a New Request</button>

      {modalVisible && (
        <ModalComponent
          initialData={selectedItem}
          mode={selectedItem ? "update" : "create"}
          onSubmit={handleSave}
          isModalOpen={true}
          hideModal={handleModalClose}
        />
      )}
    </div>
    );
};

export default RequestList;
