"use client";

import { inter, playfair } from "@/app/font";
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
import {
  ReservationFormMode,
} from "@/components/addReservation";
import { Calendar as  Search, X } from "lucide-react";
import { getAllGuests } from "@/context/context";
import { Guest } from "@/app/type/Client";
import { AddGuest } from "@/components/addClient";

export type GuestFormMode = "add" | "edit" | "view";


const Page = () => {
  const [query, setQuery] = useState("");
  const [clients, setClients] = React.useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
      const fetchGuests = async () => {
        try {
          setLoading(true);
          const data = await getAllGuests();
          setClients(data);
        } catch (err) {
          console.error(err);
          setError("Failed to load Unites");
        } finally {
          setLoading(false);
        }
      };
  
      fetchGuests();
    }, []);

  const [filterType, setFilterType] = useState("all");
  //const [reservation, setReservation] = useState<Reservation[]>(reservations);
  // apply filter

  const filtered = clients.filter((clients) => {
    // 🔎 Recherche texte
    const matchesQuery = Object.values(clients).some((val) =>
      String(val).toLowerCase().includes(query.toLowerCase()),
    );

    // 🏨 Trouver la chambre correspondante
    //const foundRoom = room.find((r) => r.number === reservation.chambre);

    const matchesType = filterType === "all" || clients?.guestType === filterType;

    // 📅 Filtre dates
    /*const matchesDates =
      formattedRange === null ||
      reservation.checkIn === formattedRange?.from ||
      reservation.checkOut === formattedRange?.to;
    */
    // 📌 Filtre statut
   /* const matchesStatus =
      filterStatus === "all" || reservation.status === filterStatus;
    */
    return matchesQuery && matchesType //&& matchesDates && matchesStatus;
  });
  /*
  //loading floors
  const getFloors = (rooms: Room[]): number[] => {
    return [...new Set(rooms.map((room) => room.etage))].sort((a, b) => a - b);
  };
  // const floors = getFloors(rooms);/**/
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  // open add room

  const handleAddGuest = () => {
    setIsAddGuestOpen(true);
  };

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ReservationFormMode>("add");
  const [selectedGuest, setSelectedGuest] = useState<
    Guest | undefined
  >();

  function openModal(mode: GuestFormMode, guest?: Guest) {
    setModalMode(mode);
    setSelectedGuest(guest);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedGuest(undefined);
  }
  /*
  function handleSave(updated: Reservation) {
    if (modalMode === "edit") {
      setReservation((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r)),
      );
    } else {
      setReservation((prev) => [...prev, updated]);
    }
    closeModal();
  }
*/
  const columns = getColumns({
    onView: (guest) => openModal("view", guest),
    onEdit: (guest) => openModal("edit", guest),
  });


  const guestType = [
    "INDIVIDUAL",
    "COMPANY"
  ]
  return (
    <div className={`${inter.className} flex flex-col gap-4 p-4`}>
      {/* Header */}
      <div className="flex justify-between bg-white p-4 items-center rounded-lg">
        <div>
          <h1 className={`${playfair.className} text-3xl capitalize`}>
            les clients
          </h1>
          <p className="text-xl text-gray-400 capitalize">
            gérer vos clients
          </p>
        </div>
        <button
          className="bg-amber-300 px-4 py-2 capitalize rounded-lg font-medium hover:bg-amber-400 transition-colors"
          onClick={handleAddGuest}
        >
          + Ajouter Client
        </button>
      </div>

      {isAddGuestOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsAddGuestOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <AddGuest onClose={() => setIsAddGuestOpen(false)} />
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
              placeholder="Rechercher un client par nom, numéro..."
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
                <SelectItem value="all">Toutes les clients</SelectItem>
                {guestType.map((type) => (
                  <SelectItem value={type} key={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/*
          <Select value={filterFloor} onValueChange={setFilterFloor}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par étage" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Toutes les chambres</SelectItem>
                {
                floors.map((etage) => (
                  <SelectItem value={etage.toString()} key={etage}>
                    {etage}
                  </SelectItem>
          ))}
              </SelectGroup>
            </SelectContent>
          </Select>
  
          */}
        </div>
      </div>
      <DataTable columns={columns} data={filtered} />
      {/*modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <AddReservation
              mode={modalMode}
              reservation={selectedReservation}
              onClose={closeModal}
              onSave={handleSave}
            />
          </div>
        </div>
      )
      */  
      }
    </div>
  );
};

export default Page;
