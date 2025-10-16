import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { AuthContextProvider } from "./context/AuthContext";
import UserContext from "./context/UserContext";

function App() {
  return (
    <Provider store={store}>
      <UserContext>
        <AuthContextProvider>
          <div className="App">
            <AppRoutes />
          </div>
        </AuthContextProvider>
      </UserContext>
    </Provider>
  );
}

export default App;
