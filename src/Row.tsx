import { createStyles, makeStyles } from '@material-ui/core'
import React from 'react'
import Cell from './Cell'
import { Column } from './Table'
import clsx from 'clsx'

const useStyles = makeStyles(() =>
    createStyles({
        container: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-around',
            alignItems: 'stretch',
        },
    }),
)

export interface RowProps<T> {
    index: number
    style: React.CSSProperties
    data: T
    isScrolling?: boolean
}

export interface CellProps<T> {
    dataKey: keyof T
    cellData: T[keyof T]
    rowIndex: number
    colIndex: number
    rowData: T
}

interface DefaultRowComponentProps<T> extends RowProps<T> {
    columns: Column<T>[]
    primitizeCell?: (cellData: T[keyof T]) => string | number
    rowProps?: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    >
    cellProps?: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    >
    customCellRenderer?: (props: CellProps<T>) => JSX.Element
}

function Row<T>(props: DefaultRowComponentProps<T>): JSX.Element {
    const {
        index: rowIndex,
        style,
        data,
        columns,
        primitizeCell,
        rowProps,
        cellProps,
        customCellRenderer,
    } = props
    const classes = useStyles(props)

    let customStyle: React.CSSProperties | undefined
    let restProps = {}
    let customClassname: string | undefined
    if (rowProps) {
        const { style, className, ...rest } = rowProps
        customStyle = style
        restProps = rest
        customClassname = className
    }

    return (
        <div
            style={{ ...style, ...customStyle }}
            className={clsx(classes.container, customClassname)}
            {...restProps}
        >
            {columns.map((col, colIndex) => {
                const cellData: T[keyof T] = data[col.field]
                const itemKey = `${rowIndex}${col.field}`

                if (customCellRenderer)
                    return (
                        <React.Fragment key={itemKey}>
                            {customCellRenderer({
                                dataKey: col.field,
                                cellData,
                                rowIndex,
                                colIndex,
                                rowData: data,
                            })}
                        </React.Fragment>
                    )
                if (
                    typeof cellData !== 'number' &&
                    typeof cellData !== 'string'
                ) {
                    if (!primitizeCell) {
                        throw new Error(
                            `Trying to render a non primitive(non-number or non-string) cell in row ${rowIndex}, column ${colIndex}. Please use primitizeCell prop to check the type of the value to be displayed`,
                        )
                    }
                }

                const cellDataToRender: number | string = primitizeCell
                    ? primitizeCell(cellData)
                    : ((cellData as unknown) as number | string)
                return (
                    <Cell key={itemKey} width={col.width} cellProps={cellProps}>
                        {cellDataToRender}
                    </Cell>
                )
            })}
        </div>
    )
}

export default Row
