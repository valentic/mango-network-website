import React from 'react'
import { useQueries } from '@tanstack/react-query'
import { apiService } from 'services'
import { DateTime } from 'luxon'
import { IconVideo } from '@tabler/icons-react'

import { DataView } from './DataView'
import { MovieViewer } from './MovieViewer'

import { 
    useParams, 
    useLocation, 
    useNavigate, 
    Navigate 
} from 'react-router-dom'

import {
    Container,
    Title,
    Text,
    LoadingOverlay,
} from '@mantine/core'

const MakeURL = (prefix, product, utcdate) => {

    // Example URL: https://data.mangonetwork.org/data/transport/mango/archive/fusion/winds-greenline/2023/039/winds-greenline-20230208.mp4 

    const dt = DateTime.fromJSDate(utcdate, { zone: 'UTC' }) 
    const host = 'https://data.mangonetwork.org'
    const path = `${prefix}/transport/mango/archive/fusion/${product}`
    const dpath = dt.toFormat('yyyy/ooo')
    const dname = dt.toFormat('yyyyLLdd')
    const filename = `${product}-${dname}`

    return `${host}/${path}/${dpath}/${filename}`
}

const MakeDataURL = (product, utcdate) => MakeURL('data', product, utcdate)
const MakeDownloadURL = (product, utcdate) => MakeURL('download', product, utcdate)


const FusionDataView = () => {

    const params = useParams()
    const product = params.product
    const navigate = useNavigate()
    const location = useLocation()

    const unixtime = Date.parse(params.date)

    if (isNaN(unixtime)) {
        navigate(`../../${product}`)
    }

    const utcdate = new Date(unixtime)
    const refetchInterval = 60*1000 // 60-seconds

    const changeProduct = newProduct => {
        const path = location.pathname.split('/').slice(-1).join('/')
        navigate(`../../${newProduct}/${path}`)
    }

    const results = useQueries({
        queries: [
            {
                queryKey: ['fusion'],
                queryFn: apiService.getFusionProducts,
                refetchInterval: refetchInterval
            },
            {
                queryKey: ['fusion', product],
                queryFn: () => apiService.getFusionData(product),
                refetchInterval: refetchInterval
            }
        ]
    })

    const [ productsQuery, dataQuery ] = results
    const products = productsQuery.data?.products
    const data = dataQuery.data

    if (results.some(query => query.isLoading)) {
        return <LoadingOverlay visible={true} />
    }

    if (results.some(query => query.isError)) {
        const badQuery = results.filter(query => query.isError)[0]
        return (
            <Container>
              <Title>Problem Detected</Title>
              <Text>{badQuery.error.message}</Text>
            </Container>
        )
    }

    const hasProduct = name => {
        return products.some(product => product.name === name)
    }

    const productInfo = products.find(e => e.name === product)

    if (productInfo === undefined) {  
        return <Navigate to="/" replace /> 
    }

    const downloads = [
        {
            label: 'Movie',
            data: data[product],
            url: MakeDownloadURL(product, utcdate),
            exts: ['mp4', 'webm']
        }
    ]

    const tabs = [
        {
            value: 'winds-greenline',
            label: 'Winds (Green Line)',
            color: 'green.4',
            icon: <IconVideo size={20} />,
            disabled: !hasProduct('winds-greenline'),
            panel: <MovieViewer url={MakeDataURL(product, utcdate)} />
        },
        {
            value: 'winds-redline',
            label: 'Winds (Red Line)',
            color: 'red.4',
            icon: <IconVideo size={20} />,
            disabled: !hasProduct('winds-redline'),
            panel: <MovieViewer url={MakeDataURL(product, utcdate)} />
        }

    ]

    return (
        <DataView
            data={data[product]}
            downloads={downloads}
            utcdate={utcdate}
            title={productInfo.title}
            subtitle={productInfo.label}
            tabs={tabs}
            tabValue={product}
            onTabChange={changeProduct}
            viewerColor='white'
        />
    )

}

export { FusionDataView }

