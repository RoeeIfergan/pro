import { flexRender, Header } from '@tanstack/react-table'
import { useMemo } from 'react'
import useHeaderGroups from './useHeaderGroups'
import { TData } from '../../types'

type depth = number

type Headers = Header<TData, unknown>[]

type useHeaderProps = { depth: depth }

const defaultHeaders: Headers = []

const useHeaders = ({ depth }: useHeaderProps): Headers => {
  const headerGroups = useHeaderGroups({ depth })

  const headers = useMemo(() => {
    const AccumilatedHeaders = headerGroups?.reduce<Headers>(
      (AccumilatedHeaders, currHeaderGroup) => {
        const filteredheaders = currHeaderGroup.headers.filter((header) => {
          if (header.column.depth !== depth) return false

          const headerValue = flexRender(header.column.columnDef.header, header.getContext())

          const columnDefHeader = header.column.columnDef.header
          const headerExists =
            typeof columnDefHeader === 'function'
              ? columnDefHeader(header.getContext())
              : Boolean(columnDefHeader)

          if (typeof headerValue !== 'string' && !headerExists) return false

          return true
        })

        if (filteredheaders) {
          AccumilatedHeaders.push(...filteredheaders)
        }

        return AccumilatedHeaders
      },
      []
    )

    return AccumilatedHeaders || defaultHeaders
  }, [headerGroups, depth])

  return headers
}

export default useHeaders
