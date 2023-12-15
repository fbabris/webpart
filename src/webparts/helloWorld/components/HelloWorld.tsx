import * as React from 'react';
import styles from './HelloWorld.module.scss';
import type { IHelloWorldProps } from './interfaces/interfaces';
// import { escape } from '@microsoft/sp-lodash-subset';
import MemberForm from './MemberForm';
import ListCon from './ListCon';
import { PrimaryButton } from '@fluentui/react/lib/Button';

const HelloWorld: React.FC<IHelloWorldProps> = (props: IHelloWorldProps): JSX.Element => {
  const { hasTeamsContext, context } = props;

  const [showMemberForm, setShowMemberForm] = React.useState(false);

  const handleCreateRequestClick = () => {
    setShowMemberForm(!showMemberForm); // Toggle the state
  };

  return (
    <section className={`${styles.helloWorld} ${hasTeamsContext ? styles.teams : ''}`}>
      <div className={styles.welcome}>
        <ListCon ID={0} Title={''} context={context} Description={''} DueDate={undefined} ExecutionDate={undefined} RequestType={''} RequestArea={''} AsignedManager={''} Tags={''} Status={''} />

        <PrimaryButton onClick={handleCreateRequestClick}>Create a New Request</PrimaryButton>

        {showMemberForm && <MemberForm />}
      </div>
    </section>
  );
};

export default HelloWorld;
