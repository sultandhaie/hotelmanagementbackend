"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
//import { RoomStatus, STATUS_CONFIG } from "@/app/type/Room";
//import { X } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  //onBulkStatusChange?: (rowIndices: number[], newStatus: RoomStatus) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  //onBulkStatusChange,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([
    { id: "id", desc: false }, // ✅ default ascending
  ]);
  const table = useReactTable({
    data,
    columns: [...columns],
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { rowSelection, sorting },
  });
/*
  const selectedRowIndices = Object.keys(rowSelection)
    .filter((key) => rowSelection[key])
    .map(Number);
*/
  //const selectedCount = selectedRowIndices.length;
/*
  const handleBulkStatusChange = (newStatus: RoomStatus) => {
    onBulkStatusChange?.(selectedRowIndices, newStatus);
    setRowSelection({});
  };
*/
  return (
    <div className="space-y-2">
      {/* Bulk Action Toolbar */}
      {
      /*
      selectedCount > 0 && (
        <div className="flex items-center gap-3 rounded-md border bg-muted/50 px-4 py-2.5 text-sm animate-in fade-in slide-in-from-top-1 duration-150">
          <span className="font-medium text-foreground">
            {selectedCount} row{selectedCount > 1 ? "s" : ""} selected
          </span>

          <div className="h-4 w-px bg-border" />

          <span className="text-muted-foreground">Change status to:</span>

          <div className="flex items-center gap-1.5">
            {(Object.keys(STATUS_CONFIG) as RoomStatus[]).map((status) => {
              const { color, bg, dot, label } = STATUS_CONFIG[status] ?? {};
              return (
                <button
                  key={status}
                  onClick={() => handleBulkStatusChange(status)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all border border-transparent hover:border-current hover:scale-105 ${bg} ${color}`}
                >
                  <span className={`w-2 h-2 rounded-full ${dot}`} />
                  {label ?? status}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setRowSelection({})}
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear selection"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )
      
      */}

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className="cursor-pointer"
                  onClick={(e) => {
                    // Don't toggle if clicking inside the select column cell
                    const target = e.target as HTMLElement;
                    if (target.closest("[data-select-cell]")) return;
                    row.toggleSelected();
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center "
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
