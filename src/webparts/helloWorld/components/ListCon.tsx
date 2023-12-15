import { useEffect, useState } from 'react';
import { SPFI } from '@pnp/sp';
import { IRequestList } from './interfaces/interfaces';
import { getSP } from '../../../pnpjsConfig';
import { DetailsList, DetailsListLayoutMode, Selection, SelectionMode} from '@fluentui/react/lib/DetailsList';
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import * as React from 'react';

const ListCon: React.FC<IRequestList> = (props) => {
  const LOG_SOURCE = 'Hello World Webpart';
  const LIST_NAME = 'Requests';
  const _sp: SPFI = getSP(props.context);

  const [requestItems, setRequestItems] = useState<IRequestList[]>([]);
  const [loading, setLoading] = useState(true);

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

  const selection = new Selection({
    onSelectionChanged: () => {

    },
  });

  const getRequestItems = async () => {
    try {
      const items = await _sp.web.lists.getByTitle(LIST_NAME).items();
      console.log('Raw Item', items);
      

      setRequestItems(
        items.map((item) => ({
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
        }))
      );

      setLoading(false);
    } catch (error) {
      console.error(LOG_SOURCE, 'Error fetching request items', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getRequestItems();
  }, []);

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
      const date = new Date(dateString);
      const day = ('0' + date.getDate()).slice(-2);
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();  
      const formattedDateString = `${day}.${month}.${year}`;  
      return formattedDateString;
    }  
    return 'N/A';
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
    </div>
  );
};

export default ListCon;
