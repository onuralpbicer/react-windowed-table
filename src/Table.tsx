import React from 'react'
import { default as AutoSizer, Size } from 'react-virtualized-auto-sizer'
import { ListChildComponentProps, VariableSizeList } from 'react-window'
import Row, { CellProps, RowProps } from './Row'

export type TableProps<T> = {
    rows: T[]
    columns: Column<T>[]
    customRowRenderer?: (props: RowProps<T>) => JSX.Element
    customCellRenderer?: (props: CellProps<T>) => JSX.Element
    primitizeCell?: (cellData: T[keyof T]) => string | number
    rowProps?: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    >
    cellProps?: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
    >
    itemSize: number | ((index: number) => number)
    onResize?: (size: Size) => void
    style?: React.CSSProperties
    className?: string
}

export interface Column<T> {
    field: keyof T
    headerName: string
    width: number
}

function Table<T>(props: TableProps<T>): JSX.Element {
    const {
        rows,
        columns,
        customRowRenderer,
        primitizeCell,
        rowProps,
        cellProps,
        itemSize,
        onResize,
        style,
        className,
        customCellRenderer,
    } = props
    return (
        <AutoSizer onResize={onResize}>
            {(size: Size) => (
                <VariableSizeList
                    {...size}
                    itemCount={rows.length}
                    itemSize={
                        typeof itemSize === 'number' ? () => itemSize : itemSize
                    }
                    style={style}
                    className={className}
                >
                    {(row: ListChildComponentProps) => {
                        const rowData = rows[row.index]
                        const returnRowProps = {
                            ...row,
                            data: rowData,
                        }
                        if (customRowRenderer)
                            return customRowRenderer(returnRowProps)
                        return (
                            <Row
                                {...returnRowProps}
                                columns={columns}
                                primitizeCell={primitizeCell}
                                rowProps={rowProps}
                                cellProps={cellProps}
                                customCellRenderer={customCellRenderer}
                            />
                        )
                    }}
                </VariableSizeList>
            )}
        </AutoSizer>
    )
}

export default Table
