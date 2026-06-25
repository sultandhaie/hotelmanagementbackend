import { useState } from "react";
import { playfair } from "../app/font";
import UniteAdd from "./UniteAdd";

const UniteHeader = () => {
  const [isAddUniteOpen, setIsAddUniteOpen] = useState(false);
  const handleAddUnite = () => {
    setIsAddUniteOpen(true);
  };
  return (
    <div className="mb-4">
      <div className="flex justify-between bg-white p-4 items-center rounded-lg">
        <div>
          <h1 className={`${playfair.className} text-3xl capitalize`}>
            les unités
          </h1>
          <p className="text-xl text-gray-400 capitalize">gérer vos unités</p>
        </div>
        <button
          className="bg-amber-300 px-4 py-2 capitalize rounded-lg font-medium hover:bg-amber-400 transition-colors"
          onClick={handleAddUnite}
        >
          + Ajouter unité
        </button>
      </div>
      {isAddUniteOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsAddUniteOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <UniteAdd onClose={() => setIsAddUniteOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UniteHeader;
