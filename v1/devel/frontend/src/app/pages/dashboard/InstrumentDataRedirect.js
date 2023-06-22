//////////////////////////////////////////////////////////////////////////
//
//  InstrumentDataRedirect
//
//  Shown when only the station/instrument is present in the path. It 
//  redirects to the date of the last data record. 
//
//  2022-07-29  Todd Valentic
//              Initial implementation
//
//  2023-06-22  Todd Valentic
//              Use new processed api endpoint
//
//////////////////////////////////////////////////////////////////////////

import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiService } from 'services'
import { DateTime } from 'luxon'
import { LoadingOverlay } from '@mantine/core'

const InstrumentDataRedirect = () => {

    const params = useParams()
    const station = params.station 
    const instrument = params.instrument

    const query = useQuery(['processed',station,instrument],
        () => apiService.getProcessedData(station, instrument),
        {
            retry: (count, { response }) => response.status !== 404
        })

    if (query.isError) {
        return <Navigate to="/dashboard" replace/>
    }

    if (query.isSuccess) {
        const quicklooks = query.data.quicklook
        if (quicklooks.length>0) {
            const jsdate = quicklooks[quicklooks.length-1]
            const dt = DateTime.fromJSDate(jsdate, { zone: 'UTC' })
            const path = dt.toISODate()
            return <Navigate to={`./${path}`} />
        } else {
            return <Navigate to='/dashboard' replace/>
        }
    }

    return <LoadingOverlay visible={true} />
}

export { InstrumentDataRedirect }

