"use client";

import AddEntriesDetails from "@/components/entries/AddEntriesDetails";
import AddEntriesHeader from "@/components/entries/AddEntriesHeader";
import AddEntriesInformation from "@/components/entries/AddEntriesInformation";
import React, { useEffect, useState } from "react";
import { DataTable } from "../data-table";
import { getColumns } from "./columns";
import { ProductInterface } from "@/app/type/Product";
import { getAllProducts } from "@/context/context";

export interface Entry {
  product: ProductInterface;
  quantity: number;
  initPrice: number;
  total: number;
}

const Page = () => {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // ✅ Columns with edit/delete
  const columns = getColumns({
    onEdit: (index) => setEditingIndex(index),
    onDelete: (index) =>
      setEntries((prev) => prev.filter((_, i) => i !== index)),
  });

  return (
    <div>
      <AddEntriesHeader />
      <AddEntriesInformation />

      <AddEntriesDetails
        products={products}
        entries={entries}
        setEntries={setEntries}
        editingIndex={editingIndex}
        setEditingIndex={setEditingIndex}
      />

      {loading ? (
        <p className="p-4">Loading...</p>
      ) : error ? (
        <p className="p-4 text-red-500">{error}</p>
      ) : (
        <DataTable columns={columns} data={entries} />
      )}
    </div>
  );
};

export default Page;