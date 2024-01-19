import * as React from "react";
import { DatePicker, DefaultButton, Dropdown, IDropdownOption, IPersonaProps, Label, TextField } from "@fluentui/react";
import { IMemberFormFc, ISearchForm } from "./interfaces/interfaces";
import PeoplePickerComponent from "./PeoplePickerComponent";
import { ModernTaxonomyPicker } from "@pnp/spfx-controls-react";
import 'office-ui-fabric-core/dist/css/fabric.min.css';

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
        Tags: [],
        AsignedManagerId: 0,
      };

    const [formData, setFormData] = React.useState<ISearchForm>(initialFormData);

    const options: IDropdownOption[] = [
        { key: 'New', text: 'New' },
        { key: 'In Progress', text: 'In Progress' },
        { key: 'Accepted', text: 'Accepted' },
        { key: 'Rejected', text: 'Rejected' },
    ];

    const requestAreaOptions: IDropdownOption[] = [
        { key: 'IT', text: 'IT' },
        { key: 'Sales', text: 'Sales' },
        { key: 'Project Management', text: 'Project Management' },
        { key: 'HR', text: 'HR' },
        { key: 'Finance and Accounting', text: 'Finance and Accounting' },
        { key: 'Marketing', text: 'Marketing' },
        { key: 'R&D', text: 'R&D' },
    ]

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

    const requestTypeTranslate = (requestId:number):string|number => {
        const foundRequestType = requestTypes.find((request) => request.Id === requestId);
        return foundRequestType? foundRequestType.Title: 0; 
    }

    const rowContainerStyle = {
        display: 'flex',
        alignItems: 'flex-end',
    }

    React.useEffect(() => {
        onSubmit(formData);
    }, [formData]);

    const handleClearSearch = ():void => {
        setFormData(initialFormData);
    }

    return(
        <form>

            <div className="ms-Grid-row" style={rowContainerStyle}>

                <TextField
                    placeholder="Search by Title"
                    className="ms-Grid-col ms-sm3" 
                    label="Title" 
                    name="Title" 
                    onChange={(e:React.ChangeEvent<HTMLInputElement>) => handleChange("Title", e.target.value) } 
                    value={formData.Title}
                />

                <Dropdown
                    placeholder="Pick item status"
                    className="ms-Grid-col ms-sm3" 
                    label="Status" 
                    options={options}
                    onChange={(e, option) => handleChange("Status", option?.text || "")}
                    selectedKey={formData.Status}
                />

                <div className="ms-Grid-col ms-sm3">
                    <Label>Asigned Manager</Label>
                    <PeoplePickerComponent 
                        context={context} 
                        onChange={(manager)=>{handleManagerChange("AsignedManagerId", manager)}} 
                        AsignedManagerId={formData.AsignedManagerId}
                        userIsManager={true}
                        disabled = {false}
                    />
                </div>
                

                <Dropdown
                    placeholder="Pick request type"
                    className="ms-Grid-col ms-sm3"
                    label="Request Type" 
                    options={requestTypeOptions}
                    onChange={(e, option) => handleRequestTypeChange("RequestTypeId", option?.text || "")}
                    selectedKey={requestTypeTranslate(formData.RequestTypeId)}
                />
            </div>

            <div className="ms-Grid-row" style={rowContainerStyle}>
                <DatePicker
                    placeholder="From"
                    className="ms-Grid-col ms-sm3"
                    label="Due Date"
                    onSelectDate={(date) => handleChange("DueDate", date ? date : undefined)}
                    value={formData.DueDate}                
                />

                <DatePicker
                    placeholder="To"
                    className="ms-Grid-col ms-sm3"
                    onSelectDate={(date) => handleChange("DueDateEnd", date ? date : undefined)}
                    value={formData.DueDateEnd}
                />

                <DatePicker
                    placeholder="From"
                    className="ms-Grid-col ms-sm3"
                    label="Execution Date"
                    onSelectDate={(date) => handleChange("ExecutionDate", date ? date : undefined)}
                    value={formData.ExecutionDate}                
                />

                <DatePicker
                    placeholder="To"
                    className="ms-Grid-col ms-sm3"
                    onSelectDate={(date) => handleChange("ExecutionDateEnd", date ? date : undefined)}
                    value={formData.ExecutionDateEnd}
                />
            </div>
            
            <div className="ms-Grid-row" style={rowContainerStyle}>
                <div className="ms-Grid-col ms-sm3">
                    <DefaultButton
                        onClick={handleClearSearch}
                    >
                        Clear Search Form
                    </DefaultButton>
                </div>
                <div className="ms-Grid-col ms-sm6">
                    <ModernTaxonomyPicker
                        key={formData.Tags.length}
                        initialValues={formData.Tags}                        
                        placeHolder="Chose Tags"
                        allowMultipleSelections={true}
                        termSetId="dc544f14-4bee-4bef-9ce6-b36622cb704b"
                        panelTitle="Select Term"
                        label="Tags"
                        context={context}
                        onChange={(taxTerms) => handleChange("Tags", taxTerms? taxTerms : undefined)}
                    />
                </div>
                <Dropdown
                    placeholder="Pick request area"
                    className="ms-Grid-col ms-sm3"
                    label="Request Area"
                    options={requestAreaOptions}
                    onChange={(e, option) => handleChange('RequestArea', option?.text || "")}
                    selectedKey={formData.RequestArea}
                />

            </div>

        </form>
    )
}

export default SearchForm;
