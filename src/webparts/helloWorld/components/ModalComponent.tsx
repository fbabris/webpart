import * as React from 'react';
import { Modal, IconButton, mergeStyleSets, FontWeights } from '@fluentui/react/lib';
import MemberForm from './MemberForm';
import { createFormData, updateFormData } from './helpers/CRUD';
import { ModalProps } from './interfaces/interfaces';
import { useBoolean } from '@fluentui/react-hooks';
import * as moment from 'moment';


const ModalComponent: React.FC<ModalProps> = (props: ModalProps) => {

  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
  const [formDataForUpdate, setFormDataForUpdate] = React.useState<any>(null);

  React.useEffect(() => {
    if (props.mode === 'update' && props.initialData) {
      const { DueDate, ...restData } = props.initialData;
  
      // Convert DueDate from string to Date
      const convertedDueDate = DueDate ? moment(DueDate).toDate() : undefined;
  
      setFormDataForUpdate({
        ...restData,
        DueDate: convertedDueDate,
      });
      showModal();
    } else {
      setFormDataForUpdate(null);
      showModal();
    }
  }, [props.isModalOpen, props.mode, props.initialData]);

  const handleCreate = (formData: any) => {
    createFormData(formData);
    console.log('Creating:', formData);
    hideModal();
  };

  const handleUpdate = (formData: any) => {
    updateFormData(formData.ID, formData);    
    console.log('Updating:', formData);
    hideModal();
  };

  // const theme = getTheme;

  const contentStyles = mergeStyleSets({
    container: {
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
        onDismiss={hideModal}
        isBlocking={false}
        containerClassName={contentStyles.container}
      >
        <div className={contentStyles.header}>          
          <h2 className={contentStyles.heading} id="modalHeader">{props.mode === 'create' ? 'Create a New' : 'Update the'} Request </h2>
          <IconButton
            iconProps={{ iconName: 'Cancel' }}
            ariaLabel="Close popup modal"
            onClick={hideModal}
          />
        </div>
        <div className={contentStyles.body} id="modalBody">
          <MemberForm
            requestTypes={props.requestTypes}
            mode={props.mode}
            initialData={formDataForUpdate}
            onSubmit={props.mode === 'create' ? handleCreate : handleUpdate}
            context={props.context}
          />

        </div>
      </Modal>
  );
};

export default ModalComponent;