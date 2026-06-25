"use client"
import { DoorOpen } from "lucide-react";
import React, { useEffect, useState } from "react";
import { playfair } from "../app/font";
import StatRoom from "./room";
import { Room, RoomStatus, STATUS_CONFIG } from "../app/type/Room";
import { getAllRooms } from "../context/context";

// ─── Data ─────────────────────────────────────────────────────────────────────

function getUniqueFloors(rooms: Room[]): number[] {
  return [...new Set(rooms.map((r) => r.floor))].sort((a, b) => a - b);
}
// ─── Legend ───────────────────────────────────────────────────────────────────

function StatusLegend() {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {(
        Object.entries(STATUS_CONFIG) as [
          RoomStatus,
          (typeof STATUS_CONFIG)[RoomStatus],
        ][]
      ).map(([, { label, color, bg, dot }]) => (
        <div
          key={label}
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${bg} ${color}`}
        >
          <span className={`w-2 h-2 rounded-full ${dot}`} />
          {label}
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const RoomDashboard = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const floors = getUniqueFloors(rooms);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = await getAllRooms();
        setRooms(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load rooms");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);
  return (
    <div className="bg-white p-4 rounded-lg max-h-full w-3/4">
      {/* Header */}
      <div className="flex items-center mb-4">
        <div className="bg-amber-300 mr-4 p-1 rounded-lg">
          <DoorOpen size={37} absoluteStrokeWidth color="#fef3c6" />
        </div>
        <h1
          className={`${playfair.className} text-2xl font-semibold text-stone-900 capitalize`}
        >
          Status des chambres
        </h1>
      </div>

      {/* Légende */}
      <StatusLegend />

      {/* Étages */}
      <div>
        {[...floors]
          .sort((a, b) => b - a)
          .map((etage) => (
            <div key={etage}>
              <h2
                className={`${playfair.className} text-xl font-medium text-stone-900 capitalize my-2`}
              >
                Étage {etage}
              </h2>
              <div className="flex gap-2">
                {rooms.filter((room) => room.floor === etage).map((room) => (
                  <StatRoom key={room.number} room={room} />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RoomDashboard;
