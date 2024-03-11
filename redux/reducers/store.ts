import { configureStore } from '@reduxjs/toolkit';
import emailsReducer, {EmailsState} from './emailsReducer';
import formDataReducer, {FormDataState} from './formDataReducer';
import editFormDataReducer, {EditFormDataState} from './editFormDataReducer';
import clientReducer, {ClientState} from './clientReducer';
import uiInteractionReducer, {UIInteractionState} from './uiInteractionReducer';
import loggedInUserReducer, {LoggedInUserState} from './loggedInUserReducer';
import userReducer, {IUserState} from './userReducer';

export interface RootState {
  emails: EmailsState; 
  formData: FormDataState; 
  editFormData: EditFormDataState; 
  clientData: ClientState; 
  uiInteraction: UIInteractionState; 
  loggedInUser: LoggedInUserState;
  userDashboard: IUserState;
}

const store = configureStore({
  reducer: {
    emails: emailsReducer,
    formData: formDataReducer,
    editFormData: editFormDataReducer,
    clientData: clientReducer,
    uiInteraction: uiInteractionReducer,
    loggedInUser: loggedInUserReducer,
    userDashboardStore: userReducer,
  },
});

export default store;
