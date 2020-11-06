import { makeStyles, createStyles } from '@material-ui/core'
import React from 'react'
import clsx from 'clsx'

const useStyles = makeStyles(() =>
    createStyles({
        container: (props: DefaultCellProps) => ({
            flexGrow: props.width,
            flexBasis: props.width,
            textAlign: typeof props.children === 'number' ? 'center' : 'left',
            flexShrink: props.width,
        }),
    }),
)

interface DefaultCellProps {
    children: string | number
    width: number
    cellProps?: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    >
}

const Cell = (props: DefaultCellProps): JSX.Element => {
    const { children, cellProps } = props
    const classes = useStyles(props)

    let restProps = {}
    let customClassname: string | undefined
    if (cellProps) {
        const { className, ...rest } = cellProps
        restProps = rest
        customClassname = className
    }

    return (
        <div
            className={clsx(classes.container, customClassname)}
            {...restProps}
        >
            {children}
        </div>
    )
}

export default Cell
