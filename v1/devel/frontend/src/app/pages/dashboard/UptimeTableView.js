import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiService } from 'services'
import { print } from 'support/helpers'

import {
    createStyles,
    Center,
    LoadingOverlay,
    Table
} from '@mantine/core'

import {
    Navigate
} from 'react-router-dom'

const useStyles = createStyles((theme) => {

    return {

        wrapper: {
            position: 'relative',
            margin: '2em auto',
            height: '100%',
            width: '75%',
        },

        table: {
        }

    }

})    

const UptimeTableView = () => {

    const { classes } = useStyles()

    const product = 'uptime-table'
    const query = useQuery(['statistics', product], () => apiService.getStatisticsData(product))

    if (query.isError) {
        return <Navigate to="/" replace />
    }

    if (query.isLoading) {
        return <LoadingOverlay visible={true} />
    }

    if (query.data === undefined) {
        return <LoadingOverlay visible={true} />
    }

    const headers = (
        <tr>
          <th>Site</th>
          <th>Camera</th>
          <th style={{textAlign: 'right'}}>Images</th>
          <th style={{textAlign: 'right'}}>Bytes</th>
          <th style={{textAlign: 'right'}}>First Day</th>
          <th style={{textAlign: 'right'}}>Last Day</th>
          <th style={{textAlign: 'right'}}>Data Days</th>
          <th style={{textAlign: 'right'}}>Total Days</th>
          <th style={{textAlign: 'right'}}>Uptime</th>
        </tr>
    )

    const rows = query.data.map((entry, index) => {
        return (
            <tr key={index}>
                <td>{entry.station.toUpperCase()}</td>
                <td>{print.capitalize(entry.instrument)}</td>
                <td style={{textAlign: 'right'}}>{entry.totalimages}</td>
                <td style={{textAlign: 'right'}}>{print.as_bytes(entry.totalbytes)}</td>
                <td style={{textAlign: 'right'}}>{entry.firstday}</td>
                <td style={{textAlign: 'right'}}>{entry.lastday}</td>
                <td style={{textAlign: 'right'}}>{entry.datadays}</td>
                <td style={{textAlign: 'right'}}>{entry.totaldays}</td>
                <td style={{textAlign: 'right'}}>{print.as_percent(entry.uptime)}</td>
            </tr>
        )
    })

    return (
        <div className={classes.wrapper}>
          <Center style={{ width: '100%', height: '100%' }}>
            <Table verticalSpacing="xs" highlightOnHover className={classes.table}>
              <thead>{headers}</thead> 
              <tbody>{rows}</tbody>
            </Table>
          </Center>
        </div>
    )

}

export { UptimeTableView }

