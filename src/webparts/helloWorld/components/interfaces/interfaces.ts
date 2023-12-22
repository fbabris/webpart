import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IMemberForm {
    Title: string;
    Description: string;
    // requestType: string; 
    RequestArea: string;
    DueDate: string | undefined;
    // tags: string;
};

export interface IRequestList {
    ID: number;
    Title: string;
    Description: string;
    DueDate: string | undefined;
    ExecutionDate: string | undefined;
    RequestType: string;
    RequestArea: string;
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
  }

  export interface ModalProps {
    mode: 'create' | 'update';
    initialData?: IMemberForm | null;
    onSubmit: (formData: IMemberForm) => void;
    isModalOpen: boolean;
    hideModal: () => void;
  }