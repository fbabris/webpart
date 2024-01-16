import { WebPartContext } from "@microsoft/sp-webpart-base";
import { ITaxonomyLocalProperty } from "@pnp/sp/taxonomy";
// import { ITermInfo } from "@pnp/spfx-controls-react/node_modules/@pnp/sp/taxonomy/";
export interface Tag {
  Label: string;
  TermGuid: string;
  id: string;
  labels: {
    name: string;
    isDefault: boolean;
    languageTag: string;
  }[];
}
export interface IMemberForm {
    Title: string;
    Description?: string;
    RequestTypeId: number; 
    RequestArea: string|number;
    DueDate: Date | undefined;
    ExecutionDate: Date | undefined;
    Status: string;
    Tags: string | any;
    AsignedManagerId: number; 
}

export interface IRequestList {
    ID: number;
    Title: string;
    Description: string;
    DueDate: Date | undefined;
    ExecutionDate: Date | undefined;
    RequestTypeId: number;
    RequestArea: string|number;
    AsignedManagerId: number;
    Tags: any;
    Status: string;
    context: WebPartContext;
    [key: string]:any;
}

export interface IHelloWorldProps {
    description: string;
    isDarkTheme: boolean;
    environmentMessage: string;
    hasTeamsContext: boolean;
    userDisplayName: string;
    context: WebPartContext;
    className?: string;
  }

  export interface ModalProps {
    requestTypes: Array<IRequestTypes>
    mode: 'create' | 'update';
    initialData?: IMemberForm | undefined;
    onSubmit: (formData: IMemberForm) => void;
    isModalOpen: boolean;
    hideModal: () => void;
    context: WebPartContext;
    userIsManager: boolean;
  }

  export interface IRequestTypes{
    Id: number;
    Title: string; 
    DisplayOrder: string;
  }

  export interface IMemberFormFc{
    requestTypes: Array<IRequestTypes>;
    mode?: 'create' | 'update';
    initialData?: IMemberForm | undefined;
    onSubmit: (formData: IMemberForm) => void;
    context: any;
    userIsManager?: boolean;
  }

  export interface CustomTermInfo {
    id: string;
    name: string;
    path: string;
    termSet: string;
    localProperties: ITaxonomyLocalProperty[];
  }

  export interface IUpdateHandler extends IMemberForm{
    ID: number;
  }

  export interface ISearchForm extends IMemberForm{
    DueDateEnd: Date | undefined;
    ExecutionDateEnd: Date | undefined;
  }

  export interface IListTable {
    filteredRequestItems: Array <IRequestList>;
    handleSort: (column: string)=>void;
    sortConfig: {column: string, direction: 'asc' | 'desc'};
    handleUpdate: (item: IRequestList)=>void;
    usersArray: { [key: number]: string };
    handleDelete: (item: IRequestList)=>void;
  }