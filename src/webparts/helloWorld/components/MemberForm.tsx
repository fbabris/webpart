import * as React from "react";
import {IMemberForm} from './interfaces/interfaces';
// import { ITerm, ITermSet, taxonomy } from '@pnp/sp-taxonomy';


const MemberForm: React.FC = () => {
  const [formData, setFormData] = React.useState<IMemberForm>({
      title: '',
      description: '',
      requestType: '',
      requestArea: '',
      dueDate: '',
      tags: '',
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prevData: IMemberForm) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // submission logic
      console.log('Form data submitted:', formData);
  };

  const requestAreasOptions = [
    { label: 'IT', value: 'it' },
    { label: 'Sales', value: 'sales' },
    { label: 'Project Management', value: 'projectmanagement' },
    { label: 'HR', value: 'hr' },
    { label: 'Finance and Accounting', value: 'financeandaccounting' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'R&D', value: 'rnd' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
      </label>

      <label>
        Description:
        <textarea name="description" value={formData.description} onChange={handleChange} required />
      </label>

      <label>
        Request Type:
        <input type="text" name="requestType" value={formData.requestType} onChange={handleChange} required />
      </label>

      <label>
        Request Area:
        <select name="requestArea" value={formData.requestArea} onChange={handleChange}>
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
        <input type="datetime-local" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
      </label>

      <label>
        Tags:
        <input type="text" name="tags" value={formData.tags} onChange={handleChange} />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
}

export default MemberForm;