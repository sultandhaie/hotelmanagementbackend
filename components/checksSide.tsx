import {
  CalendarArrowDown,
  CalendarArrowUp,
} from "lucide-react";
import React from "react";
import { inter, playfair } from "../app/font";
import CheckInOut from "./checkInOut";
import { reservations } from "../app/data/data";

const ChecksSide = () => {
  const today = new Date().toISOString().split("T")[0]; // "2025-02-23"

  const checkIns = reservations.filter((res) => res.checkIn === today);
  const checkOuts = reservations.filter((res) => res.checkOut === today);

  return (
    <div className={`w-full bg-white p-4 ${inter.className}`}>
      {/* CHECK-INS */}
      <div className="mb-6">
        <div className="flex gap-4 text-2xl items-center mb-4">
          <div className="bg-blue-500 p-1 rounded-lg">
            <CalendarArrowDown size={37} absoluteStrokeWidth color="#eff6ff" />
          </div>
          <h1
            className={`${playfair.className} text-2xl font-semibold text-stone-900 capitalize`}
          >
            check-ins à venir{" "}
            <span className="text-sm text-blue-500 font-normal">
              ({checkIns.length})
            </span>
          </h1>
        </div>
        <div className="flex flex-col gap-2">
          {checkIns.length > 0 ? (
            checkIns.map((res) => <CheckInOut key={res.id} res={res} />)
          ) : (
            <p className="text-stone-400 text-sm italic">
              Aucun check-in prévu aujourdhui.
            </p>
          )}
        </div>
      </div>

      {/* CHECK-OUTS */}
      <div>
        <div className="flex gap-4 text-2xl items-center mb-4">
          <div className="bg-orange-500 p-1 rounded-lg">
            <CalendarArrowUp size={37} absoluteStrokeWidth color="#fff7ed" />
          </div>
          <h1
            className={`${playfair.className} text-2xl font-semibold text-stone-900 capitalize`}
          >
            check-outs à venir{" "}
            <span className="text-sm text-orange-500 font-normal">
              ({checkOuts.length})
            </span>
          </h1>
        </div>
        <div className="flex flex-col gap-2">
          {checkOuts.length > 0 ? (
            checkOuts.map((res) => <CheckInOut key={res.id} res={res} />)
          ) : (
            <p className="text-stone-400 text-sm italic">
              Aucun check-out prévu aujourdhui.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChecksSide;