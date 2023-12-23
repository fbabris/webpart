import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IMemberForm {
    Title: string;
    Description: string;
    RequestTypeId: number; 
    RequestArea: string|number;
    DueDate: Date | undefined;
    // tags: string;
};

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
    requestTypes: Array<{Id: number; Title:string; DisplayOrder:string}>
    mode: 'create' | 'update';
    initialData?: IMemberForm | null;
    onSubmit: (formData: IMemberForm) => void;
    isModalOpen: boolean;
    hideModal: () => void;
    context: WebPartContext;
  }

  export interface IRequestTypes{
    Id: number;
    Title: string; 
    DisplayOrder: string;
  }

  export interface IMemberFormFc{
    requestTypes: Array<{Id:number; Title: string; DisplayOrder: string }>;
    mode: 'create' | 'update';
    initialData?: IMemberForm | null;
    onSubmit: (formData: IMemberForm) => void;
    context?: any;
  }