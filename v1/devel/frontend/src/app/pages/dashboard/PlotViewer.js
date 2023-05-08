import React from 'react'

import {
    createStyles,
    Center,
    Image
} from '@mantine/core'

const useStyles = createStyles((theme) => {

    return {

        wrapper: {
            position: 'relative',
            height: '100%',
            width: '100%',
        },

        player: {
          display: 'block',
          margin: '0 auto',
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: '100%',

          [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
            height: 480,
          }
        },

    }

})    

const PlotViewer = ({url}) => {

    const { classes } = useStyles()

    return (
        <div className={classes.wrapper}>
        <Center style={{ width: '100%', height: '100%' }}>
          <Image src={url} withPlaceholder className={classes.player} />
        </Center>
        </div>
    )

}

export { PlotViewer }

