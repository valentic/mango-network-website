import React from 'react'
import { DateTime } from 'luxon'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'

import { Calendar } from '@mantine/dates'
import { isSameDate } from '@mantine/dates'

import { 
    useNavigate
} from 'react-router-dom'

import {
    ActionIcon,
    Button,
    Card,
    Divider,
    Grid,
    Group,
    Stack,
    Table,
    Text,
    useMantineTheme,
    createStyles,
} from '@mantine/core'

const useStyles = createStyles((theme) => {

    return {
        
        header: {
            margin: '0 0 5px 0',
            padding: '5px 10px',
            backgroundColor: theme.colors.gray[3]
        },

        title: {
            lineHeight: 1
        }
    }

})

// https://github.com/Hacker0x01/react-datepicker/issues/1787
// https://github.com/JohnStarich/sage/blob/b422b0ccef05fffe29143f335017ad2fc24f76fc/web/src/UTCDatePicker.js

const convertUTCToLocal = (date) => {
    if (!date) {
        return date
    }
    date = new Date(date)
    date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    return date
}

const convertLocalToUTC = (date) => {
    if (!date) {
        return date
    }
    date = new Date(date)
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    return date
}

const DayNavigation = ({selectedDate, data, onPrev, onNext}) => {

    const disablePrev = data ? selectedDate <= data[0] : true
    const disableNext = data ? selectedDate >= data[data.length-1] : true

    return (
        <Group position="center">
            <Button 
                onClick={onPrev} 
                leftIcon={<IconArrowLeft/>}
                disabled={disablePrev}
            >
                Prev
            </Button>
            <Button 
                onClick={onNext} 
                rightIcon={<IconArrowRight/>}
                disabled={disableNext}
            >
                Next
            </Button>
        </Group>
    )
}

const DownloadSection = ({selectedDate, downloads}) => {
    
    const rows = downloads.map(src => {
        const active = src.data.some(ts => isSameDate(selectedDate, ts))

        const buttons = src.exts.map(ext => {
            return (
              <Button 
                key={ext}
                disabled={!active} 
                compact 
                download
                href={`${src.url}.${ext}`}
                component='a'
              >
                {ext} 
              </Button>
            )
        })

        return (
            <tr key={src.label}>
              <td>
                <Text c="dimmed" ta="right">{src.label}</Text>
              </td>
              <td>
                <Group spacing="xs" ml="15">
                  {buttons}
                </Group>
              </td>
            </tr>
        )
    })

    return (
      <Stack mt={15}>
        <Divider />
        <Text fz="md" c="dimmed" ta="center">
          Downloads
        </Text>
        <Table>
          <tbody>
            {rows}
          </tbody>
        </Table>
      </Stack>
    )

}

const CalendarHeader = ({title, subtitle, onPrev, onNext }) => {

    const { classes } = useStyles()

    return (
        <Grid className={classes.header} justify="space-between" align="center">
          <ActionIcon onClick={onPrev} variant="light" color="gray">
            <IconArrowLeft />
          </ActionIcon>
          <Stack spacing={0} justify="flex-start" align="center">
            <Text weight={500} size="lg" className={classes.title}>
              {title.toUpperCase()}
            </Text>
            <Text size='xs' lineClamp={1} color="gray.8" mt={3}>
              {subtitle}
            </Text>
          </Stack>
          <ActionIcon onClick={onNext} variant="light" color="gray">
            <IconArrowRight />
          </ActionIcon>
        </Grid>
    )

}


const CalendarView = ({
    title, 
    subtitle, 
    selectedDate, 
    data, 
    downloads,
    onHeaderNext, 
    onHeaderPrev, 
    className
    }) => {

    // data is a list of timestamps 
    // downloads is a dictionary of data timestamp lists 

    const theme = useMantineTheme()
    const navigate = useNavigate()

    if (data.length===0) {
        return null
    }

    const minTime = convertUTCToLocal(data[0])
    const maxTime = convertUTCToLocal(data[data.length-1])

    maxTime.setMinutes(1)   // Need to make sure first of month is shown

    const excludeDate = localdate => {
        const utcdate = convertLocalToUTC(localdate)
        return !data.some(e => isSameDate(utcdate, e))
    }

    const changeDay = (utcdate, inc) => {
        const dt = DateTime.fromJSDate(utcdate, { zone: 'UTC' })
        const newday = dt.plus({days: inc})
        navigate('../' + newday.toISODate(), { replace: true })
    }

    const onDateChange = localdate => {
        changeDay(convertLocalToUTC(localdate), 0)
    }

    const prevDay = () => changeDay(selectedDate, -1)
    const nextDay = () => changeDay(selectedDate, +1)

    const localDate = convertUTCToLocal(selectedDate)

    const dayStyle = (date, modifiers) => {
        if (modifiers.selected) {
            if (modifiers.disabled) {
                return { 
                    border: `1px solid ${theme.colors.slate[6]}`,
                    backgroundColor: 'none', 
                    borderRadius: 100,
                    position: 'relative'
                }
            } else {
                return { 
                    backgroundColor: theme.colors.slate[6],
                    borderRadius: 100,
                    position: 'relative'
                }
            }
        }
    }

    return (
      <Card withBorder className={className}>
        <Card.Section>
          <CalendarHeader 
            title={title} 
            subtitle={subtitle} 
            onNext={onHeaderNext}
            onPrev={onHeaderPrev}
            />
        </Card.Section>
        <Stack align="center" justify="flex-start">
          <Calendar     
            my={10}
            size="sm"
            value={localDate}
            month={localDate}
            minDate={minTime} 
            maxDate={maxTime} 
            firstDayOfWeek='sunday' 
            weekendDays={[]}
            hideOutsideDates={true}
            onChange = { onDateChange } 
            onMonthChange = { onDateChange }
            excludeDate = { excludeDate }
            dayStyle = {dayStyle}
          />
          <DayNavigation
            selectedDate={selectedDate}
            data={data}
            onPrev={prevDay}
            onNext={nextDay}
          />
          <DownloadSection
            selectedDate={selectedDate}
            downloads={downloads}
          />
        </Stack>
      </Card>
    )
}

export { CalendarView }

