import React from 'react'
import { useQueries } from '@tanstack/react-query'
import { apiService } from 'services'
import { StatisticsView } from './StatisticsView'
import { PlotViewer } from './PlotViewer'
import { UptimeTableView } from './UptimeTableView'

import { 
    IconChartBar,
    IconTable
} from '@tabler/icons-react'

import { 
    useParams, 
    useNavigate, 
    Navigate 
} from 'react-router-dom'

import {
    Container,
    Title,
    Text,
    LoadingOverlay,
} from '@mantine/core'

const MakeURL = (product) => {

    // Example URL: https://data.mangonetwork.org/data/transport/mango/var/uptime.png

    const host = 'https://data.mangonetwork.org'
    const path = `data/transport/mango/var/`
    const filename = `${product}.png`

    return `${host}/${path}/${filename}`
}


const StatisticsDataView = () => {

    const params = useParams()
    const product = params.product
    const navigate = useNavigate()

    const refetchInterval = 60*60*1000 // 1 hour 

    const changeProduct = newProduct => {
        navigate(`../${newProduct}`)
    }

    const results = useQueries({
        queries: [
            {
                queryKey: ['statistics'],
                queryFn: apiService.getStatisticsProducts,
                refetchInterval: refetchInterval
            }/*,
            {
                queryKey: ['statistics', product],
                queryFn: () => apiService.getStatisticsData(product),
                refetchInterval: refetchInterval
            }*/
        ]
    })

    //const [ productsQuery, dataQuery ] = results
    const [ productsQuery ] = results
    const products = productsQuery.data?.products
    //const data = dataQuery.data

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

    const tabs = [
        {
            value: 'uptime-plot',
            label: 'Uptime Plot',
            icon: <IconChartBar size={20} />,
            disabled: !hasProduct('uptime-plot'),
            panel: <PlotViewer url={MakeURL('uptime-plot')} />
        },
        {
            value: 'uptime-table',
            label: 'Uptime Table',
            icon: <IconTable size={20} />,
            disabled: !hasProduct('uptime-table'),
            panel: <UptimeTableView />
        }
   ]

    return (
        <StatisticsView
            title={productInfo.title}
            subtitle={productInfo.label}
            tabs={tabs}
            tabValue={product}
            onTabChange={changeProduct}
            viewerColor='white'
        />
    )

}

export { StatisticsDataView }

