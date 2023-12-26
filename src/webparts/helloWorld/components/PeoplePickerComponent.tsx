import { CompactPeoplePicker, IPersonaProps } from "@fluentui/react";
import * as React from "react";
import Services from "./helpers/Services";
import { WebPartContext } from "@microsoft/sp-webpart-base";

interface PeoplePickerComponentProps {
    context: WebPartContext;
    onChange: (items: IPersonaProps[]) => void; 
  }

const PeoplePickerComponent: React.FC<PeoplePickerComponentProps> = ({context, onChange}) => {
    const [currentUser, setCurrentUser] = React.useState<IPersonaProps | null>(null);
    const [managers, setManagers] = React.useState<IPersonaProps[]>([]);
    const [selectedItems, setSelectedItems] = React.useState<IPersonaProps[]>([]);
    const services = new Services(context);
    
    
    const fetchCurrentUser = async () => {
            const currentUser = await services.getCurrentUser();
            const currentUserPersona: IPersonaProps = {
                key: currentUser.Id.toString(),
                text: currentUser.Title,
                secondaryText: currentUser.Email,
            };
            setCurrentUser(currentUserPersona);
        }
    const fetchManagers = async () => {
          const managersArray = await services.getManagers();
          const transformedManagers = managersArray.map((item) => ({
            key: item.Id.toString(), 
            text: item.Title,
            secondaryText: item.Email,
          }));
          setManagers(transformedManagers);
          console.log('managers array', transformedManagers);
        };    
    React.useEffect(() => {    
        fetchCurrentUser();
        if (currentUser) {
            setSelectedItems([currentUser]);
        }
        fetchManagers();
        
        
      }, [context]);

      const initialSuggestedPeople = managers.slice(0, 3);


  const onResolveSuggestions = (filterText: string, currentPersonas: IPersonaProps[]): IPersonaProps[] => {
    // Implement your logic to resolve suggestions based on filterText and currentPersonas
    // For now, let's just return the initialSuggestedPeople array
    return initialSuggestedPeople;
  };
    
return(
<CompactPeoplePicker
onResolveSuggestions={onResolveSuggestions}
onChange={onChange}
defaultSelectedItems={selectedItems}
inputProps={{
  onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called'),
  onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called'),
  'aria-label': 'People Picker',
}}
/>
);
};

export default PeoplePickerComponent;