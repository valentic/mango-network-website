import React from 'react'
import { useDisclosure } from '@mantine/hooks'
import { NavLink } from 'react-router-dom'
import logo from 'support/assets/mango.png'
import { IconChevronDown } from '@tabler/icons-react'

import { 
    createStyles, 
    Group, 
    Burger, 
    Header,
    Container,
    Center,
    Menu,
    Text,
    Paper,
    Transition
    } from '@mantine/core'

const HEADER_HEIGHT = 60

const useStyles = createStyles((theme) => ({

    root: {
        position: 'relative',
        zIndex: 1,
        borderBottom: '2px solid #fa9200'
    },

    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%'
    },

    links: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none'
        }
    },

    burger: {
        [theme.fn.largerThan('sm')]: {
            display: 'none'
        }
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
    },
    
    linkLabel: {
        marginRight: 5,
    },

    logo: {
        placeSelf: 'center start',
        height: '25px',
        opacity: 0.75,
        marginRight: '5px'
    },

    brand: {
        display: 'flex'
    },

    title: {
        placeSelf: 'center center'
    },

    dropdown: {
        position: 'absolute',
        top: HEADER_HEIGHT,
        left: 0,
        right: 0,
        zIndex: 11,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderTopWidth: 0,
        overflow: 'hidden',

        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

}))

const AppHeader = ({ links, className }) => {

    const [opened, { toggle } ] = useDisclosure(false);
    const { classes } = useStyles();

    const items = links.map((link, index) => {
        const menuItems = link.menu?.map((item) => (
            <Menu.Item 
                key={item.label} 
                component={NavLink} 
                to={item.link}
                onClick={(event) => { toggle() }}
            >
              {item.label}
            </Menu.Item>
        ))

        if (menuItems) {
            return (
                <Menu key={link.label} withArrow position="bottom-start" shadow="md"> 
                  <Menu.Target>
                    <a
                      href={`#${index}`}
                      className={classes.link}
                      onClick={(event) => event.preventDefault()}
                    >
                      <Center inline>
                        <span className={classes.linkLabel}>{link.label}</span>
                        <IconChevronDown size={12} strokeWidth={3} />
                       </Center>
                    </a>
                  </Menu.Target>
                  <Menu.Dropdown>{menuItems}</Menu.Dropdown>
                </Menu>
            )
        }

        return (
            <NavLink
                key={link.label}
                to={link.link}
                replace
                className={classes.link}
                onClick={(event) => { toggle() }}
            >
              {link.label}
            </NavLink>
        )
    })

    return (

      <Header height={HEADER_HEIGHT} className={classes.root}> 
        <Container className={classes.header} size='lg'>
          <div className={classes.brand}>
            <img className={classes.logo} src={logo} alt="Mango Logo" />
            <Text className={classes.title} size="xl"> 
              {process.env.REACT_APP_TITLE}
            </Text>
          </div>
          <Group spacing={5} className={classes.links}>
            {items}
          </Group>

          <Burger opened={opened}
              onClick={toggle}
              className={classes.burger}
              size="sm"
          />

          <Transition transition="pop-top-right" duration={200} mounted={opened}>
            {(styles) => {
                return (
              <Paper className={classes.dropdown} withBorder style={styles}>
                {items}
              </Paper>
            )}}
          </Transition>
        </Container>
      </Header>
    )
}

export { AppHeader }
