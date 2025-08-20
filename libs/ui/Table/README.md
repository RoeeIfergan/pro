# @pro3/Table

A powerful, feature-rich table component built with TanStack Table and TanStack Virtual, using Material-UI components.

## Features

- ✅ **TanStack Table**: Full-featured table with sorting, filtering, grouping
- ✅ **TanStack Virtual**: Virtualization for handling large datasets efficiently
- ✅ **Material-UI Integration**: Native MUI Table components with theming support
- ✅ **Resizable Columns**: Drag to resize column widths
- ✅ **Selectable Rows**: Single and multi-row selection with checkboxes
- ✅ **Sub Rows / Expandable Rows**: Hierarchical data with expand/collapse
- ✅ **Column Pinning**: Pin columns to left or right side
- ✅ **Grouping**: Group rows by column values
- ✅ **Infinite Scrolling**: Load more data on scroll
- ✅ **Column Ordering**: Drag and drop to reorder columns
- ✅ **Column Visibility**: Show/hide columns dynamically
- ✅ **Sorting**: Multi-column sorting support
- ✅ **Row Interactions**: onClick and onDoubleClick handlers

## Installation

```bash
npm install @pro3/Table
```

## Basic Usage

```tsx
import { PTable } from '@pro3/Table'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'

interface Person {
  id: number
  firstName: string
  lastName: string
  age: number
  email: string
}

const columnHelper = createColumnHelper<Person>()

const columns: ColumnDef<Person, any>[] = [
  columnHelper.accessor('firstName', {
    header: 'First Name',
    size: 150
  }),
  columnHelper.accessor('lastName', {
    header: 'Last Name',
    size: 150
  }),
  columnHelper.accessor('age', {
    header: 'Age',
    size: 100
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    size: 200
  })
]

function MyTable() {
  const [data, setData] = useState<Person[]>([])
  const [selected, setSelected] = useState({})

  return (
    <PTable
      data={data}
      columns={columns}
      selected={selected}
      setSelected={setSelected}
      enableRowSelection={true}
      enableColumnResizing={true}
      enableSorting={true}
    />
  )
}
```

## Advanced Usage with All Features

```tsx
function AdvancedTable() {
  const [data, setData] = useState<Person[]>([])
  const [selected, setSelected] = useState({})
  const [columnOrder, setColumnOrder] = useState<string[]>([])
  const [columnPinning, setColumnPinning] = useState({})
  const [columnGrouping, setColumnGrouping] = useState<string[]>([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [hasNext, setHasNext] = useState(true)

  const loadMore = useCallback(() => {
    // Load more data logic
  }, [])

  const handleRowClick = useCallback((row) => {
    console.log('Row clicked:', row.original)
  }, [])

  const getSubRows = useCallback((originalRow: Person) => {
    return originalRow.subRows
  }, [])

  return (
    <PTable
      data={data}
      columns={columns}
      selected={selected}
      setSelected={setSelected}
      isLoading={isLoading}
      loadMore={loadMore}
      hasNext={hasNext}
      onClickRow={handleRowClick}
      onDoubleClickRow={handleRowClick}
      columnOrder={columnOrder}
      setColumnOrder={setColumnOrder}
      columnPinning={columnPinning}
      setColumnPinning={setColumnPinning}
      columnGrouping={columnGrouping}
      setColumnGrouping={setColumnGrouping}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
      enableRowSelection={true}
      enableColumnResizing={true}
      enableSubRows={true}
      enableGrouping={true}
      enableColumnPinning={true}
      enableSorting={true}
      getSubRows={getSubRows}
    />
  )
}
```

## Props API

| Prop                   | Type                                                          | Default      | Description                                    |
| ---------------------- | ------------------------------------------------------------- | ------------ | ---------------------------------------------- |
| `data`                 | `TData[]`                                                     | **required** | Array of data objects to display               |
| `columns`              | `ColumnDef<TData, any>[]`                                     | **required** | Column definitions using TanStack Table format |
| `selected`             | `RowSelectionState`                                           | `{}`         | Currently selected rows                        |
| `setSelected`          | `OnChangeFn<RowSelectionState>`                               | -            | Callback when row selection changes            |
| `isLoading`            | `boolean`                                                     | `false`      | Show loading indicator                         |
| `loadMore`             | `() => void`                                                  | -            | Function to load more data (infinite scroll)   |
| `hasNext`              | `boolean`                                                     | `false`      | Whether more data is available to load         |
| `onClickRow`           | `(row: Row<TData>) => void`                                   | -            | Callback when row is clicked                   |
| `onDoubleClickRow`     | `(row: Row<TData>) => void`                                   | -            | Callback when row is double-clicked            |
| `columnOrder`          | `ColumnOrderState`                                            | -            | Current column order                           |
| `setColumnOrder`       | `OnChangeFn<ColumnOrderState>`                                | -            | Callback when column order changes             |
| `columnPinning`        | `ColumnPinningState`                                          | -            | Currently pinned columns                       |
| `setColumnPinning`     | `OnChangeFn<ColumnPinningState>`                              | -            | Callback when column pinning changes           |
| `columnGrouping`       | `GroupingState`                                               | `[]`         | Currently grouped columns                      |
| `setColumnGrouping`    | `OnChangeFn<GroupingState>`                                   | -            | Callback when grouping changes                 |
| `columnVisibility`     | `VisibilityState`                                             | -            | Column visibility state                        |
| `setColumnVisibility`  | `OnChangeFn<VisibilityState>`                                 | -            | Callback when visibility changes               |
| `enableRowSelection`   | `boolean`                                                     | `true`       | Enable row selection with checkboxes           |
| `enableColumnResizing` | `boolean`                                                     | `true`       | Enable column resizing                         |
| `enableSubRows`        | `boolean`                                                     | `false`      | Enable expandable sub-rows                     |
| `enableGrouping`       | `boolean`                                                     | `false`      | Enable column grouping                         |
| `enableColumnPinning`  | `boolean`                                                     | `false`      | Enable column pinning                          |
| `enableSorting`        | `boolean`                                                     | `true`       | Enable column sorting                          |
| `getSubRows`           | `(originalRow: TData, index: number) => TData[] \| undefined` | -            | Function to get sub-rows for hierarchical data |

## Column Definition

Columns use the standard TanStack Table `ColumnDef` format. See [TanStack Table documentation](https://tanstack.com/table/v8/docs/guide/column-defs) for full details.

```tsx
const columns = [
  columnHelper.accessor('firstName', {
    header: 'First Name',
    size: 150,
    enableGrouping: true,
    enableSorting: true,
    enableResizing: true
  })
  // ... more columns
]
```

## Running unit tests

Run `nx test @pro3/Table` to execute the unit tests via [Jest](https://jestjs.io).
