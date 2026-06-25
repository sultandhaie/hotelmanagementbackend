"use client";

import { inter, playfair } from "@/app/font";
import { Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "./data-table";
import { getColumns } from "./columns";
import { Room, RoomType } from "@/app/type/Room";
import { AddRoom, RoomFormMode } from "@/components/addRoom";
import { getAllRooms } from "@/context/context";

const Page = () => {
  // Rooms
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  //fliter
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterFloor, setFilterFloor] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  // apply filter
  const filtered = rooms.filter((room) => {
    const matchesQuery = Object.values(room).some((val) =>
      String(val).toLowerCase().includes(query.toLowerCase()),
    );
    const matchesType = filterType === "all" || room.type === filterType;
    const matchesFloor =
      filterFloor === "all" || room.floor === Number(filterFloor);
    const matchesStatus =
      filterStatus === "all" || room.status === filterStatus;

    return matchesQuery && matchesType && matchesFloor && matchesStatus;
  });

  //loading floors
  const getFloors = (rooms: Room[]): number[] => {
    return [...new Set(rooms.map((room) => room.floor))].sort((a, b) => a - b);
  };
  const floors = getFloors(rooms);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  // open add room
  const handleAddRoom = () => {
    setIsAddRoomOpen(true);
  };
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<RoomFormMode>("add");
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();

  function openModal(mode: RoomFormMode, room?: Room) {
    setModalMode(mode);
    setSelectedRoom(room);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedRoom(undefined);
  }

  function handleSave(updated: Room) {
    if (modalMode === "edit") {
      setRooms((prev) =>
        prev.map((r) => (r.number === updated.number ? updated : r)),
      );
    } else {
      setRooms((prev) => [...prev, updated]);
    }
    closeModal();
  }

  const columns = getColumns({
    onView: (room) => openModal("view", room),
    onEdit: (room) => openModal("edit", room),
    onDelete : (room) => openModal("delete", room),
  });

  return (
    <div className={`${inter.className} flex flex-col gap-4 p-4`}>
      {/* Header */}
      <div className="flex justify-between bg-white p-4 items-center rounded-lg">
        <div>
          <h1 className={`${playfair.className} text-3xl capitalize`}>
            les chambres
          </h1>
          <p className="text-xl text-gray-400 capitalize">gérer vos chambres</p>
        </div>
        <button
          className="bg-amber-300 px-4 py-2 capitalize rounded-lg font-medium hover:bg-amber-400 transition-colors"
          onClick={handleAddRoom}
        >
          + Ajouter Chambre
        </button>
      </div>
      {isAddRoomOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsAddRoomOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <AddRoom onClose={() => setIsAddRoomOpen(false)} />
          </div>
        </div>
      )}
      <div className="bg-white flex items-center px-4 rounded-lg">
        {/* Search Bar */}
        <div className=" p-4 rounded-lg w-3/4">
          <div
            className={cn(
              "flex items-center gap-2 px-3",
              "h-10 w-full rounded-md border border-input bg-transparent shadow-sm",
              "transition-[color,box-shadow]",
              "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
            )}
          >
            <Search size={16} className="text-muted-foreground shrink-0" />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une chambre par numéro, type..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
            />

            {query && (
              <button onClick={() => setQuery("")}>
                <X
                  size={16}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                />
              </button>
            )}
          </div>
        </div>
        {/* Filter */}
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Toutes les chambres</SelectItem>
                {RoomType.map((type) => (
                  <SelectItem value={type} key={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={filterFloor} onValueChange={setFilterFloor}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par étage" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Toutes les chambres</SelectItem>
                {floors.map((floor) => (
                  <SelectItem value={floor.toString()} key={floor}>
                    {floor}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Toutes les chambres</SelectItem>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="occupée">Occupée</SelectItem>
                <SelectItem value="réservée">Reservée</SelectItem>
                <SelectItem value="nettoyage">Nettoyage</SelectItem>
                <SelectItem value="hors service">Hors service</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DataTable columns={columns} data={filtered} />
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <AddRoom
              mode={modalMode}
              room={selectedRoom}
              onClose={closeModal}
              onSave={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
