import * as React from "react";
import {IMemberForm, IMemberFormFc} from './interfaces/interfaces';
import { TextField } from '@fluentui/react/lib/TextField';
import { Stack, IStackStyles } from '@fluentui/react/lib/Stack';
import { DatePicker, DayOfWeek, Dropdown, IDropdownOption, PrimaryButton, addDays, addMonths } from "@fluentui/react";


const MemberForm: React.FC<IMemberFormFc> = ({requestTypes, mode, initialData, onSubmit, context }) => {
  const currentDate = new Date();
  const [formData, setFormData] = React.useState<IMemberForm>(
    initialData || {
      Title: '',
      Description: '',
      RequestTypeId: 0,
      RequestArea: '',
      DueDate: addDays(currentDate,3),
      // tags: '',
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

    // const requestTypeUpdater = requestTypeOptions.reduce<{ [key: string]: any }>((acc, option) => {
    //   acc[option.text] = option.key;
    //   return acc;
    // }, {});

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

  const stackTokens = { childrenGap: 50 };
  // const iconProps = { iconName: 'Calendar' };
  const stackStyles: Partial<IStackStyles> = { root: { width: 650 } };
  // const columnProps: Partial<IStackProps> = {
//   tokens: { childrenGap: 15 },
//   styles: { root: { width: 300 } },
// };

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
      <PrimaryButton type="submit">{mode === 'create' ? 'Create' : 'Update'}</PrimaryButton>
      </Stack>
      
     
      {/* <label>
        Tags:
        <input type="text" name="tags" value={formData.tags} onChange={handleChange} />
      </label> */}

    </form>
  );
}

export default MemberForm;