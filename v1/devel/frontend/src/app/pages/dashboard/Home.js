import React from 'react'
import { 
    Outlet, 
    useLocation,
    useNavigate
} from 'react-router-dom'

import {
    IconMapPins,
    IconArrowsJoin
} from '@tabler/icons-react'

import {
    Box,
    Container,
    createStyles,
    Tabs
} from '@mantine/core'

const useStyles = createStyles((theme) => {
    
    return {

        page: {
            height: '100%',
            overflow: 'visible',
            display: 'grid',
            gridTemplateColumns: '1fr',
            gridTemplateRows: 'auto 1fr',
            gridTemplateAreas: "'header' 'main'",
            paddingBottom: '1em',
        },

        header: {
            gridArea: 'header',
            padding: '1em'
        },

        main: {
            gridArea: 'main',
            overflow: 'auto',
            width: '100%',

            [theme.fn.smallerThan('sm')]: {
                overflow: 'auto',
            },

        },

        links: {
            display: 'flex',
            justifyContent: 'center'
        },

        link: {
            display: 'block',
            lineHeight: 1,
            padding: '8px 12px',
            borderRadius: theme.radius.sm,
            textDecoration: 'none',
            color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
            fontSize: theme.fontSizes.sm,
            fontWeight: 500,

            '&:hover': {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            },

            [theme.fn.smallerThan('sm')]: {
              borderRadius: 0,
              padding: theme.spacing.md,
            },

            '&.active, &.active:hover': {
                color: theme.white,
                opacity: 1,
                backgroundColor: theme.colors.slate[6]
            },

        }

    }
})

const Home = () => {

    const { classes } = useStyles()
    const navigate = useNavigate()
    const location = useLocation()
    const section = location.pathname.split('/')[2]

    const sectionMenu = [
        { label: 'Sites',       link: 'sites',  icon: <IconMapPins/>      },
        { label: 'Fusion',      link: 'fusion', icon: <IconArrowsJoin/>   }
        ]

    const tabs = sectionMenu.map((entry) => (
        <Tabs.Tab key={entry.link} value={entry.link} icon={entry.icon} >
          { entry.label }
        </Tabs.Tab>
    ))
    
    const changeSection = (value) => navigate(`/database/${value}`)

    return (
        <Box className={classes.page} size="xl">
          <Box className={classes.header}>
            <Tabs value={section} onTabChange={changeSection} variant="pills" >
              <Tabs.List position="center"> { tabs } </Tabs.List>
            </Tabs>
          </Box>
          <Container className={classes.main} size="ml">
            <Outlet />
          </Container>
        </Box>
    )
}

export { Home }

