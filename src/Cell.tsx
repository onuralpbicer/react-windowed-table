import React from 'react'

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

    let restProps = {}
    let customStyle: React.CSSProperties | undefined
    if (cellProps) {
        const { style, ...rest } = cellProps
        restProps = rest
        customStyle = style
    }

    return (
        <div
            style={{
                flexGrow: props.width,
                flexBasis: props.width,
                textAlign:
                    typeof props.children === 'number' ? 'center' : 'left',
                flexShrink: props.width,
                ...customStyle,
            }}
            {...restProps}
        >
            {children}
        </div>
    )
}

export default Cell
