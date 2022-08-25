import React from 'react'
import map from './asi-map.png'

import { 
    Container, 
    Image,
    Grid,
    Text,
    Title,
    MediaQuery
    } from '@mantine/core'

const Home = () => {

    return (
      <Container my="2em" size="md">
        <Title color="slate"> Welcome to MANGO </Title>

        <Grid gutter={60} justify="center">
          <Grid.Col sm={6}>
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Image radius="sm" src={map} alt="Site map"/>
            </MediaQuery>
            <Text size="sm" my="md" align="justify">
              The Midlatitude Allsky-imaging Network for GeoSpace
              Observations (MANGO) is a collection of all-sky cameras
              and Fabry-Perot Interferometers (FPIs) spread across
              the continental United States with the goal of imaging
              large-scale airglow and aurora features in multiple
              wavelengths and measure neutral winds and temperatures
              associated with the observed dynamics. MANGO is used to
              observe the generation, propagation, and dissipation of
              medium and large-scale wave activity in the subauroral,
              mid and low-latitude thermosphere. The network of seven
              imagers observing emission from the atomic oxygen at
              630nm wavelength ('red line') was deployed starting 2014,
              later funded by NSF AGS award # 1452357. This network is
              currently being augmented through NSF DASI award #1933013
              with a network of atomic oxygen 557.7nm ('green line')
              imagers in the western United States, along with four
              FPIs that measure both red and green line winds. The map
              below shows fields-of-view of all the current, past, and
              potential instruments. At completion, there will be nine
              green-line imagers in this network. These imagers form
              a network providing continuous coverage over the western
              United States, including California, Oregon, Washington,
              Utah, Arizona and Texas extending south into Mexico. This
              network sees high levels of both medium and large scale
              wave activity.
            </Text>
            </Grid.Col> 
            <Grid.Col sm={6}>
              <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                <Image radius="sm" src={map} alt="Site map"/>
              </MediaQuery>
            </Grid.Col>
          </Grid>
          <Text size="xs" align="center" color="gray.7" pt="1em" px="4em">
            <i>
              This material is based upon work supported by the
              National Science Foundation. Any opinions, findings and
              conclusions are recommendations expressed in this material
              are those of the author(s) and do not necessarily reflect
              the views of the National Science Foundation (NSF).
            </i>
          </Text> 
      </Container>
    )
}

export { Home }
