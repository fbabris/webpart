import * as React from 'react';
import { Modal, IconButton, mergeStyleSets, FontWeights, addDays } from '@fluentui/react/lib';
import MemberForm from './MemberForm';
import FormDataManager from './helpers/FormDataManager';
import { IMemberForm, IUpdateHandler, ModalProps } from './interfaces/interfaces';
import * as moment from 'moment';
import Services from './helpers/Services';

const ModalComponent: React.FC<ModalProps> = (props: ModalProps) => {

  const initialDataProps:IMemberForm = {
    Title: '',
    Description: '',
    RequestTypeId: 0,
    RequestArea: '',
    DueDate: addDays(new Date, 3),
    ExecutionDate: undefined,
    Tags: [],
    Status:'', 
    AsignedManagerId: 0,
  }

  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [formDataForUpdate, setFormDataForUpdate] = React.useState<IMemberForm>(props.initialData?props.initialData:initialDataProps);
  const formDataManager = new FormDataManager(props.context);
  const services = new Services;

  

  React.useEffect(() => {
    if (props.mode !== 'create' && props.initialData) {
      const { DueDate, ...restData } = props.initialData;
      const convertedDueDate = DueDate ? moment(DueDate).toDate() : undefined;  
      setFormDataForUpdate({
        ...restData,
        DueDate: convertedDueDate,
      });
      setIsModalOpen (true);
    } else {
      setFormDataForUpdate(initialDataProps);
      setIsModalOpen(true);
    }
  }, [props.isModalOpen, props.mode, props.initialData]);

  const handleCreate = async (formData: IMemberForm):Promise<void> => {
    await formDataManager.createFormData(formData);
    props.hideModal();
  };

  const handleUpdate = async (formData: IUpdateHandler):Promise<void> => {
    await formDataManager.updateFormData(formData.ID, formData);    
    props.hideModal();
  };

  const contentStyles = mergeStyleSets({
    container: {
      backgroundColor: services.colorCode(props.initialData? props.initialData.Status : ""),
      display: 'flex',
      flexFlow: 'column nowrap',
      alignItems: 'stretch',
    },
    header: {
      flex: 'auto',
      justifyContent: 'space-between',
      borderTop: `4px solid black`,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '20px 40px 20px 40px',
    },
    heading: {
      color: "black",
      fontWeight: FontWeights.semibold,
      fontSize: '2rem',
      margin: '0',
    },
    body: {
      flex: '4 4 auto',
      padding: '0px 40px 40px 40px',
      overflowY: 'hidden',
      selectors: {
        p: { margin: '14px 0' },
        'p:first-child': { marginTop: 0 },
        'p:last-child': { marginBottom: 0 },
      }
    }
  });

  return (
      <Modal
        titleAriaId="modalHeader"
        isOpen={isModalOpen}
        onDismiss={()=>props.hideModal()}
        isBlocking={false}
        containerClassName={contentStyles.container}
      >
        <div className={contentStyles.header}>          
          {props.initialData && props.initialData.Status === 'New' ? 
            <h2 className={contentStyles.heading} id="modalHeader">{props.mode === 'create' ? 'Create a New' : 'Update the'} Request </h2> : 
            <h2 className={contentStyles.heading} id="modalHeader">Request: {formDataForUpdate.Title}</h2>
          }
          <IconButton
            iconProps={{ iconName: 'Cancel' }}
            ariaLabel="Close popup modal"
            onClick={props.hideModal}
          />
        </div>
        <div className={contentStyles.body} id="modalBody">
          <MemberForm
            requestTypes={props.requestTypes}
            mode={props.mode}
            initialData={formDataForUpdate}
            onSubmit={props.mode === 'create' ? handleCreate : handleUpdate}
            context={props.context}
            userIsManager={props.userIsManager}
          />

        </div>
      </Modal>
  );
};

export default ModalComponent;