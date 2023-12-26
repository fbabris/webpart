import * as React from "react";
import { IMemberForm, IMemberFormFc} from './interfaces/interfaces';
import { TextField } from '@fluentui/react/lib/TextField';
import { Stack, IStackStyles } from '@fluentui/react/lib/Stack';
import { DatePicker, DayOfWeek, Dropdown, IDropdownOption, IPersonaProps, Label, PrimaryButton, addDays, addMonths } from "@fluentui/react";
import { ModernTaxonomyPicker } from "@pnp/spfx-controls-react";
import { ITermInfo } from "@pnp/spfx-controls-react/node_modules/@pnp/sp/taxonomy/";
import PeoplePickerComponent from "./PeoplePickerComponent";
// import Services from "./helpers/Services";



const MemberForm: React.FC<IMemberFormFc> = ({requestTypes, mode, initialData, onSubmit, context, userIsManager }) => {
  // const services = new Services(context);
  const currentDate = new Date();
  const [formData, setFormData] = React.useState<IMemberForm>(
    initialData || {
      Title: '',
      Description: '',
      RequestTypeId: 0,
      RequestArea: '',
      DueDate: addDays(currentDate,3),
      Tags: '',
      AsignedManagerId: 0,
    });

    const [hasTags, setHasTags] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState(true);

    const fetchData = async () => {
      if (initialData) {
        console.log('Initial Data:', initialData);
        
  
        if (initialData.Tags && initialData.Tags.length > 0) {
          console.log('Has Tags: true');
          setHasTags(true);
             
          try {
            const initialTagsArray = initialData.Tags.map((tag:any) => ({
              id: tag.TermGuid,
              labels:
                [{
                  name: tag.Label,
                  isDefault: true,
                  languageTag: 'en-US',
                }],
            })); 
            console.log(initialTagsArray);   
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
          console.log('Has Tags: false');
          setHasTags(false);
          setFormData(initialData);
          setIsLoading(false);
        }
      }
    };
    
    React.useEffect(() => {
         
      fetchData();
    }, [initialData]);

    // React.useEffect(() => {
    //   const fetchData = async () => {
    //     if (initialData) {
    //       if(initialData.Tags && initialData.Tags.length>0){
    //         const mappedTags = initialData.Tags.map((tag: { Label: string; TermGuid: string; }) => ({
    //         name: tag.Label,
    //         id: tag.TermGuid            
    //       }));
    //       const updatedData = {
    //           ...initialData,
    //           Tags: mappedTags
    //         };          
    //       setFormData(updatedData);
    //       }else{
    //         setFormData(initialData);
    //       }

    //     }        
    //   };
  
    //   fetchData();
    // }, [initialData]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prevData: IMemberForm) => ({ ...prevData, [name]: value }));
    };

    const handleTextFieldChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined): void => {
      handleChange(event as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>);
    };

    const handleRequestAreaChange = (
      event: React.FormEvent<HTMLDivElement>,
      option?: IDropdownOption<any>,
      index?: number | undefined
    ) => {
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
      option?: IDropdownOption<any>,
      index?: number | undefined
    ) => {
      if (option) {
        const { text } = option;
        const requestId = getRequestTypeId(text);
        setFormData((prevData: IMemberForm) => ({
          ...prevData,
          RequestTypeId: requestId !== undefined ? requestId : 0, // Set to 0 if requestId is undefined
        }));
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

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

    const handleDatePickerChange = (date: Date | null | undefined): void => {
      if (date) {
        setFormData((prevData: IMemberForm) => ({ ...prevData, DueDate: date }));
      }
    };

    const getRequestTypeId = (requestType: string): number | undefined => {
      const foundType = requestTypes.find((type) => type.Title === requestType);
      return foundType?.Id;
    };

    const getRequestTypeFromId = (requestTypeId:number):string | undefined => {
      const foundTypeId = requestTypes.find((type)=>type.Id === requestTypeId);
      return foundTypeId?.Title;
    }

    const onTaxPickerChange = (terms: ITermInfo[]) => {
      if (terms) {
        setFormData((prevData: IMemberForm) => ({
          ...prevData,
          Tags: terms,
        }));
        console.log('tags', terms);
      }
    };
    const handlePeoplePickerChange = async (manager: IPersonaProps[]) => {
      const managerId = manager[0].key;
      if (managerId === undefined || managerId === null) {
        console.log("Invalid managerId:", managerId);
        return;
      }
      const parsedManagerId = parseInt(managerId.toString(), 10);
      await setFormData((prevData: IMemberForm) => ({
        ...prevData,
        AsignedManagerId: parsedManagerId,
      }));
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
        // styles={dropdownStyles}
        />
        <Dropdown
        id="RequestType"
        
        onChange={(e, option) => handleRequestTypeChange( e, option)}
        placeholder="Select an option"
        label="Request Type"
        options={requestTypeOptions}
        selectedKey={getRequestTypeFromId(formData.RequestTypeId)}
        // styles={dropdownStyles}
        />
        <DatePicker
          onSelectDate={(date) => handleDatePickerChange(date)}
          isRequired
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
          <PeoplePickerComponent context={context} onChange={(manager)=>{handlePeoplePickerChange(manager)}} userIsManager={userIsManager} AsignedManagerId={formData.AsignedManagerId}/>
        </div>
      <PrimaryButton type="submit">{mode === 'create' ? 'Create' : 'Update'}</PrimaryButton>
      </Stack>

    </form>
  );
}

export default MemberForm;