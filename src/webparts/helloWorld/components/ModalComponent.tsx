import * as React from 'react';
import { Modal, IconButton } from '@fluentui/react/lib';
import MemberForm from './MemberForm';
import { createFormData, updateFormData } from './CRUD';
import { ModalProps } from './interfaces/interfaces';
import { useBoolean } from '@fluentui/react-hooks';


const ModalComponent: React.FC<ModalProps> = (props: ModalProps) => {

  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
  const [formDataForUpdate, setFormDataForUpdate] = React.useState<any>(null);

  React.useEffect(() => {
    if (props.mode === 'update' && props.initialData) {
      setFormDataForUpdate(props.initialData);
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

  return (
    <div>
      <Modal
        titleAriaId="modalHeader"
        isOpen={isModalOpen}
        onDismiss={hideModal}
        isBlocking={false}
        containerClassName="ms-modalExample-container"
      >
        <div className="ms-modalExample-header">
          <span id="modalHeader">{props.mode === 'create' ? 'Create' : 'Update'} Request </span>
          <IconButton
            iconProps={{ iconName: 'Cancel' }}
            ariaLabel="Close popup modal"
            onClick={hideModal}
          />
        </div>
        <div id="modalBody">
          <MemberForm
            mode={props.mode}
            initialData={formDataForUpdate}
            onSubmit={props.mode === 'create' ? handleCreate : handleUpdate}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ModalComponent;