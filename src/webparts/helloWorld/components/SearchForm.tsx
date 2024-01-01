import * as React from "react";
import { DatePicker, DefaultButton, Dropdown, IDropdownOption, IPersonaProps, Label, TextField } from "@fluentui/react";
import { IMemberFormFc, ISearchForm } from "./interfaces/interfaces";
import PeoplePickerComponent from "./PeoplePickerComponent";

const SearchForm: React.FC<IMemberFormFc> = ({requestTypes, mode, initialData, onSubmit, context }) => {
  
    const initialFormData: ISearchForm = {
        Title: '',
        RequestTypeId: 0,
        RequestArea: '',
        DueDate: undefined,
        DueDateEnd: undefined,
        ExecutionDate: undefined,
        ExecutionDateEnd: undefined,
        Status:'',
        Tags: '',
        AsignedManagerId: 0,
      };

    const [formData, setFormData] = React.useState<ISearchForm>(initialFormData);

    const options: IDropdownOption[] = [
        { key: 'New', text: 'New' },
        { key: 'In Progress', text: 'In Progress' },
        { key: 'Accepted', text: 'Accepted' },
        { key: 'Rejected', text: 'Rejected' },
    ];

    const requestTypeOptions: IDropdownOption[] = requestTypes.map((option) => ({
        key: option.Title,
        text: option.Title,
    }));

    const handleChange = (
        name: keyof ISearchForm,
        value: any,
    ): void => {
        setFormData((prevData: ISearchForm) => ({ ...prevData, [name]: value }));
    };

    const handleManagerChange = (name: keyof ISearchForm, manager: IPersonaProps[]):void => {
        const managerId = manager.length>0 ? manager[0].key : undefined; 
        if (managerId === undefined || managerId === null) {
          console.log("Invalid managerId:", managerId);
          return;
        }
        const parsedManagerId = parseInt(managerId.toString(), 10);
        handleChange(name, parsedManagerId);
    }

    const handleRequestTypeChange = (name: keyof ISearchForm, requestType: string):void => {
        try {        
            const foundRequestType = requestTypes.find(
              (request) => request.Title.toLowerCase() === requestType.toLowerCase()
            );
            const requestId = foundRequestType? foundRequestType.Id: 0;
            handleChange(name, requestId);
          } catch (error) {
            console.error('Error finding request type Id by title: ', error);
            handleChange(name, 0);
          }
   
    }


    React.useEffect(() => {
        onSubmit(formData);
        console.log(formData);
    }, [formData]);

    const handleClearSearch = ():void => {
        setFormData(initialFormData);
    }

    return(
        <form>

            <div>

                <TextField 
                    label="Title" 
                    name="Title" 
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleChange("Title", e.target.value) } 
                    value={formData.Title}
                />

                <Dropdown 
                    label="Status" 
                    options={options}
                    onChange={(e, option) => handleChange("Status", option?.text || "")}
                    selectedKey={formData.Status}
                />

            <div>
                <Label>Asigned Manager</Label>
                <PeoplePickerComponent 
                    context={context} 
                    onChange={(manager)=>{handleManagerChange("AsignedManagerId", manager)}} 
                    AsignedManagerId={formData.AsignedManagerId}
                    userIsManager={true}
                />
            </div>
                

                <Dropdown 
                    label="Request Type" 
                    options={requestTypeOptions}
                    onChange={(e, option) => handleRequestTypeChange("RequestTypeId", option?.text || "")}
                    selectedKey={formData.RequestTypeId}
                />

                <DatePicker
                    label="Due Date"
                    onSelectDate={(date) => handleChange("DueDate", date ? date : undefined)}
                    value={formData.DueDate}                
                />

                <DatePicker
                    onSelectDate={(date) => handleChange("DueDateEnd", date ? date : undefined)}
                    value={formData.DueDateEnd}
                />
                
            </div>
            <div>
                
            </div>

            <DefaultButton
                onClick={handleClearSearch}
            >
                Clear Search Form
            </DefaultButton>
        </form>
    )
}

export default SearchForm;
