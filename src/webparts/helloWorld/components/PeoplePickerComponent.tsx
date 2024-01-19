import { CompactPeoplePicker, IPersonaProps } from "@fluentui/react";
import * as React from "react";
import Services from "./helpers/Services";
import { WebPartContext } from "@microsoft/sp-webpart-base";

interface PeoplePickerComponentProps {
    context: WebPartContext;
    onChange: (items: IPersonaProps[]) => void;
    userIsManager?: boolean;
    AsignedManagerId?:number;
    disabled?:boolean;
  }

const PeoplePickerComponent: React.FC<PeoplePickerComponentProps> = ({context, onChange, userIsManager, AsignedManagerId, disabled}) => {
  const [managers, setManagers] = React.useState<IPersonaProps[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<IPersonaProps[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const services = new Services(context);
    
    
  const fetchAsignedManager = async (AsignedManagerId:number):Promise<void> => {
      const asignedManager = await services.getUserById(AsignedManagerId);
      const asignedManagerPersona: IPersonaProps = {
          key: AsignedManagerId.toString(),
          text: asignedManager.Title,
          secondaryText: asignedManager.Email,
      };
      setSelectedItems(asignedManagerPersona ? [asignedManagerPersona] : []);
  }

  const fetchManagers = async (): Promise<void> => {
    const managersArray = await services.getManagers();
    const transformedManagers = managersArray.map((item) => ({
      key: item.Id.toString(), 
      text: item.Title,
      secondaryText: item.Email,
    }));
    setManagers(transformedManagers);
  };

  const fetchData = async ():Promise<void> => {
    try {
      if(AsignedManagerId && AsignedManagerId !== 0){await fetchAsignedManager(AsignedManagerId)}else{
        setIsLoading(true);
        setSelectedItems([]);
      }
      await fetchManagers();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  React.useEffect(() => {      
    fetchData();
  }, [context, AsignedManagerId]);

  const initialSuggestedPeople = managers.length > 0 ? [...managers.slice(0, 3)] : [];



  const onResolveSuggestions = (filterText: string, currentPersonas: IPersonaProps[]): IPersonaProps[] => {
    return filterText !== '' ? managers
      .filter(persona => persona.text && persona.text.toLowerCase().includes(filterText.toLowerCase()))
      .slice(0, 3) : initialSuggestedPeople;
  };
    
  return(
    <div>
      {!isLoading ? (<CompactPeoplePicker
        disabled={disabled}
        onResolveSuggestions={(filterText)=>onResolveSuggestions(filterText !== '' ? filterText : '', [])}
        onChange={onChange}
        defaultSelectedItems={selectedItems}
        itemLimit={1}
        inputProps={{
          'aria-label': 'People Picker',
        }}
      />):(<p>loading...</p>)}
    </div>
  );
};

export default PeoplePickerComponent;