import { playfair } from "@/app/font";
import Link from "next/link";

const EntriesHeader = () => {
  return (
    <div className="mb-4">
      <div className="flex justify-between bg-white p-4 items-center rounded-lg">
        <div>
          <h1 className={`${playfair.className} text-3xl capitalize`}>
            les entries
          </h1>
          <p className="text-xl text-gray-400 capitalize">gérer vos entries</p>
        </div>
        <Link href='entries/add'>
          <button className="bg-amber-300 px-4 py-2 capitalize rounded-lg font-medium hover:bg-amber-400 transition-colors">
            + Ajouter entrie
          </button>
        </Link>
      </div>

    </div>
  );
};

export default EntriesHeader;
