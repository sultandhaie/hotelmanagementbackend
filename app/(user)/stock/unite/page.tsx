"use client";
import UniteHeader from "@/components/UniteHeader";
import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { UniteInterface } from "@/app/type/Unite";
import { getColumns } from "./columns";
import { getAllUnites } from "@/context/context";
import UniteAdd from "@/components/UniteAdd";
import { toast } from "sonner";

export type UniteFormMode = "add" | "edit" | "view" | "delete";

const Page = () => {
  const [unites, setUnites] = useState<UniteInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnites = async () => {
      try {
        setLoading(true);
        const data = await getAllUnites();
        setUnites(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load Unites");
      } finally {
        setLoading(false);
      }
    };

    fetchUnites();
  }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<UniteFormMode>("add");
  const [selectedUnite, setSelectedUnite] = useState<
    UniteInterface | undefined
  >();

  function openModal(mode: UniteFormMode, unite?: UniteInterface) {
    setModalMode(mode);
    setSelectedUnite(unite);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setSelectedUnite(undefined);
  }
  const columns = getColumns({
    onView: (unite) => openModal("view", unite),
    onEdit: (unite) => openModal("edit", unite),
    onDelete: (unite) => openModal("delete", unite),
  });
  function handleSave(updated: UniteInterface) {
    if (modalMode === "edit") {
      setUnites((prev) =>
        prev.map((r) => (r.name === updated.name ? updated : r)),
      );
    } else {
      setUnites((prev) => [...prev, updated]);
    }
    closeModal();
  }
  return (
    <div>
      <UniteHeader />
      {error && toast.warning(error)}
      <DataTable columns={columns} data={unites} />
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <UniteAdd
              mode={modalMode}
              unite={selectedUnite}
              onClose={closeModal}
              onSave={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
