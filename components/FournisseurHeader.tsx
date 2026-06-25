
import { playfair } from "../app/font";


const FournisseurHeader = () => {

  return (
    <div>
      <div className="flex justify-between bg-white p-4 items-center rounded-lg mb-4">
        <div>
          <h1 className={`${playfair.className} text-3xl capitalize`}>
            les fournisseurs
          </h1>
          <p className="text-xl text-gray-400 capitalize">gérer vos fournisseurs</p>
        </div>
        <button
          className="bg-amber-300 px-4 py-2 capitalize rounded-lg font-medium hover:bg-amber-400 transition-colors"
          //onClick={handleAddRoom}
        >
          + Ajouter fournisseur
        </button>
      </div>
      {/*
              isAddRoomOpen && (
                <div
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                  onClick={() => setIsAddRoomOpen(false)}
                >
                  <div onClick={(e) => e.stopPropagation()}>
                    <AddRoom onClose={() => setIsAddRoomOpen(false)} />
                  </div>
                </div>
              )
              */}
      
    </div>
  );
};

export default FournisseurHeader;
