import { ColumnDef } from "@tanstack/react-table";
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
import { FournisseurInterface } from "@/app/type/Fournisseur";

interface ColumnActions {
  onView: (fournisseur: FournisseurInterface) => void;
  onEdit: (fournisseur: FournisseurInterface) => void;
  onDelete: (fournisseur: FournisseurInterface) => void;

}

export function getColumns({ onView, onEdit,onDelete }: ColumnActions): ColumnDef<FournisseurInterface>[] {
  return [
    /*
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
    */
    {
      accessorKey: "id",
      header: "N°",
      enableSorting: true, 
    },
    {
      accessorKey: "name",
      header: "Nom",
    },
    {
      accessorKey: "adress",
      header: "Address",
    },
    {
      accessorKey: "ville",
      header: "Ville",
    },
    {
      accessorKey: "telephone",
      header: "Telephone",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const fournisseur = row.original;

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
              <DropdownMenuItem onClick={() => onView(fournisseur)}>
                Voir
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(fournisseur)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(fournisseur)}>
                Effacer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}