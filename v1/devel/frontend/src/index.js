import React from 'react'
import { createRoot } from 'react-dom/client'
import { StoreProvider } from 'easy-peasy'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider, Global } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { GlobalStyles } from './styles'

import { store } from 'store'
import { App, AuthProvider } from 'app'

document.title = process.env.REACT_APP_TITLE

const queryClient = new QueryClient()
const container = document.getElementById('root')
const root = createRoot(container)

const theme = {

    colors: {
      slate: [ '#e7f3ff', '#c9d7e9', '#aabdd5', '#89a2c3', '#6888b1', 
               '#4e6e97', '#3c5676', '#2a3d55', '#172536', '#040c18' ]
    },

    primaryColor: 'slate',

    headings: {
        color: 'red'
    }
}

root.render(
  <React.StrictMode>
    <StoreProvider store={store}>
      <BrowserRouter basename={process.env.REACT_APP_ROOT_URL}>
        <Global styles={GlobalStyles} />
        <MantineProvider withNormalizeCSS withGlobalStyles theme={theme} >
          <NotificationsProvider>
            <ModalsProvider>
              <QueryClientProvider client={queryClient}>
                <AuthProvider>
                  <App />
                </AuthProvider>
              </QueryClientProvider>
            </ModalsProvider>
          </NotificationsProvider>
        </MantineProvider>
      </BrowserRouter>
    </StoreProvider>
  </React.StrictMode>
)

