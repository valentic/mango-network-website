import React from 'react'
import { Link } from 'react-router-dom'
import { 
    Anchor,
    Box,
    Center,
    Code,
    Container, 
    Divider,
    Grid,
    Image,
    Title,
    Text
} from '@mantine/core'

import browserImage from './browser.png'

const Data = () => {

    return (
        <Container size="md" mt="2em">
          <Title color="slate"> Data Products </Title>
          <Divider mb="1em" />

          <Text>
            You can access the MANGO data products in a number of different ways.
          </Text>

          <Box my="1em">
            <Title order={2} color="slate">Database Explorer</Title>

            <Grid p="1em" grow>
              <Grid.Col span={6}>
                <Text>
                  Use the interactive <Link to="/database">database explorer</Link> to browse 
                  the quicklook movies for each day. These movies are generated from the images
                  that are captured overnight and contrast enhanced to provide a quicklook at 
                  the type of data that was collected.
                  <p/>
                  A processed data product ("level-1") is an HDF5 file containing all of the 
                  image data for the night.
                  <p/>
                  There are links on each page to download the movies and processed data.
                </Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Image src={browserImage} alt="Browser screenshot" radius="md" height="16em" fit="contain" />
              </Grid.Col>
            </Grid>
          </Box>

          <Box my="1em">
            <Title order={2} color="slate">Database Repository</Title>
            <Text p="1em">
              The MANGO data products are available for bulk or programmatic download from our <Anchor href="https://data.mangonetwork.org/data/transport/mango/archive" target="_blank"> data server</Anchor> via HTTPS. Each product has a URL path with the following format:

              <Center>
                <Code>
                  https://data.mangonetwork.org/data/transport/mango/archive/SITE/INSTRUMENT/PRODUCT/YEAR/YDAY/FILENAME
                </Code>
              </Center>

              <p/>
              For example, the quicklook image for the greenline camera at CFS for January 4, 2023 is located at:

              <Center>
                <Code>
                  https://data.mangonetwork.org/data/transport/mango/archive/cfs/greenline/quicklook/2023/004/mango-cfs-greenline-quicklook-20230104.mp4
                </Code>
              </Center>
            </Text>
          </Box>

          <Box my="1em">
            <Title order={2} color="slate">FPI Wind Data</Title>
            <Text p="1em">
              The FPI derived <Anchor href="http://airglow.ece.illinois.edu/Data/Calendar">wind data products</Anchor> are available from Dr. Jonathan Makela at the University of Illinois. 
            </Text>
          </Box>


        </Container>
    )
}

export { Data } 
