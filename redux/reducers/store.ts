import { configureStore } from '@reduxjs/toolkit';
import emailsReducer, {EmailsState} from './emailsReducer';
import formDataReducer, {FormDataState} from './formDataReducer';
import editFormDataReducer, {EditFormDataState} from './editFormDataReducer';
import clientReducer, {ClientState} from './clientReducer';
import uiInteractionReducer, {UIInteractionState} from './uiInteractionReducer';

// Define the RootState type based on the reducers
export interface RootState {
  emails: EmailsState; // Assuming EmailsState is defined in your emailsReducer
  formData: FormDataState; // Assuming FormDataState is defined in your formDataReducer
  editFormData: EditFormDataState; // Assuming EditFormDataState is defined in your editFormDataReducer
  clientData: ClientState; // Assuming ClientState is defined in your clientReducer
  uiInteraction: UIInteractionState; // Assuming UIInteractionState is defined in your uiInteractionReducer
}

const store = configureStore({
  reducer: {
    emails: emailsReducer,
    formData: formDataReducer,
    editFormData: editFormDataReducer,
    clientData: clientReducer,
    uiInteraction: uiInteractionReducer,
  },
});

export default store;
