import axios from 'axios'
import dayjs from 'dayjs'
import dayjsPluginUTC from 'dayjs-plugin-utc'
dayjs.extend(dayjsPluginUTC)

const BASEURL = window.location.origin+process.env.REACT_APP_API_URL

const axios_api = axios.create({
    baseURL:    BASEURL,
    })

const getStations = async () => {
    const response = await axios_api.get('/stations')
    return response.data
}

const getCameras = async () => {
    const response = await axios_api.get('/cameras')
    return response.data
}

const getMeshNodes = async () => {

    const response = await axios_api.get('/meshnodes')

    const result = response.data.meshnodes.map(entry => {
        entry.created_on = new Date(entry.created_on)
        entry.updated_on = new Date(entry.updated_on)
        entry.checked_on = new Date(entry.checked_on)
        return entry
    })

    response.data.meshnodes = result

    return response.data
}

const getProcessedData = async (station, instrument) => {
    const response = await axios_api.get(`/processed/${station}/${instrument}`)
    const result = Object.fromEntries(response.data.processed.map(product => {
        const data = product.data.map(entry => {
            const t = new Date(entry.timestamp)
            t.setUTCHours(0)
            t.setUTCMinutes(0)
            t.setUTCSeconds(0)
            t.setUTCMilliseconds(0)
            
            return t 
            })
        return [product.name, data]
        }))
    return result 
}

const getFusionProducts = async () => {
    const response = await axios_api.get('/fusion')
    return response.data
}

const getFusionData = async (product) => {
    const response = await axios_api.get(`/fusion/${product}`)
    const data = response.data.fusiondata.map(entry => {
        return new Date(entry.timestamp) 
    })
    return Object.fromEntries([[product, data]])
}

const getStatisticsProducts = async () => {
    const response = await axios_api.get('/statistics')
    return response.data
}

const getStatisticsData = async (product) => {

    const response = await axios_api.get(`/statistics/${product}`)
    //const result = response.data.statistics_data.map(entry => {
    //    entry.timestamp = new Date(entry.timestamp) 
    //    return entry
    //})
    //response.data.statistics_data = result
    return response.data
}


export const apiService = {
    getStations,
    getCameras,
    getProcessedData,
    getMeshNodes,
    getFusionProducts,
    getFusionData,
    getStatisticsProducts,
    getStatisticsData
}

