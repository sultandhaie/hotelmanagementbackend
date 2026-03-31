"use client";
import { DataTable } from "./data-table";
import { getColumns } from "./columns";
import { useEffect, useState } from "react";
import { DepotInterface } from "@/app/type/Depot";
import DepotHeader from "@/components/DepotHeader";
import { getAllDepot } from "@/app/context/context";
import DepotAdd from "@/components/DepotAdd";

export type DepotFormMode = "add" | "edit" | "view" | "delete";

const Page = () => {
  const [depot, setDepot] = useState<DepotInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDepots = async () => {
      try {
        setLoading(true);
        const data = await getAllDepot();
        setDepot(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load Unites");
      } finally {
        setLoading(false);
      }
    };

    fetchDepots();
  }, []);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<DepotFormMode>("add");
  const [selectedDepot, setSelectedDepot] = useState<
    DepotInterface | undefined
  >();

  function openModal(mode: DepotFormMode, unite?: DepotInterface) {
    setModalMode(mode);
    setSelectedDepot(unite);
    setModalOpen(true);
  }
  function closeModal() {
    setModalOpen(false);
    setSelectedDepot(undefined);
  }
  function handleSave(updated: DepotInterface) {
      if (modalMode === "edit") {
        setDepot((prev) =>
          prev.map((r) => (r.name === updated.name ? updated : r)),
        );
      } else {
        setDepot((prev) => [...prev, updated]);
      }
      closeModal();
    }
  const columns = getColumns({
    onView: (depot) => openModal("view", depot),
    onEdit: (depot) => openModal("edit", depot),
    onDelete: (depot) => openModal("delete", depot),
  });
  return (
    <div>
      <DepotHeader />
      <DataTable columns={columns} data={depot} />
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <DepotAdd
              mode={modalMode}
              depot={selectedDepot}
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
