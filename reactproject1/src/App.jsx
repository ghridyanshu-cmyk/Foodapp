import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { AuthContextProvider } from "./context/AuthContext";
import UserContext from "./context/UserContext";

function App() {
  return (
    <Provider store={store}>
      <AuthContextProvider>
        <UserContext>
          <div className="App">
            <AppRoutes />
          </div>
        </UserContext>
      </AuthContextProvider>
    </Provider>
  );
}

export default App;
