"use client";
import StockHeader from "@/components/StockHeader";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { ProductInterface } from "@/app/type/Product";
import { getColumns } from "./columns";
import { getAllProducts, getAllUnites } from "@/app/context/context";
import { toast } from "sonner";

export type ProductFormMode = "add" | "edit" | "view" | "delete";

const Page = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const filtered = products.filter((product) => {
    const matchesQuery = Object.values(product).some((val) =>
      String(val).toLowerCase().includes(query.toLowerCase()),
    );
    return matchesQuery;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ProductFormMode>("add");
  

  const [selectedProduct, setSelectedProduct] = useState<
    ProductInterface | undefined
  >();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load Products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  function openModal(mode: ProductFormMode, product?: ProductInterface) {
    setModalMode(mode);
    setSelectedProduct(product);
    setModalOpen(true);
  }
  const columns = getColumns({
    onView: (product) => openModal("view", product),
    onEdit: (product) => openModal("edit", product),
    onDelete: (product) => openModal("delete", product),
  });
  return (
    <div>
      <StockHeader />
      {error && toast.warning(error)}
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
              placeholder="Rechercher une produits par nom..."
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
      <DataTable columns={columns} data={filtered} loading={loading} />
    </div>
  );
};

export default Page;
