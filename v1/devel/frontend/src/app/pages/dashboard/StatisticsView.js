import React from 'react'

import {
    Box,
    Paper,
    Tabs,
    createStyles
} from '@mantine/core'

const useStyles = createStyles((theme, { viewerColor }) => {
    
    return {

        wrapper: {
            height: '100%',
            display: 'grid',

            gridTemplateColumns: '1fr',
            gridTemplateRows: '1fr',
            gridTemplateAreas: "'viewer'",
            columnGap: 15,

            [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
              gridTemplateColumns: '1fr',
              gridTemplateAreas: "'viewer'",
              rowGap: 15,
            }
        },

        header: {
            gridArea: 'header',
        },

        viewer: {
            gridArea: 'viewer',
            position: 'relative',
            width: '100%',
            height: '100%',
            backgroundColor: viewerColor 
        },

        tabList: {
            padding: '5px 10px',
            backgroundColor: theme.colors.gray[3]
        }
    }
    
})

const StatisticsView = ({
    title, 
    subtitle, 
    onHeaderNext, 
    onHeaderPrev, 
    viewerColor,
    tabs, 
    tabValue, 
    onTabChange}) => {

    const { classes } = useStyles({viewerColor})

    const tabList = tabs.map((tab) => (
        <Tabs.Tab
            key={tab.value}
            value={tab.value}
            color={tab.color}
            icon={tab.icon}
            disabled={tab.disabled}
        >
            { tab.label }
        </Tabs.Tab>
        ))

    const tabPanels = tabs.map((tab) => (
        <Tabs.Panel key={tab.value} value={tab.value}>
          { tab.panel }
        </Tabs.Panel>
        ))

    return (
        <Box className={classes.wrapper}> 
          <Paper radius="sm" withBorder className={classes.viewer} >
            <Tabs value={tabValue} onTabChange={onTabChange} variant="pills" >
             <Tabs.List position="center" className={classes.tabList}> 
                { tabList }
              </Tabs.List>

              { tabPanels }
 
            </Tabs>
          </Paper>
        </Box>
    )
}

export { StatisticsView }

