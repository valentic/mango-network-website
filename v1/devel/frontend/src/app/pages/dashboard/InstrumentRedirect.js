//////////////////////////////////////////////////////////////////////////
//
//  InstruentRedirect
//
//  Shown when only the station is present in the path. It queries the
//  first available cameras and redirects to InstrumentView. 
//
//  2022-07-11  Todd Valentic
//              Initial implementation
//
//////////////////////////////////////////////////////////////////////////

import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiService } from 'services'
import { LoadingOverlay } from '@mantine/core'

const InstrumentRedirect = () => {

    const query = useQuery(['cameras'], apiService.getCameras)
    const params = useParams()
    const station = params.station 

    if (query.isError) {
        return <Navigate to="/" replace />
    }

    if (query.isSuccess) {

        const cameras = query.data?.cameras.filter(camera => camera.station===station)

        if (cameras.length) { 
            return <Navigate to={cameras[0].instrument}/>
        } else {
            return <Navigate to='../..' replace/>
        }
    }

    return <LoadingOverlay visible={true} />
}

export { InstrumentRedirect }

