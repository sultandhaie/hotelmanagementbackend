import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Guest } from "@/app/type/Client";

interface ColumnActions {
  onView: (guest: Guest) => void;
  onEdit: (guest: Guest) => void;
}

export function getColumns({
  onView,
  onEdit,
}: ColumnActions): ColumnDef<Guest>[] {
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
      accessorKey:"id",
      header: "Id",
    },
    {
      accessorFn: (row) => {
        if (row.guestType === "COMPANY") {
          return row.companyName;
        }
        return row.nom;
      },

      header: "Nom",
    },
    {
      accessorKey: "guestType",
      header: "Type",
    },
    {
      accessorKey: "phone",
      header: "Telephone",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "idType",
      header: "ID Type",
    },
    {
      accessorKey: "idNumber",
      header: "ID Number",
    },
    {
      accessorKey: "nationality",
      header: "Nationality",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const reservation = row.original;

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
              <DropdownMenuItem onClick={() => onView(reservation)}>
                Voir
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(reservation)}>
                Modifier
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
