# React Windowed Table

A table component built on [react-window](https://github.com/bvaughn/react-window) that lets you build a virtualized table that can handle thousands of lines of items with a very simple api while giving you 100% flexibility on the appearance.

## Install

---

`npm install --save react-windowed-table`

## TypeScript

---

All of the components are built using fully typed interfaces and types with generic types that infer the type of the list from your input. This means you don't have to deal with `any` typed data items in your callbacks, if you choose to use them. You don't have to wrestle with TypeScript to get your typings to work.

## Usage

---

```typescript
import { Table } from 'react-windowed-table'

const App = (): JSX.Element => {
    return (
        <div style={{ height: '600px', width: '1200px' }}>
            <Table rows={tableRows} columns={columns} itemSize={40} />
        </div>
    )
}
```

Only required props are:

-   rows: List of RowItems which can be any object
-   columns: List of [Columns](#props)
-   itemSize: Either a number if you're after a fixed size list, or a function that returns a number if you're looking for a variable sized list.

And that's it! With only 3 props, you can be up and running with a working virtualized table. See [props](#props) for a list of all props

## Future Additions

---

At the moment, the functionality is pretty limited. You do get a neat table with a lot of things abstrated away, but that is all you get. To implement features such as selecting items etc, you will need to use any of the variety of customization props. In the future, I am planning to add support for the following features(order doesn't represent priority).

-   Remove dependency on Material-UI(only used for styling at the moment which is very minimal)
-   Built in header, with the option to turn it off(soon)
-   Built in sorting
-   Built in searching
-   Built in selection and a variety of actions(buttons to add, delete, refresh things)
-   Anything you might want to see! Open an issue on my [github](https://github.com/onuralpbicer/react-windowed-table/issues) and ask for any feature you want.

## Props

---

### rows _(required)_ : T[ ]

Rows is just a list of row items to be displayed in your table. TypeScript infers the type of the row items so you don't have to worry about formatting your row just right for this component.

### columns _(required)_: Column\<T>[ ]

List of column items which will determine the width of that column and in the future, the header name. The field property of a Column has to be a key of the row object. Column type is exported as an interface so you can use it in your projects. If you're not using any typing on the column object, use `as const` to make TypeScript know how to check whether or not the field property actually is a key of the row item

```typescript
import { Column } from 'react-windowed-table'

/*
interface Column<T> {
    field: keyof T
    headerName: string
    width: number
}*/

// Example Row Item
interface RowItem {
    id: number
    lastName: string
    firstName: string
    age: number
}

// With the Column interface, works
const columns: Column<RowItem>[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'First name', width: 130 },
    { field: 'lastName', headerName: 'Last name', width: 130 },
    { field: 'age', headerName: 'Age', width: 90 },
]

// Without the Column interface, works
const columns = [
    { field: 'id' as const, headerName: 'ID', width: 70 },
    { field: 'firstName' as const, headerName: 'First name', width: 130 },
    { field: 'lastName' as const, headerName: 'Last name', width: 130 },
    { field: 'age' as const, headerName: 'Age', width: 90 },
]

// Without the Column interface, doesn't work(firstname is spelled differently)
const columns = [
    { field: 'id' as const, headerName: 'ID', width: 70 },
    { field: 'firstname' as const, headerName: 'First name', width: 130 },
    { field: 'lastName' as const, headerName: 'Last name', width: 130 },
    { field: 'age' as const, headerName: 'Age', width: 90 },
]
```

### itemSize _(required)_: number | ((index: number) => number)

Either a number of a function that returns a number. This prop is used to determine the height of one table row.

### style _(optional)_: React.CSSProperties

A good old style prop which will be applied to the container.

### className _(optional)_: string

Class name that will be applied to the container.

### customRowRenderer _(optional)_: (props: RowProps<T>) => JSX.Element

Exposing a render function which you can use to customize your table rows.

```typescript
interface RowProps<T> {
    index: number
    style: React.CSSProperties
    data: T
    isScrolling?: boolean
}
```

**NOTE:** If you're using this function, make sure to apply the style prop to your table row container. Otherwise the positioning of your rows will NOT work due to react-window working by absolutely positioning the rows

### customCellRenderer _(optional)_: (props: CellProps<T>) => JSX.Element

Exposing a render function which you can use to customize your cells.

```typescript
interface CellProps<T> {
    dataKey: keyof T
    cellData: T[keyof T]
    rowIndex: number
    colIndex: number
    rowData: T
}
```

**NOTE:** This prop does NOT have any effect if customRowRenderer is being used

### primitizeCell _(optional)_: (props: CellProps<T>) => string | number

A function that's called on every cell, to turn their type into `string` or `number`. This prop is not necessary if all fields of your row item are `string` or `number`, but if any field isn't one of those and this prop isn't used, the component WILL throw an error.

**NOTE:** This prop does NOT have any effect if customRowRenderer OR customCellRenderer is being used

### rowProps _(optional)_:

Props that will be spread onto the default row's div. It has all the props that a normal div has. For example, you can use the onClick in rowProps to catch click events from a single row.

**NOTE:** This prop does NOT have any effect if customRowRenderer is being used

### cellProps _(optional)_:

Props that will be spread onto the default cells's div. It has all the props that a normal div has. For example, you can use the onClick in cellProps to catch click events from a single cell.

**NOTE:** This prop does NOT have any effect if customCellRenderer is being used

### onResize _(optional)_: (size: Size) => void

A function that is called when the container changes its size.

```typescript
interface Size {
    height: number
    width: number
}
```
