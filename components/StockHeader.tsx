import { useState } from "react";
import { playfair } from "../app/font";
import { AddProduct } from "./product/AddProduct";

const StockHeader = () => {
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const handleAddProduct = () => {
    setIsAddProductOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between bg-white p-4 items-center rounded-lg mb-4 ">
        <div>
          <h1 className={`${playfair.className} text-3xl capitalize`}>
            les produits
          </h1>
          <p className="text-xl text-gray-400 capitalize">gérer vos produits</p>
        </div>
        <button
          className="bg-amber-300 px-4 py-2 capitalize rounded-lg font-medium hover:bg-amber-400 transition-colors"
          onClick={handleAddProduct}
        >
          + Ajouter produit
        </button>
      </div>
      {isAddProductOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsAddProductOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <AddProduct onClose={() => setIsAddProductOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StockHeader;
