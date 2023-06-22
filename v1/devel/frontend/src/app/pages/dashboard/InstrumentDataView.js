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

const MakeURL = (prefix, station, instrument, product, utcdate) => {

    // Example URL: https://data.mangonetwork.org/data/transport/mango/archive/cfs/greenline/quicklook/2021/223/mango-cfs-greenline-quicklook-20210811.webm

    const dt = DateTime.fromJSDate(utcdate, { zone: 'UTC' })
    const host = 'https://data.mangonetwork.org'
    const path = `${prefix}/transport/mango/archive/${station}/${instrument}/${product}`
    const dpath = dt.toFormat('yyyy/ooo')
    const dname = dt.toFormat('yyyyLLdd')
    const filename = `mango-${station}-${instrument}-${product}-${dname}`

    return `${host}/${path}/${dpath}/${filename}`
}

const MakeDownloadURL = (station, instrument, product, utcdate) => {
    return MakeURL('download', station, instrument, product, utcdate)
}

const MakeDataURL = (station, instrument, product, utcdate) => {
    return MakeURL('data', station, instrument, product, utcdate)
}

const InstrumentDataView = () => {

    const params = useParams()
    const station = params.station 
    const instrument = params.instrument
    const navigate = useNavigate()
    const location = useLocation()

    const unixtime = Date.parse(params.date)

    if (isNaN(unixtime)) {
        navigate(`../../${instrument}`)
    }

    const utcdate = new Date(unixtime)
    const refetchInterval = 60*1000 // 60-seconds

    const changeInstrument = newInstrument => {
        const path = location.pathname.split('/').slice(-1).join('/')
        navigate(`../../${newInstrument}/${path}`)
    }

    const changeStation = newStation => {
        const path = location.pathname.split('/').slice(-2).join('/')
        navigate(`../../../${newStation}/${path}`)
    }

    const results = useQueries({
        queries: [
            {
                queryKey: ['stations'],
                queryFn: apiService.getStations,
                refetchInterval: refetchInterval
            },
            {
                queryKey: ['cameras'],
                queryFn: apiService.getCameras,
                refetchInterval: refetchInterval
            },
            {
                queryKey: ['processed',station,instrument],
                queryFn: () => apiService.getProcessedData(station, instrument),
                refetchInterval: refetchInterval
            }
        ]
    })

    const [ stationQuery, cameraQuery, dataQuery ] = results 
    const stations = stationQuery.data?.stations
    const cameras = cameraQuery.data?.cameras.filter(e => e.station === station)
    const data = dataQuery.data

    const downloads = [
        {
            label: 'Quicklook',
            data: data?.quicklook,
            url: MakeDownloadURL(station, instrument, 'quicklook', utcdate),
            exts: ['mp4', 'webm']
        },
        {
            label: 'Level-1',
            data: data?.level1,
            url: MakeDownloadURL(station, instrument, 'level1', utcdate),
            exts: ['hdf5']
        }
    ]

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

    const nextStation = () => {
        const k = stations.findIndex(e => e.name === station)
        const d = stations.length
        const kp = (((k+1) % d) + d) % d
        const newStation = stations[kp]
        changeStation(newStation.name)
        }

    const prevStation = () => {
        const k = stations.findIndex(e => e.name === station)
        const d = stations.length
        const kp = (((k-1) % d) + d) % d
        const newStation = stations[kp]
        changeStation(newStation.name)
        }

    const hasCamera = name => {
        return cameras.some(camera => camera.instrument === name)
    }

    const stationInfo = stationQuery.data.stations.find(e => e.name === station)

    if (stationInfo === undefined) {  
        return <Navigate to="../../../" replace /> 
    }

    if (!hasCamera(instrument)) {
        if (cameras.length>0) {
            const path = location.pathname.split('/').slice(-1).join('/')
            return <Navigate to={`../../${cameras[0].instrument}/${path}`} replace />
        } else {
            return <Navigate to="/" replace /> 
        }
    }

    const url = MakeDataURL(station, instrument, 'quicklook', utcdate)

    const tabs = [
        { 
            value: 'greenline',   
            label: 'Green Line Camera',
            color: 'green.4',    
            icon:  <IconVideo size={20} />,
            disabled: !hasCamera('greenline'),
            panel: <MovieViewer url={url} />
        },
        {
            value: 'redline',   
            label: 'Red Line Camera',
            color: 'red.4',    
            icon:  <IconVideo size={20} />,
            disabled: !hasCamera('redline'),
            panel: <MovieViewer url={url} />
        }
    ]

    return (
        <DataView
            data={data?.quicklook}
            downloads={downloads}
            utcdate={utcdate}
            title={stationInfo.name}
            subtitle={stationInfo.label}
            onHeaderNext={nextStation}
            onHeaderPrev={prevStation}
            tabs={tabs}
            tabValue={instrument}
            onTabChange={changeInstrument}
            viewerColor='black'
            />
    )
        
}

export { InstrumentDataView }

