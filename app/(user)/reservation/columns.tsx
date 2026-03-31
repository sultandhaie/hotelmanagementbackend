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
import { Reservation } from "@/app/type/Reservation";

interface ColumnActions {
  onView: (reservation: Reservation) => void;
  onEdit: (reservation: Reservation) => void;
}

export function getColumns({ onView, onEdit }: ColumnActions): ColumnDef<Reservation>[] {
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
      id: "type",
      header: "Type",
      accessorFn: (row) => row.guest?.guestType ?? "—", 
    },
    {
      id: "nom",
      header: "Nom",
      accessorFn: (row) => row.guest?.nom ?? row.guest?.companyName, 
    },
    {
      accessorKey: "reservationPar",
      header: "Reservation",
    },
    {
      accessorKey: "numbers",
      header: "Number",
    },
    {
      accessorKey: "chambre",
      header: "Chambre",
      accessorFn: (row) => row.room?.number ?? "—", 

    },
    {
      accessorKey: "checkIn",
      header: "Check In",
      cell: ({ row }) => row.original.checkIn?.slice(0, 10) ?? "—",  
    },
    {
      accessorKey: "checkOut",
      header: "Check Out",
      cell: ({ row }) => row.original.checkOut?.slice(0, 10) ?? "—", 
    },
    {
      accessorKey: "telephone",
      header: "Telephone",
      accessorFn: (row) => row.guest?.phone ?? "—",  // ✅ nested field

    },
    {
      accessorKey: "montant",
      header: "Montant",
    },
    {
      accessorKey: "status",
      header: "Status",
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