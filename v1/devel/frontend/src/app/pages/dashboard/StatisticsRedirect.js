//////////////////////////////////////////////////////////////////////////
//
//  StatisticsRedirect
//
//  Shown when only the /statistics path is reached. It queries the
//  available statistic data products, selects the first and redirects 
//  to StatisticsProductView 
//
//  2023-05-06  Todd Valentic
//              Initial implementation
//
//////////////////////////////////////////////////////////////////////////

import React from 'react'
import { Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiService } from 'services'
import { LoadingOverlay } from '@mantine/core'

const StatisticsRedirect = () => {

    const query = useQuery(['statistics'], apiService.getStatisticsProducts)

    if (query.isError) {
        return <Navigate to="/" replace />
    } 

    if (query.isSuccess) {
    
        const products = query.data?.products

        if (products.length) { 
            return <Navigate to={products[0].name}/>
        } else {
            return <Navigate to='/dashboard' replace/>
        }
    }

    return <LoadingOverlay visible={true} />
}

export { StatisticsRedirect }

