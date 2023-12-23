import * as React from 'react';
import type { IHelloWorldProps } from './interfaces/interfaces';
import RequestList from './RequestList';

const HelloWorld: React.FC<IHelloWorldProps> = (props: IHelloWorldProps): JSX.Element => {

  return (
      <div>
        <RequestList ID={0} Title={''} context={props.context} Description={''} DueDate={undefined} ExecutionDate={undefined} RequestTypeId={0} RequestArea={''} AsignedManagerId={0} Tags={''} Status={''} />
      </div>
  );
};

export default HelloWorld;
