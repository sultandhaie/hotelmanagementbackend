import { playfair } from "@/app/font";
import React from "react";

const AddEntriesHeader = () => {
  return (
    <div className="mb-4">
      <div className="flex justify-between bg-white p-4 items-center rounded-lg">
        <div>
          <h1 className={`${playfair.className} text-3xl capitalize`}>
            Nouveau entrie
          </h1>
          <p className="text-xl text-gray-400 capitalize">
            Saisez votre nouveau entrie
          </p>
        </div>
        <button
          className="bg-amber-300 px-4 py-2 capitalize rounded-lg font-medium hover:bg-amber-400 transition-colors"
          //onClick={handleAddRoom}
        >
          + Ajouter
        </button>
      </div>
    </div>
  );
};

export default AddEntriesHeader;
