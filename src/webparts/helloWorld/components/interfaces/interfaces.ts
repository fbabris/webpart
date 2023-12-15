import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IMemberForm {
    title: string;
    description: string;
    requestType: string; 
    requestArea: string;
    dueDate: string;
    tags: string;
};

export interface IRequestList {
    ID: number;
    Title: string;
    Description: string;
    DueDate: Date | undefined;
    ExecutionDate: Date | undefined;
    RequestType: string;
    RequestArea: string;
    AsignedManager: string;
    Tags: string;
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
