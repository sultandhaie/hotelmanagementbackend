"use client";
import { DataTable } from "./data-table";
import { getColumns } from "./columns";
import { CategoryInterface } from "@/app/type/Categorie";
import CategoryHeader from "@/components/CategoryHeader";
import { useEffect, useState } from "react";
import { getAllCategories } from "@/context/context";

export type CategoryFormMode = "add" | "edit" | "view" | "delete";

const Page = () => {
  const [categorie, setCategorie] = useState<CategoryInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getAllCategories();
        setCategorie(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load Unites");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<CategoryFormMode>("add");
  const [selectedCategorie, setSelectedCategorie] = useState<
    CategoryInterface | undefined
  >();

  function openModal(mode: CategoryFormMode, category?: CategoryInterface) {
    setModalMode(mode);
    setSelectedCategorie(category);
    setModalOpen(true);
  }
  const columns = getColumns({
    onView: (category) => openModal("view", category),
    onEdit: (category) => openModal("edit", category),
    onDelete: (category) => openModal("delete", category),
  });
  return (
    <div>
      <CategoryHeader />
      <DataTable columns={columns} data={categorie} />
    </div>
  );
};

export default Page;
