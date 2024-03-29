import React from 'react'
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'

import { Layout } from './layout'
import * as Page from './pages'
import { useAuth } from './auth'

const ProtectedRoute = ({
    isAllowed,
    redirectPath = '/login',
    children
}) => {
    const location = useLocation()

    if (!isAllowed) {
        return <Navigate to={redirectPath} replace state={{ from: location }} />
    }

    return children ? children : <Outlet /> 
}

const App = () => {

    const auth = useAuth()
    const is_admin = auth.hasRole('admin')
    const is_manager = auth.hasRole('manager')
    const is_member = auth.hasRole('member') 

    return (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Page.Home />} />
            <Route path="contacts" element={<Page.Contacts/>} />
            <Route path="login" element={<Page.Auth.Login />} />
            <Route path="logout" element={<Page.Auth.Logout />} />

            <Route path="about" element={<Page.About.Home/>} >
              <Route path="science" element={<Page.About.Science/>} />
              <Route path="instrument" element={<Page.About.Instrument/>} />
              <Route path="sites" element={<Page.About.Sites/>} />
              <Route index element={<Navigate to="science" replace />} />
            </Route>

            <Route path="resources" element={<Page.Resources.Home/>} >
              <Route path="data" element={<Page.Resources.Data/>} />
              <Route path="software" element={<Page.Resources.Software/>} />
              <Route path="maillists" element={<Page.Resources.MailLists/>} />
              <Route path="publications" element={<Page.Resources.Publications/>} />
              <Route index element={<Navigate to="software" replace />} />
            </Route>

            <Route path="database" element={<Page.Dashboard.Home/>} > 
              <Route path="fusion">
                <Route index element={<Page.Dashboard.Fusion.Redirect />} />
                <Route path=":product" >
                  <Route index element={<Page.Dashboard.Fusion.Data.Redirect />} />
                  <Route path=":date" element={<Page.Dashboard.Fusion.Data.View />} />
                </Route>
              </Route>

              <Route path="statistics">
                <Route index element={<Page.Dashboard.Statistics.Redirect />} />
                <Route path=":product" index element={<Page.Dashboard.Statistics.Data.View />} />
              </Route>

              <Route path="sites">
                <Route index element={<Page.Dashboard.Stations.List />} />
                <Route path=":station">
                  <Route index element={<Page.Dashboard.Instrument.Redirect />} />
                  <Route path=":instrument" >
                    <Route index element={<Page.Dashboard.Instrument.Data.Redirect />} />
                    <Route path=":date" element={<Page.Dashboard.Instrument.Data.View />} />
                  </Route>
                </Route>
               </Route>
               <Route index element={<Navigate to="sites" replace />} /> 
            </Route>


            <Route element={<ProtectedRoute isAllowed={is_member || is_manager || is_admin} />}>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
    )
}

export { App } 
