import React from 'react'

import { 
    Container, 
    Text,
    Title,
    Anchor,
    List
    } from '@mantine/core'

const papers = [
    {
        key: "lyons2019",
        authors: "Lyons, L. R., Nishimura, Y., Zhang, S.-R., Coster, A. J., Bhatt, A., Kendall, E., & Deng, Y.",
        date: "2019",
        title: "Identification of auroral zone activity driving large-scale traveling ionospheric disturbances",
        journal: "Journal of Geophysical Research: Space Physics",
        pages: "124, 700–714",
        doi: "https://doi.org/10.1029/2018JA025980"
    },
    {
        key: "heale2019",
        authors: "Heale, C. J., Snively, J. B., Bhatt, A. N., Hoffmann, L., Stephan, C. C., & Kendall, E. A.",
        date: "2019",
        title: "Multilayer observations and modeling of thunderstorm-generated gravity waves over the Midwestern United States",
        journal: "Geophysical Research Letters",
        pages: "46, 14164–14174",
        doi: "https://doi.org/10.1029/2019GL085934"
    },
    {
        key: "bhatt2020",
        authors: "Bhatt, A., Valentic, T., Reimer, A., Lamarche, L., Reyes, P., & Cosgrove, R.",
        date: "2020",
        title: "Reproducible Software Environment: a tool enabling computational reproducibility in geospace sciences and facilitating collaboration",
        journal: "J. Space Weather Space Clim.",
        pages: "10 (2020) 12",
        doi: "https://doi.org/10.1051/swsc/2020011"
    },
    {
        key: "martinis2021",
        authors: "Martinis, C., Nishimura, Y., Wroten, J., Bhatt, A., Dyer, A., Baumgardner, J., & Gallardo-Lacourt, B.",
        date: "2021",
        title: "First simultaneous observation of STEVE and SAR arc combining data from citizen scientists, 630.0 nm all-sky images, and satellites",
        journal: "Geophysical Research Letters",
        pages: "48, e2020GL092169",
        doi: "https://doi.org/10.1029/2020GL092169"
    },
    {
        key: "englert2023",
        authors: "Englert, C.R., Harlander, J.M., Marr, K.D. et al.",
        date: "2023",
        title: "Michelson Interferometer for Global High-Resolution Thermospheric Imaging (MIGHTI) On-Orbit Wind Observations: Data Analysis and Instrument Performance.",
        journal: "Space Sci Rev",
        pages: "219, 27",
        doi: ""
    },
    {
        key: "bhatt2023",
        authors: "Bhatt, A. N., Harding, B. J., Makela, J. J., Navarro, L., Lamarche, L., Valentic, T., Kendall, E. A., & Venkatraman, P.",
        date: "2023",
        title: "MANGO: An Optical Network to Study the Dynamics of the Earth’s Upper Atmosphere",
        journal: "Journal of Geophysical Research: Space Physics",
        pages: "128",
        doi: ""
    },
    {
        key: "inchin2023",
        authors: "Inchin, P., Bhatt, A., Cummer, S., Eckermann, S., Harding, B., Kuhl, D., Ma, J., Makela, J., Sabatini, R., & Snively, J.",
        date: "2023",
        title: "Multi-layer evolution of acoustic-gravity waves and ionospheric disturbances over the United States after the 2022 Hunga-Tonga volcano eruption",
        journal: "AGU Advances",
        pages: "4, e2023AV000870",
        doi: ""
    },
    {
        key: "kerr2023",
        authors: "Kerr, R. B., Kapali, S., Harding, B. J., Riccobono, J., Migliozzi, M. A., Souza, J., Mesquita, R. Dandenault, P., Wu, Q., Pimenta, A., Peres, L., Silva, R.",
        date: "2023",
        title: "Spectral Contamination of the 6300Å Emission in Single-Etalon Fabry-Perot Interferometers", 
        journal: "Journal of Geophysical Research: Space Physics",
        pages: "128, e2023JA031601",
        doi: ""
    }
]

const Publications = () => {

    const items = papers.map(paper => (
        <List.Item key={paper.key}>
          <Text key={paper.key} span>
            { paper.authors }{" "}({paper.date}).{" "}{ paper.title }.{" "}
            <i>{paper.journal}</i>,{" "}
            {paper.pages}.{" "} 
            <Anchor href={paper.doi}>{paper.doi}</Anchor>
          </Text>
        </List.Item>
    ))

    return (
      <Container my="2em" size="md">
        <Title color="slate"> Publications </Title>

        <List type="ordered" mt="1em" withPadding spacing="md">
          { items }
        </List>

      </Container>
    )
}

export { Publications }
