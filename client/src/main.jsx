import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import Router from './router/index.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'


createRoot(document.getElementById('root')).render(
  //<StrictMode>
  <Provider store={store}>
    <RouterProvider router={Router} />
  </Provider>
  //</StrictMode>,
)
