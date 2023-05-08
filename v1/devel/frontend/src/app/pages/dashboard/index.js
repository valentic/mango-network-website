import { Home } from './Home'
import { StationList } from './StationList'

import { InstrumentRedirect } from './InstrumentRedirect'
import { InstrumentDataView } from './InstrumentDataView'
import { InstrumentDataRedirect } from './InstrumentDataRedirect'

import { FusionRedirect } from './FusionRedirect'
import { FusionDataRedirect } from './FusionDataRedirect'
import { FusionDataView } from './FusionDataView'

import { StatisticsRedirect } from './StatisticsRedirect'
import { StatisticsDataView } from './StatisticsDataView'

const Dashboard = {
    
    Home:   Home,

    Stations: {
        List:           StationList
    },

    Instrument: {
        Redirect:       InstrumentRedirect,
        Data: {
            Redirect:   InstrumentDataRedirect,
            View:       InstrumentDataView,
        }
    },

    Fusion: {
        Redirect:       FusionRedirect,
        Data: {
            Redirect:   FusionDataRedirect,
            View:       FusionDataView
        }
    },

    Statistics: {
        Redirect:       StatisticsRedirect,
        Data: {
            View:       StatisticsDataView
        }
    }

}

export { Dashboard }

