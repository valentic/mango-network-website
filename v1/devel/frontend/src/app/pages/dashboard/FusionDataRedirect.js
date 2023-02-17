//////////////////////////////////////////////////////////////////////////
//
//  FusionDataRedirect
//
//  Shown when only the fusion product is present in the path. It 
//  redirects to the date of the last data record. 
//
//  2023-02-14  Todd Valentic
//              Initial implementation
//
//////////////////////////////////////////////////////////////////////////

import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiService } from 'services'
import { DateTime } from 'luxon'
import { LoadingOverlay } from '@mantine/core'

const FusionDataRedirect = () => {

    const params = useParams()
    const product = params.product 

    const query = useQuery(['fusion', product],
        () => apiService.getFusionData(product),
        {
            retry: (count, { response }) => response.status !== 404
        })

    if (query.isError) {
        return <Navigate to="/dashboard" replace/>
    }

    if (query.isSuccess) {

        if (query.data?.fusiondata.length>0) {
            const fusiondata = query.data.fusiondata
            const jsdate = fusiondata[fusiondata.length-1].timestamp
            const dt = DateTime.fromJSDate(jsdate, { zone: 'UTC' })
            const path = dt.toISODate()
            return <Navigate to={`./${path}`} />
        } else { 
            return <Navigate to='/dashboard' replace/>
        }
    }

    return <LoadingOverlay visible={true} />
}

export { FusionDataRedirect }

