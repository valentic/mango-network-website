import React from 'react'

import {
    createStyles,
    Center
} from '@mantine/core'

const useStyles = createStyles((theme) => {

    const delay = '200ms'

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

        noshow: {
            display: 'none'
        },

        show: {
            display: 'block'
        },

        visible: {
            visibility: 'visible',
            opacity: 1,
            transition: `opacity ${delay} linear`
        },

        hidden: {
            visibility: 'hidden',
            opacity: 0,
            transition: `visibility 0s ${delay}, opacity ${delay} linear`
        },

        error: {
            color: 'white',
            border: '1px solid green',
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: 1,
            backgroundColor: 'black'
        }

    }

})    

const MovieViewer = ({url}) => {

    // URL excludes the file extension. We will add them for all the video formats

    const { classes, cx } = useStyles()
    const [ error, setError ] = React.useState(false)
    const videoRef = React.useRef()

    const mp4 = `${url}.mp4`
    const webm = `${url}.webm`

    const onError = () => { 
        setError(true); 
        }
    
    React.useEffect(() => {
        setError(false)
        videoRef.current?.load()
    },[url])

    return (
        <div className={classes.wrapper}>
        <Center style={{ width: '100%', height: '100%' }}>
            <div className={cx(classes.error, {
                [classes.visible]: error,
                [classes.hidden]: !error
                })}
            >
              <Center style={{ width: '100%', height: '100%' }}>
                Sorry, no movie was found for this day.
              </Center>
            </div>
            <video 
              ref={videoRef}
              controls preload="auto" playsInline muted autoPlay
              className={classes.player} 
            >
              <source src={webm} type="video/webm" />
              <source src={mp4} type="video/mp4" onError={onError} />
            </video>
        </Center>
        </div>
    )

}

export { MovieViewer }

