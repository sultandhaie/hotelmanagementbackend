"use client";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { getColumns } from "./columns";
import { FournisseurInterface } from "@/app/type/Fournisseur";
import FournisseurHeader from "@/components/FournisseurHeader";
import { getAllSuppliers } from "@/context/context";

export type FournisseurFormMode = "add" | "edit" | "view" | "delete";

const Page = () => {
  const [query, setQuery] = useState("");
  const [fournisseurs, setFournisseurs] = useState<FournisseurInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuplliers = async () => {
      try {
        setLoading(true);
        const data = await getAllSuppliers();
        setFournisseurs(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load Unites");
      } finally {
        setLoading(false);
      }
    };

    fetchSuplliers();
  }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<FournisseurFormMode>("add");

  const [selectedFournisseurs, setSelectedFournisseurs] = useState<
    FournisseurInterface | undefined
  >();

  function openModal(
    mode: FournisseurFormMode,
    fournisseur?: FournisseurInterface,
  ) {
    setModalMode(mode);
    setSelectedFournisseurs(fournisseur);
    setModalOpen(true);
  }
  const columns = getColumns({
    onView: (fournisseur) => openModal("view", fournisseur),
    onEdit: (fournisseur) => openModal("edit", fournisseur),
    onDelete: (fournisseur) => openModal("delete", fournisseur),
  });
  return (
    <div>
      <FournisseurHeader />
      <div className="bg-white flex items-center px-4 rounded-lg mb-4">
        {/* Search Bar */}
        <div className=" p-4 rounded-lg w-3/4">
          <div
            className={cn(
              "flex items-center gap-2 px-3",
              "h-10 w-full rounded-md border border-input bg-transparent shadow-sm",
              "transition-[color,box-shadow]",
              "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
            )}
          >
            <Search size={16} className="text-muted-foreground shrink-0" />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un fournisseur par nom..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
            />

            {query && (
              <button onClick={() => setQuery("")}>
                <X
                  size={16}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                />
              </button>
            )}
          </div>
        </div>
      </div>
      <DataTable columns={columns} data={fournisseurs} />
    </div>
  );
};

export default Page;
