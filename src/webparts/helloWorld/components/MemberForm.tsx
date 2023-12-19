import * as React from "react";
import {IMemberForm} from './interfaces/interfaces';

// import { ITerm, ITermSet, taxonomy } from '@pnp/sp-taxonomy';

const MemberForm: React.FC<{
  mode: 'create' | 'update';
  initialData?: IMemberForm | null;
  onSubmit: (formData: IMemberForm) => void;
}> = ({ mode, initialData, onSubmit }) => {

  const [formData, setFormData] = React.useState<IMemberForm>(
    initialData || {
      Title: '',
      Description: '',
      // requestType: '',
      RequestArea: '',
      DueDate: '',
      // tags: '',
    });
    React.useEffect(() => {
      if (initialData) {
        setFormData(initialData);
      }
    }, [initialData]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prevData: IMemberForm) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const requestAreasOptions = [
    { label: 'IT', value: 'IT' },
    { label: 'Sales', value: 'Sales' },
    { label: 'Project Management', value: 'Project Management' },
    { label: 'HR', value: 'hr' },
    { label: 'Finance and Accounting', value: 'Finance and Accounting' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'R&D', value: 'R&D' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" name="Title" value={formData.Title} onChange={handleChange} required />
      </label>

      <label>
        Description:
        <textarea name="Description" value={formData.Description} onChange={handleChange} required />
      </label>

      {/* <label>
        Request Type:
        <input type="text" name="requestType" value={formData.requestType} onChange={handleChange} required />
      </label> */}

      <label>
        Request Area:
        <select name="RequestArea" value={formData.RequestArea} onChange={handleChange}>
          <option value="">Select Request Area</option>
          {requestAreasOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Due Date:
        <input type="datetime-local" name="DueDate" value={formData.DueDate} onChange={handleChange} required />
      </label>

      {/* <label>
        Tags:
        <input type="text" name="tags" value={formData.tags} onChange={handleChange} />
      </label> */}

      <button type="submit">{mode === 'create' ? 'Create' : 'Update'}</button>
    </form>
  );
}

export default MemberForm;