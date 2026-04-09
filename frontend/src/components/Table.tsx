import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

interface ITable {
  data: any[]
  columns: any[]
}

const Table = (props: ITable) => {
  const { data, columns } = props

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table className="w-full table-auto">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr
            key={headerGroup.id}
            className="border-t border-gray-200 dark:border-gray-800"
          >
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className=" border-r text-left border-gray-200 px-4 py-3 dark:border-gray-800 text-theme-xs font-bold text-gray-700 dark:text-gray-400"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className="border-t border-gray-200 dark:border-gray-800"
          >
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className="border-r border-gray-200 px-4 py-3 dark:border-gray-800 text-theme-xs font-medium text-gray-700 dark:text-gray-400"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
