import React from 'react'

import { 
    Container, 
    Text,
    Title,
    Anchor,
    List
    } from '@mantine/core'

const news_items = [
    {
        key: "nsf_aurora",
        date: "2025",
        source: "NSF",
        title: "How to catch an aurora",
        url: "https://www.nsf.gov/science-matters/how-catch-aurora",
    },
    {
        key: "spaceweather_surprise",
        date: "2021",
        source: "spaceweather.com",
        title: "Surprise: some red auroras are *not* auroras",
        url: "https://www.spaceweather.com/archive.php?view=1&day=23&month=11&year=2021",
    },
]

const journal_papers = [
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
    },
    {
        key: "inchin2024",
        authors: "Inchin, P. A., Bhatt, A., Bramberger, M., Chakraborty, S., Debchoudhury, S., & Heale, C.",
        date: "2024",
        title: "Atmospheric and ionospheric responses to orographic gravity waves prior to the December 2022 cold air outbreak",
        journal: "Journal of Geophysical Research: Space Physics",
        pages: "129, e2024JA032485",
        doi: "https://doi.org/10.1029/2024JA032485"
    }
]

const JournalPapers = ({records}) => {

    const items = records.map(item => (
        <List.Item key={item.key}>
          <Text key={item.key} span>
            { item.authors }{" "}({item.date}).{" "}{ item.title }.{" "}
            <i>{item.journal}</i>,{" "}
            {item.pages}.{" "}
            <Anchor href={item.doi}>{item.doi}</Anchor>
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

const NewsItems = ({records}) => {

    const items = records.map(item => (
        <List.Item key={item.key}>
          <Text key={item.key} span>
            <Anchor href={item.url}><i>{item.title}</i></Anchor>{" "}
            ({item.source}, {item.date})
          </Text>
        </List.Item>
    ))

    return (
      <Container my="2em" size="md">
        <Title color="slate"> In the news </Title>

        <List type="ordered" mt="1em" withPadding spacing="md">
          { items }
        </List>

      </Container>
    )
}

const Publications = () => {

    return (
      <Container my="2em" size="md">
        <JournalPapers records={journal_papers} />
        <NewsItems records={news_items} />
      </Container>
    )
}

export { Publications }
