import React from 'react'
import Cell from './Cell'
import { Column } from './Table'
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
    primitizeCell?: (props: CellProps<T>) => string | number
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

    let customStyle: React.CSSProperties | undefined
    let restProps = {}
    if (rowProps) {
        const { style, className, ...rest } = rowProps
        customStyle = style
        restProps = rest
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                justifyContent: 'space-around',
                alignItems: 'stretch',
                ...style,
                ...customStyle,
            }}
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
                    ? primitizeCell({
                          dataKey: col.field,
                          cellData,
                          rowIndex,
                          colIndex,
                          rowData: data,
                      })
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
