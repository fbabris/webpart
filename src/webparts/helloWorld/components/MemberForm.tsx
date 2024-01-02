import * as React from "react";
import { IMemberForm, IMemberFormFc, Tag} from './interfaces/interfaces';
import { TextField } from '@fluentui/react/lib/TextField';
import { Stack, IStackStyles } from '@fluentui/react/lib/Stack';
import { DatePicker, DayOfWeek, Dropdown, IDropdownOption, IPersonaProps, Label, PrimaryButton, addDays, addMonths } from "@fluentui/react";
import { ModernTaxonomyPicker } from "@pnp/spfx-controls-react";
import { ITermInfo } from "@pnp/spfx-controls-react/node_modules/@pnp/sp/taxonomy/";
import PeoplePickerComponent from "./PeoplePickerComponent";

const MemberForm: React.FC<IMemberFormFc> = ({requestTypes, mode, initialData, onSubmit, context, userIsManager }) => {
  const currentDate = new Date();
  const [formData, setFormData] = React.useState<IMemberForm>(
    initialData || {
      Title: '',
      Description: '',
      RequestTypeId: 0,
      RequestArea: '',
      DueDate: addDays(currentDate,3),
      ExecutionDate: undefined,
      Tags: '',
      Status: '',
      AsignedManagerId: 0,
    });

    const [hasTags, setHasTags] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState(true);  
    
    const options: IDropdownOption[] = [
      { key: 'IT', text: 'IT' },
      { key: 'Sales', text: 'Sales' },
      { key: 'Project Management', text: 'Project Management' },
      { key: 'HR', text: 'HR' },
      { key: 'Finance and Accounting', text: 'Finance and Accounting' },
      { key: 'Marketing', text: 'Marketing' },
      { key: 'R&D', text: 'R&D' },
    ];

    const requestTypeOptions: IDropdownOption[] = requestTypes.map((option) => ({
      key: option.Title,
      text: option.Title,
    }));

    const getRequestTypeId = (requestType: string): number | undefined => {
      const foundType = requestTypes.find((type) => type.Title === requestType);
      return foundType?.Id;
    };

    const getRequestTypeFromId = (requestTypeId:number):string | undefined => {
      const foundTypeId = requestTypes.find((type)=>type.Id === requestTypeId);
      return foundTypeId?.Title;
    }

    const fetchData = (): void => {
      if (initialData) {        
  
        if (initialData.Tags && initialData.Tags.length > 0) {
          setHasTags(true);
             
          try {
            const initialTagsArray = initialData.Tags.map((tag:Tag) => ({
              id: tag.TermGuid,
              labels:
                [{
                  name: tag.Label,
                  isDefault: true,
                  languageTag: 'en-US',
                }],
            })); 
             
            setFormData((prevData) => ({
              ...prevData,
              Tags: initialTagsArray,
            }));
          } catch (error) {
            console.error('Error fetching tags:', error);
          } finally {
            setHasTags(true);
            setIsLoading(false);
          }
        } else {
          setHasTags(false);
          setFormData(initialData);
          setIsLoading(false);
        }
      }
    };
    
    React.useEffect(() => {
      fetchData();
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>):void => {
      const { name, value } = e.target;
      setFormData((prevData: IMemberForm) => ({ ...prevData, [name]: value }));
    };

    const handleTextFieldChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined): void => {
      handleChange(event as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
    };

    const handleRequestAreaChange = (
      event: React.FormEvent<HTMLDivElement>,
      option?: IDropdownOption<{key:string, text:string}>,
      index?: number | undefined
    ):void => {
      if (option) {
        const { key } = option;
        setFormData((prevData: IMemberForm) => ({
          ...prevData,
          RequestArea: key as string,
        }));
      }
    };

    const handleRequestTypeChange = (
      event: React.FormEvent<HTMLDivElement>,
      option?: IDropdownOption<{key:string, text:string}>,
      index?: number | undefined
    ): void => {
      if (option) {
        const { text } = option;
        const requestId = getRequestTypeId(text);
        setFormData((prevData: IMemberForm) => ({
          ...prevData,
          RequestTypeId: requestId !== undefined ? requestId : 0,
        }));
      }
    };

    const handleDatePickerChange = (date: Date | null | undefined): void => {
      if (date) {
        setFormData((prevData: IMemberForm) => ({ ...prevData, DueDate: date }));
      }
    };

    const onTaxPickerChange = (terms: ITermInfo[]):void => {
      if (terms) {
        setFormData((prevData: IMemberForm) => ({
          ...prevData,
          Tags: terms,
        }));
      }
    };

    const handlePeoplePickerChange = (manager: IPersonaProps[]):void => {
      const managerId = manager[0].key; 
      if (managerId === undefined || managerId === null) {
        return;
      }
      const parsedManagerId = parseInt(managerId.toString(), 10);
      setFormData((prevData: IMemberForm) => ({
        ...prevData,
        AsignedManagerId: parsedManagerId,
      }));
    };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>):Promise<void> => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const stackTokens = { childrenGap: 50 };
  const stackStyles: Partial<IStackStyles> = { root: { width: 650 } };
  const initialValuesProps = hasTags ? { initialValues: formData.Tags} : {};

  return (
    <form onSubmit={handleSubmit}>
      <Stack tokens={stackTokens} styles={stackStyles}>
        <TextField label="Title" required name="Title" value={formData.Title} onChange={handleTextFieldChange} disabled={userIsManager}/>
        <TextField label="Description" required name="Description" value={formData.Description} onChange={handleTextFieldChange} multiline rows={5} disabled={userIsManager}/>
        <Dropdown
        id="RequestArea"
        onChange={(e, option) => handleRequestAreaChange(e, option)}
        placeholder="Please select a value"
        label="Request Area"
        options={options}
        selectedKey={formData.RequestArea}
        />
        <Dropdown
        id="RequestType"
        
        onChange={(e, option) => handleRequestTypeChange( e, option)}
        placeholder="Select an option"
        label="Request Type"
        options={requestTypeOptions}
        selectedKey={getRequestTypeFromId(formData.RequestTypeId)}
        />
        <DatePicker
          onSelectDate={(date) => handleDatePickerChange(date)}
          isRequired={!userIsManager}
          disabled={userIsManager}
          label="Due Date"
          placeholder="Select a date..."
          ariaLabel="Select a date"
          value={formData.DueDate}
          firstDayOfWeek={DayOfWeek.Monday}
          minDate={addDays(new Date(), 3)}
          maxDate={addMonths(new Date(), 1)}
          highlightCurrentMonth={true}
          showWeekNumbers={true}
          firstWeekOfYear={1}
          showMonthPickerAsOverlay={true}
          showGoToToday={true}
        />
        {!isLoading && (
          <ModernTaxonomyPicker 
            {...initialValuesProps}
            allowMultipleSelections={true}
            termSetId="dc544f14-4bee-4bef-9ce6-b36622cb704b"
            panelTitle="Select Term"
            label="Tags"
            context={context}
            onChange={onTaxPickerChange}
          />
        )}
        <div>
          <Label>Asigned Manager</Label>
          <PeoplePickerComponent 
            context={context} 
            onChange={(manager)=>{handlePeoplePickerChange(manager)}} 
            userIsManager={userIsManager} 
            AsignedManagerId={formData.AsignedManagerId}
          />
        </div>
      <PrimaryButton type="submit">{mode === 'create' ? 'Create' : 'Update'}</PrimaryButton>
      </Stack>

    </form>
  );
}

export default MemberForm;