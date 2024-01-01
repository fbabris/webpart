import { CompactPeoplePicker, IPersonaProps } from "@fluentui/react";
import * as React from "react";
import Services from "./helpers/Services";
import { WebPartContext } from "@microsoft/sp-webpart-base";

interface PeoplePickerComponentProps {
    context: WebPartContext;
    onChange: (items: IPersonaProps[]) => void;
    userIsManager?: boolean;
    AsignedManagerId?:number;
  }

const PeoplePickerComponent: React.FC<PeoplePickerComponentProps> = ({context, onChange, userIsManager, AsignedManagerId}) => {
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
      if(AsignedManagerId){await fetchAsignedManager(AsignedManagerId)}
      await fetchManagers();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {      
    fetchData();
  }, [context, AsignedManagerId]);

  const initialSuggestedPeople = managers.length > 0 ? [...managers.slice(0, 5)] : [];


  const onResolveSuggestions = (filterText: string, currentPersonas: IPersonaProps[]): IPersonaProps[] => {
    return initialSuggestedPeople;
  };
    
  return(
    <div>
      {!isLoading ? (<CompactPeoplePicker
        disabled={!userIsManager}
        onResolveSuggestions={onResolveSuggestions}
        onChange={onChange}
        defaultSelectedItems={selectedItems}
        itemLimit={1}
        inputProps={{
          onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called'),
          onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called'),
          'aria-label': 'People Picker',
        }}
      />):(<p>loading...</p>)}
    </div>
  );
};

export default PeoplePickerComponent;