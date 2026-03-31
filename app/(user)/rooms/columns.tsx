import { ColumnDef } from "@tanstack/react-table";
import { Room } from "@/app/type/Room";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

interface ColumnActions {
  onView: (room: Room) => void;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;

}

export function getColumns({ onView, onEdit,onDelete }: ColumnActions): ColumnDef<Room>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <div data-select-cell onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "number",
      header: "N°",
      enableSorting: true, 
    },
    {
      accessorKey: "floor",
      header: "Étage",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "status",
      header: "Statut",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const room = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onView(room)}>
                Voir
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(room)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(room)}>
                Effacer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}