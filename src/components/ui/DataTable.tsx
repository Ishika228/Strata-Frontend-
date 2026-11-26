import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, Download, Settings2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  bulkActions?: {
    label: string;
    action: (selectedIds: string[]) => void;
    isDestructive?: boolean;
  }[];
  defaultSortKey?: string;
  defaultSortDir?: 'asc' | 'desc';
  pageSize?: number;
  emptyState?: React.ReactNode;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  bulkActions,
  defaultSortKey,
  defaultSortDir = 'asc',
  pageSize = 25,
  emptyState,
  className,
}: DataTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(defaultSortDir);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(columns.map((c) => c.key));
  const [showColumnChooser, setShowColumnChooser] = useState(false);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(data.map(keyExtractor));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filteredColumns = columns.filter((c) => visibleColumns.includes(c.key));

  return (
    <div className={cn('flex flex-col bg-white rounded-xl border border-[#E2E8F0] shadow-soft-sm overflow-hidden', className)}>
      {/* Table Toolbar / Bulk Action Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#F4F8FC] border-b border-[#E2E8F0] text-xs text-[#334B68]">
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 ? (
            <div className="flex items-center gap-2 bg-[#DDF5F4] text-[#008F87] border border-[#00B5A4]/40 px-3 py-1 rounded-md font-semibold">
              <span>{selectedIds.length} selected</span>
              <button
                onClick={() => setSelectedIds([])}
                className="underline hover:text-[#08294A] ml-1 text-xs"
              >
                Clear
              </button>
            </div>
          ) : (
            <span className="text-[#71849A] font-medium">Showing {data.length} records</span>
          )}

          {selectedIds.length > 0 && bulkActions && bulkActions.length > 0 && (
            <div className="flex items-center gap-2">
              {bulkActions.map((ba, idx) => (
                <button
                  key={idx}
                  onClick={() => ba.action(selectedIds)}
                  className={cn(
                    'px-2.5 py-1 font-semibold rounded-md shadow-soft-sm text-xs transition',
                    ba.isDestructive
                      ? 'bg-[#E665B1] text-white hover:bg-[#c94b96]'
                      : 'bg-white border border-[#E2E8F0] text-[#102747] hover:bg-[#EAF3F8]'
                  )}
                >
                  {ba.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => {
              const csvContent = 'data:text/csv;charset=utf-8,' + [columns.map((c) => c.header).join(','), ...data.map((row: any) => columns.map((c) => `"${row[c.key] ?? ''}"`).join(','))].join('\n');
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement('a');
              link.setAttribute('href', encodedUri);
              link.setAttribute('download', 'export.csv');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border border-[#E2E8F0] bg-white text-[#334B68] hover:bg-[#EAF3F8] transition shadow-soft-sm"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#71849A]" />
            <span>Export</span>
          </button>

          <button
            onClick={() => setShowColumnChooser(!showColumnChooser)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border border-[#E2E8F0] bg-white text-[#334B68] hover:bg-[#EAF3F8] transition shadow-soft-sm"
          >
            <Settings2 className="w-3.5 h-3.5 text-[#71849A]" />
            <span>Columns</span>
          </button>

          {showColumnChooser && (
            <div className="absolute right-0 top-9 z-30 w-48 p-2 bg-white border border-[#E2E8F0] rounded-lg shadow-soft-lg space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#71849A] px-1">Visible Columns</span>
              {columns.map((col) => (
                <label key={col.key} className="flex items-center gap-2 px-2 py-1 hover:bg-[#EAF3F8] rounded cursor-pointer text-xs text-[#334B68]">
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(col.key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setVisibleColumns([...visibleColumns, col.key]);
                      } else {
                        setVisibleColumns(visibleColumns.filter((k) => k !== col.key));
                      }
                    }}
                    className="rounded text-[#00B5A4] focus:ring-[#00B5A4] w-3.5 h-3.5"
                  />
                  <span>{col.header}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-[#F4F8FC] border-b border-[#E2E8F0] sticky top-0 z-10">
            <tr>
              {bulkActions && (
                <th className="w-8 p-3 text-center">
                  <input
                    type="checkbox"
                    checked={data.length > 0 && selectedIds.length === data.length}
                    onChange={handleSelectAll}
                    className="rounded text-[#00B5A4] focus:ring-[#00B5A4] w-3.5 h-3.5"
                  />
                </th>
              )}
              {filteredColumns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={cn(
                    'p-3 font-bold text-[#102747] select-none tracking-wider uppercase text-[10px]',
                    col.sortable !== false && 'cursor-pointer hover:bg-[#EAF3F8]',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                    col.className
                  )}
                >
                  <div className={cn('inline-flex items-center gap-1', col.align === 'right' && 'justify-end')}>
                    <span>{col.header}</span>
                    {col.sortable !== false && (
                      sortKey === col.key ? (
                        sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-[#00B5A4]" /> : <ChevronDown className="w-3 h-3 text-[#00B5A4]" />
                      ) : (
                        <ChevronsUpDown className="w-3 h-3 text-[#71849A] opacity-40" />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {data.length === 0 ? (
              <tr>
                <td colSpan={filteredColumns.length + (bulkActions ? 1 : 0)} className="p-8 text-center">
                  {emptyState || <span className="text-[#71849A]">No records found</span>}
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const id = keyExtractor(item);
                const isSelected = selectedIds.includes(id);

                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={cn(
                      'transition-colors duration-100',
                      onRowClick && 'cursor-pointer hover:bg-[#F4F8FC]',
                      isSelected && 'bg-[#DDF5F4]/40'
                    )}
                  >
                    {bulkActions && (
                      <td className="w-8 p-3 text-center" onClick={(e) => handleToggleRow(id, e)}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="rounded text-[#00B5A4] focus:ring-[#00B5A4] w-3.5 h-3.5"
                        />
                      </td>
                    )}
                    {filteredColumns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          'p-3 text-[#334B68] align-middle font-medium',
                          col.align === 'right' && 'text-right font-mono',
                          col.align === 'center' && 'text-center',
                          col.className
                        )}
                      >
                        {col.render ? col.render(item) : (item as any)[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
