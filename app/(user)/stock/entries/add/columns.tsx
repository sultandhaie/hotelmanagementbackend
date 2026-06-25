import { ColumnDef } from "@tanstack/react-table";
import { Entry } from "./page";

interface ColumnsProps {
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

export const getColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<Entry>[] => [
  {
    accessorKey: "product.id",
    header: "N°",
    enableSorting: true,
  },
  {
    accessorKey: "product.name",
    header: "Product",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "initPrice",
    header: "Prix",
  },
  {
    accessorKey: "total",
    header: "Total",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const index = row.index;

      return (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation(); // ✅ prevent row select
              onEdit(index);
            }}
            className="text-blue-500"
          >
            Edit
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(index);
            }}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      );
    },
  },
];
