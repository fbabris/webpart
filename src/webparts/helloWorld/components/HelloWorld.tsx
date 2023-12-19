import * as React from 'react';
// import styles from './HelloWorld.module.scss';
import type { IHelloWorldProps } from './interfaces/interfaces';
// import { escape } from '@microsoft/sp-lodash-subset';
// import MemberForm from './MemberForm';
import ListCon from './ListCon';
// import ModalComponent from './ModalComponent';
// import { useBoolean } from '@fluentui/react-hooks';

const HelloWorld: React.FC<IHelloWorldProps> = (props: IHelloWorldProps): JSX.Element => {
  // const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);

  // const handleSubmit = (formData: any) => {
  //   // Your form submission logic goes here
  //   console.log('Form submitted:', formData);
  // };

  return (
    <section>
      <div>
        <ListCon ID={0} Title={''} context={props.context} Description={''} DueDate={undefined} ExecutionDate={undefined} RequestType={''} RequestArea={''} AsignedManager={''} Tags={''} Status={''} />
{/*       

    <ModalComponent
      mode="create"
      onSubmit={handleSubmit}
      isModalOpen={isModalOpen}
      hideModal={hideModal}
    /> */}

      </div>
    </section>
  );
};

export default HelloWorld;
