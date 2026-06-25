import { useState } from "react";
import { playfair } from "../app/font";

const CategoryHeader = () => {
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const handleAddUnite = () => {
    setIsAddCategoryOpen(true);
  };
  return (
    <div className="mb-4">
      <div className="flex justify-between bg-white p-4 items-center rounded-lg">
        <div>
          <h1 className={`${playfair.className} text-3xl capitalize`}>
            les categories
          </h1>
          <p className="text-xl text-gray-400 capitalize">gérer vos categories</p>
        </div>
        <button
          className="bg-amber-300 px-4 py-2 capitalize rounded-lg font-medium hover:bg-amber-400 transition-colors"
          onClick={handleAddUnite}
        >
          + Ajouter categorie
        </button>
      </div>
      {/*
      isAddUniteOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsAddUniteOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <UniteAdd onClose={() => setIsAddUniteOpen(false)} />
          </div>
        </div>
      )
      */
      }
    </div>
  );
};

export default CategoryHeader;
