import * as React from "react";
import { IMemberForm, IMemberFormFc} from './interfaces/interfaces';
import { TextField } from '@fluentui/react/lib/TextField';
import { Stack, IStackStyles } from '@fluentui/react/lib/Stack';
import { DatePicker, DayOfWeek, Dropdown, IDropdownOption, PrimaryButton, addDays, addMonths } from "@fluentui/react";
import { ModernTaxonomyPicker } from "@pnp/spfx-controls-react";
import { ITermInfo } from "@pnp/spfx-controls-react/node_modules/@pnp/sp/taxonomy/";



const MemberForm: React.FC<IMemberFormFc> = ({requestTypes, mode, initialData, onSubmit, context }) => {
  const currentDate = new Date();
  const [formData, setFormData] = React.useState<IMemberForm>(
    initialData || {
      Title: '',
      Description: '',
      RequestTypeId: 0,
      RequestArea: '',
      DueDate: addDays(currentDate,3),
      Tags: '',
    });

    React.useEffect(() => {
      const fetchData = async () => {
        if (initialData) {
          setFormData(initialData);
        }
      };
  
      fetchData();
    }, [initialData]);
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
        const tagsString = terms.map(term => `${term.labels[0].name}|${term.id}`).join(";");
        setFormData((prevData: IMemberForm) => ({
          ...prevData,
          Tags: tagsString,
        }));
      }
    };

  const stackTokens = { childrenGap: 50 };
  const stackStyles: Partial<IStackStyles> = { root: { width: 650 } };

  return (
    <form onSubmit={handleSubmit}>
      <Stack tokens={stackTokens} styles={stackStyles}>
        <TextField label="Title" required name="Title" value={formData.Title} onChange={handleTextFieldChange} />
        <TextField label="Description" required name="Description" value={formData.Description} onChange={handleTextFieldChange} multiline rows={5}/>
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
        <ModernTaxonomyPicker 
          allowMultipleSelections={true}
          termSetId="dc544f14-4bee-4bef-9ce6-b36622cb704b"
          panelTitle="Select Term"
          label="Tags"
          context={context}
          onChange={onTaxPickerChange}
        />
      <PrimaryButton type="submit">{mode === 'create' ? 'Create' : 'Update'}</PrimaryButton>
      </Stack>

    </form>
  );
}

export default MemberForm;