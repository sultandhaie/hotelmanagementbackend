import {
  BanknoteArrowUp,
  CalendarArrowDown,
  CalendarArrowUp,
  DoorClosedLocked,
  DoorOpen,
} from "lucide-react";
import React from "react";
import { inter, playfair } from "../app/font";
import { reservations, ROOMS } from "../app/data/data";

const Statistique = () => {
  const today = new Date().toISOString().split("T")[0]; // "2025-02-23"

  const totalRevenue = reservations
    .filter((res) => res.checkIn === today && res.payer)
    .reduce((sum, res) => sum + res.montant, 0);

  // 📥 Nombre de check-ins aujourd'hui
  const totalCheckIns = reservations.filter(
    (res) => res.checkIn === today,
  ).length;

  // 📤 Nombre de check-outs aujourd'hui
  const totalCheckOuts = reservations.filter(
    (res) => res.checkOut === today,
  ).length;

  const totalAvailable = ROOMS.filter(
    (room) => room.status === "disponible",
  ).length;
  // 🛏️ Chambres occupées (checkIn passé ou aujourd'hui ET checkOut futur ou aujourd'hui)
  const totalOccupied = ROOMS.filter(
    (room) => room.status === "confirmé" || "en attente",
  ).length;

  console.log(totalRevenue);
  return (
    <div className="mt-4 p-4 flex bg-white rounded-lg">
      <div className="flex flex-col justify-between bg-green-200 w-full mr-2 p-4 rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <h1
            className={`${playfair.className} capitalize text-2xl font-semibold text-stone-900`}
          >
            total revenue
          </h1>
          <div className="bg-[#7bf1a8] rounded-lg px-1 py-0.5">
            <BanknoteArrowUp size={37} absoluteStrokeWidth color="#dcfce7" />
          </div>
        </div>
        <div
          className={`${inter.className} text-2xl text-stone-700 font-medium`}
        >
          {totalRevenue} DA
        </div>
      </div>
      <div className="flex flex-col justify-between bg-blue-200 w-full mr-2 p-4 rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <h1
            className={`${playfair.className} capitalize text-2xl font-semibold text-stone-900`}
          >
            check in
          </h1>
          <div className="bg-[#51a2ff] rounded-lg px-1 py-0.5">
            <CalendarArrowDown size={37} absoluteStrokeWidth color="#dbeafe" />
          </div>
        </div>
        <div
          className={`${inter.className} text-2xl text-stone-700 font-medium`}
        >
          {totalCheckIns}
        </div>
      </div>
      <div className="flex flex-col justify-between bg-red-200 w-full mr-2 p-4 rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <h1
            className={`${playfair.className} capitalize text-2xl font-semibold text-stone-900`}
          >
            check out
          </h1>
          <div className="bg-red-300 rounded-lg px-1 py-0.5">
            <CalendarArrowUp size={37} absoluteStrokeWidth color="#ffe4e6" />
          </div>
        </div>
        <div
          className={`${inter.className} text-2xl text-stone-700 font-medium`}
        >
          {totalCheckOuts}
        </div>
      </div>
      <div className="flex flex-col justify-between bg-green-200 w-full mr-2 p-4 rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <h1
            className={`${playfair.className} capitalize text-2xl font-semibold text-stone-900`}
          >
            Chambre disponible
          </h1>
          <div className="bg-green-300 rounded-lg px-1 py-0.5">
            <DoorOpen size={37} absoluteStrokeWidth color="#00a63e" />
          </div>
        </div>
        <div
          className={`${inter.className} text-2xl text-stone-700 font-medium`}
        >
          {totalAvailable}
        </div>
      </div>
      <div className="flex flex-col justify-between bg-amber-200 w-full mr-2 p-4 rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <h1
            className={`${playfair.className} capitalize text-2xl font-semibold text-stone-900`}
          >
            chambre reserve
          </h1>
          <div className="bg-amber-300 rounded-lg px-1 py-0.5">
            <DoorClosedLocked size={37} absoluteStrokeWidth color="#fef3c6" />
          </div>
        </div>
        <div
          className={`${inter.className} text-2xl text-stone-700 font-medium`}
        >
          {totalOccupied}
        </div>
      </div>
    </div>
  );
};

export default Statistique;
