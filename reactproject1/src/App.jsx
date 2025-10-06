import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { Provider } from 'react-redux'; 
import { store } from './redux/store'; // 🔑 FIX: Changed to NAMED IMPORT { store }

// Context Providers
import { AuthContextProvider } from "./context/AuthContext";
import UserContext from "./context/UserContext"; 


function App() {
  return (
    // 1. Redux Provider (Outermost)
    <Provider store={store}>
      {/* 2. Custom Context for UI State (UserContext) */}
      <UserContext>
        {/* 3. Auth Context (Critical for fetching token) */}
        <AuthContextProvider>
          {/* 4. Your Application Routes */}
          <div className="App">
            <AppRoutes />
          </div>
        </AuthContextProvider>
      </UserContext>
    </Provider>
  );
}

export default App;