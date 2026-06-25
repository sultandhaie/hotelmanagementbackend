"use client";
import React, { useEffect, useState } from "react";
import ProductSearch from "./ProductSearch";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { ProductInterface } from "@/app/type/Product";
import { Entry } from "@/app/(your-page)/page"; // adjust path

interface AddEntriesDetailsProps {
  products: ProductInterface[];
  entries: Entry[];
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  editingIndex: number | null;
  setEditingIndex: (index: number | null) => void;
}

const AddEntriesDetails = ({
  products,
  entries,
  setEntries,
  editingIndex,
  setEditingIndex,
}: AddEntriesDetailsProps) => {
  const [selectedProduct, setSelectedProduct] =
    useState<ProductInterface | null>(null);

  const [quantity, setQuantity] = useState(0);
  const [initPrice, setInitPrice] = useState(0);

  const total = quantity * initPrice;

  const getProductPrice = (product: ProductInterface) => {
    return product.productPrices?.[0]?.prix ?? 0;
  };

  // ✅ Prefill when editing
  useEffect(() => {
    if (editingIndex !== null) {
      const entry = entries[editingIndex];
      if (entry) {
        setSelectedProduct(entry.product);
        setQuantity(entry.quantity);
        setInitPrice(entry.initPrice);
      }
    }
  }, [editingIndex, entries]);

  // ✅ Add OR Update
  const handleSubmit = () => {
    if (!selectedProduct || quantity <= 0 || initPrice <= 0) return;

    const newEntry: Entry = {
      product: selectedProduct,
      quantity,
      initPrice,
      total,
    };

    if (editingIndex !== null) {
      // ✏️ UPDATE
      setEntries((prev) =>
        prev.map((e, i) => (i === editingIndex ? newEntry : e)),
      );
      setEditingIndex(null);
    } else {
      // ➕ ADD
      setEntries((prev) => [...prev, newEntry]);
    }

    // 🔄 Reset
    setSelectedProduct(null);
    setQuantity(0);
    setInitPrice(0);
  };

  return (
    <div className="bg-white p-4 rounded-lg space-y-4 mb-4">
      <ProductSearch
        products={products}
        onSelect={(product) => {
          console.log(product)
          setSelectedProduct(product);
          setInitPrice(getProductPrice(product));
        }}
      />

      {/* Inputs */}
      <div className="flex gap-2">
        <Field>
          <FieldLabel>Quantity</FieldLabel>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </Field>

        <Field>
          <FieldLabel>Prix Unitaire</FieldLabel>
          <Input
            type="number"
            value={initPrice}
            onChange={(e) => setInitPrice(Number(e.target.value))}
          />
        </Field>

        <Field>
          <FieldLabel>Total</FieldLabel>
          <Input type="number" value={total} readOnly />
        </Field>
      </div>

      {/* Button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        {editingIndex !== null ? "Update Article" : "Ajouter Article"}
      </button>
    </div>
  );
};

export default AddEntriesDetails;
