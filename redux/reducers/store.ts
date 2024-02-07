import { configureStore } from '@reduxjs/toolkit';
import emailsReducer, {EmailsState} from './emailsReducer';
import formDataReducer, {FormDataState} from './formDataReducer';
import editFormDataReducer, {EditFormDataState} from './editFormDataReducer';
import clientReducer, {ClientState} from './clientReducer';

// Define the RootState type based on the reducers
export interface RootState {
  emails: EmailsState; // Assuming EmailsState is defined in your emailsReducer
  formData: FormDataState; // Assuming FormDataState is defined in your formDataReducer
  editFormData: EditFormDataState; // Assuming EditFormDataState is defined in your editFormDataReducer
  clientData: ClientState; // Assuming ClientState is defined in your clientReducer
}

const store = configureStore({
  reducer: {
    emails: emailsReducer,
    formData: formDataReducer,
    editFormData: editFormDataReducer,
    clientData: clientReducer,
  },
});

export default store;
