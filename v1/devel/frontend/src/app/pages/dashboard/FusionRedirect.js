//////////////////////////////////////////////////////////////////////////
//
//  FusionRedirect
//
//  Shown when only the /fusion path is reached. It queries the
//  available fusion data products, selects the first and redirects 
//  to FusionProductView 
//
//  2023-02-14  Todd Valentic
//              Initial implementation
//
//////////////////////////////////////////////////////////////////////////

import React from 'react'
import { Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiService } from 'services'
import { LoadingOverlay } from '@mantine/core'

const FusionRedirect = () => {

    const query = useQuery(['fusion'], apiService.getFusionProducts)

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

export { FusionRedirect }

