"use client";
import { DataTable } from "./data-table";
import { getColumns } from "./columns";
import { CategoryInterface } from "@/app/type/Categorie";
import { useState } from "react";
import ExistsHeader from "@/components/ExitsHeader";

export type CessionFormMode = "add" | "edit" | "view" | "delete";

const Page = () => {
  const [cession, setCession] = useState<CategoryInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  /*
  useEffect(() => {
    const fetchUnites = async () => {
      try {
        setLoading(true);
        const data = await getAllUnites();
        setCategorie(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load Unites");
      } finally {
        setLoading(false);
      }
    };

    fetchUnites();
  }, []);
  */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<CessionFormMode>("add");
  const [selectedUnite, setSelectedUnite] = useState<
    CategoryInterface | undefined
  >();

  function openModal(mode: CessionFormMode, unite?: CategoryInterface) {
    setModalMode(mode);
    setSelectedUnite(unite);
    setModalOpen(true);
  }
  const columns = getColumns({
    onView: (cession) => openModal("view", cession),
    onEdit: (cession) => openModal("edit", cession),
    onDelete: (cession) => openModal("delete", cession),
  });
  return (
    <div>
      <ExistsHeader />
      <DataTable columns={columns} data={cession} />
    </div>
  );
};

export default Page;
