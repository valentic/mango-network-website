import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import mapImage from './mango-sites-crop.png'
import fusionImage from './fusion-invert.jpg'
import dataImage from './datalist.png'
import { useDisclosure } from '@mantine/hooks'

import { 
    createStyles,
    Badge,
    Card,
    Container, 
    Image,
    Modal,
    SimpleGrid,
    Text,
    Title,
    } from '@mantine/core'

const useStyles = createStyles((theme) => ({

    title: {
        fontSize: 34,
        fontWeight: 900,

        [theme.fn.smallerThan('sm')]: {
            fontSize: 24,
        },
    },

    description: {
        maxWidth: 600,
        margin: 'auto',

        /*
         '&::after': {
            content: '""',
            display: 'block',
            backgroundColor: theme.fn.primaryColor(),
            width: 45,
            height: 2,
            marginTop: theme.spacing.sm,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        */
    },

    acknowledgement: {
        maxWidth: 800,
        margin: 'auto',
        fontSize: 12,

        /*
          '&::before': {
            content: '""',
            display: 'block',
            backgroundColor: theme.fn.primaryColor(),
            width: 45,
            height: 2,
            marginTop: theme.spacing.lg,
            marginBottom: theme.spacing.sm,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        */
    },


    card: {
        border: `${1} solid ${
              theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
        }`,
    },

    cardTitle: {
      fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },

    cardImage: {
        cursor: 'pointer'
    },

    cardHeader: {
        backgroundColor: 'black'
    }

}))

const Home = ()  => {

    const { classes } = useStyles()
    const navigate = useNavigate() 
    const [ opened, { open, close } ] = useDisclosure()

    const science = (
        <Card key="science" radius="md" className={classes.card} padding="lg" withBorder >
          <Card.Section mb="sm" onClick={open}>
            <Modal opened={opened} onClose={close} title="Site Locations" size="auto">
              <Image src={mapImage} alt="Science" />
            </Modal>
            <Image src={mapImage} alt="Science" height={180} className={classes.cardImage}/>
          </Card.Section>
          <Badge>Science</Badge>
          <Text fz="sm" c="dimmed" mt="sm" lineClamp={4}>
            Learn more about the project's{" "}<Link to="/about/science">science</Link>, 
            {" "}<Link to="/about/instrument">instrumentation</Link>{" "}
            and 
            {" "}<Link to="/about/sites">field sites</Link>.
          </Text>
        </Card>
    )

    const explorer = (
        <Card key="explorer" radius="md" className={classes.card} padding="lg" withBorder >
          <Card.Section mb="sm" 
            className={classes.cardHeader} 
            onClick={() => navigate('/database/fusion/winds-greenline/2023-05-11')}
            >
            <Image 
                src={fusionImage} alt="Fusion Image" 
                height={180} fit="contain" 
                className={classes.cardImage} />
          </Card.Section>
          <Badge>Data Explorer</Badge>
          <Text fz="sm" c="dimmed" mt="sm" lineClamp={4}>
            <Link to="/database">Navigate</Link>{" "}through the daily image collections and 
            see movies from each field site in the database catalog.
          </Text>
        </Card>
    )

    const access = (
        <Card key="access" radius="md" className={classes.card} padding="lg" withBorder >
          <Card.Section mb="sm" 
            className={classes.cardHeader} onClick={() => navigate('/resources/data')}
            >
            <Image 
                src={dataImage} alt="Data Listing" 
                height={160} p={10} fit="contain" 
                className={classes.cardImage} />
          </Card.Section>
          <Badge>Data Products</Badge>
          <Text fz="sm" c="dimmed" mt="sm" lineClamp={4}>
            <Link to="/resources/data">Download</Link>{" "}the various data products.
          </Text>
        </Card>
    )

    return (
      <Container size="lg" py="xl">

        <Title order={2} className={classes.title} ta="center" mt="sm">
          Midlatitude Allsky-imaging Network for GeoSpace Observations 
        </Title>

        <Text c="dimmed" className={classes.description} ta="center"mt="sm">
          A network of all-sky cameras and Fabry-Perot Interferometers to
          observe wave activity in the thermosphere. 
        </Text>
 
        <SimpleGrid cols={3} spacing="xl" mt={50} mb={50} breakpoints={[{maxWidth: 'sm', cols: 2}]} >
          { science }
          { explorer }
          { access }
        </SimpleGrid>

        <Text c="dimmed" className={classes.acknowledgement} ta="center"mt="sm">
            The imaging and FPI data are obtained through the MANGO
            network operated by SRI and University of Illinois,
            respectively. Work at SRI is supported through NSF award
            AGS-1933013 & AGS-2426523, the University of California,
            Berkeley is supported through NSF award AGS-1933077 &
            AGS-2426525, and at the University of Illinois is supported
            through NSF award AGS-1932953 & AGS-2426524.
        </Text>
 

      </Container>
    )
}

export { Home }
