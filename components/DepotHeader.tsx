import { useState } from "react";
import { playfair } from "../app/font";
import DepotAdd from "./DepotAdd";

const DepotHeader = () => {
  const [isAddDepotOpen, setIsAddDepotOpen] = useState(false);
  const handleAddDepot = () => {
    setIsAddDepotOpen(true);
  };
  return (
    <div className="mb-4">
      <div className="flex justify-between bg-white p-4 items-center rounded-lg">
        <div>
          <h1 className={`${playfair.className} text-3xl capitalize`}>
            les depots
          </h1>
          <p className="text-xl text-gray-400 capitalize">gérer vos depots</p>
        </div>
        <button
          className="bg-amber-300 px-4 py-2 capitalize rounded-lg font-medium hover:bg-amber-400 transition-colors"
          onClick={handleAddDepot}
        >
          + Ajouter depot
        </button>
      </div>
      {
      isAddDepotOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsAddDepotOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <DepotAdd onClose={() => setIsAddDepotOpen(false)} />
          </div>
        </div>
      )
      
      }
    </div>
  );
};

export default DepotHeader;
