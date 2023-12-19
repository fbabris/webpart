import { useEffect, useState } from 'react';
import { DetailsList, DetailsListLayoutMode, Selection, SelectionMode } from '@fluentui/react/lib/DetailsList';
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import * as React from 'react';
import { deleteFormData, fetchRequestItems, updateFormData, fetchTaxonomyData } from './services';
import { IRequestList } from './interfaces/interfaces';
import * as moment from 'moment';
import ModalComponent from './ModalComponent';

const ListCon: React.FC<IRequestList> = (props) => {
  const [requestItems, setRequestItems] = useState<IRequestList[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<IRequestList | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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
    {
      key: 'edit',
      name: 'Edit',
      fieldName: 'edit',
      minWidth: 50,
      maxWidth: 50,
      isResizable: false,
      onRender: (item: any) => (
        <button onClick={() => handleUpdate(item)}>Edit</button>
      ),
    },
    {
      key: 'delete',
      name: 'Delete',
      fieldName: 'delete',
      minWidth: 50,
      maxWidth: 50,
      isResizable: false,
      onRender: (item: any) => (
        <button onClick={() => handleDelete(item)}>Delete</button>
      ),
    },
  ];

  const selection = new Selection({
    onSelectionChanged: () => {

    },
  });


  const renderItemColumn = (item: any, index: any, column: any) => {
    let fieldContent = item[column.fieldName];
    switch (column.key) {
      case 'DueDate':
      case 'ExecutionDate':
        return <span>{formattedDate(fieldContent)}</span>;
      case 'AsignedManager':
        return <span>{fieldContent ? fieldContent.title : 'N/A'}</span>;
      case 'Tags':
        return <span>{fieldContent ? fieldContent.Label : 'N/A'}</span>;
      default:
        return <span>{fieldContent}</span>;
    }
  };
  
  const formattedDate = (dateString: string | undefined) => {
    if (dateString) {
      const date = moment(dateString);
      if (date.isValid()) {
        return date.format('DD.MM.YYYY');
      }
    }
    return 'N/A';
  };

  const fetchData = async () => {
    try {
      const items = await fetchRequestItems(props.context);
      setRequestItems(items);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const showTaxonomyData = async () => {
    try {
      const taxonomyData = await fetchTaxonomyData();
      console.log('Taxonomy Data:', taxonomyData);
    } catch (error) {
      console.error('Error fetching taxonomy data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    showTaxonomyData();
  }, []);

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
        fetchData();
        handleModalClose();
    } catch (error) {
        console.error('Error handling update:', error);
    }
};

const handleOpenCreateModal = () => {
  setSelectedItem(null);
  setModalVisible(true);
};

  return (
    <div>
      <h2>Request List:</h2>
      {loading ? (
        <ShimmeredDetailsList setKey="items" items={[]} columns={columns} enableShimmer={loading} />
      ) : (
        <MarqueeSelection selection={selection}>
          <DetailsList
            items={requestItems}
            columns={columns}
            setKey="items"
            layoutMode={DetailsListLayoutMode.justified}
            selection={selection}
            selectionMode={SelectionMode.none}
            onRenderItemColumn={renderItemColumn}
          />
        </MarqueeSelection>
      )}

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

export default ListCon;