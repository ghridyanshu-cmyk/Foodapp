import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// ...existing code...
import UserContext from './context/UserContext.jsx'
import { Provider } from "react-redux"
import { store } from './redux/store.js'

import App from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Provider store={store}>
    <UserContext>
  {/* Routing is handled inside App.jsx */}
        <App/>

    </UserContext>
    </Provider>
    </StrictMode>
)
