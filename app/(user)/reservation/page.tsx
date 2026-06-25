"use client";

import { inter, playfair } from "@/app/font";
import React, { useEffect, useMemo, useState } from "react";
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
import { reservations, ROOMS } from "@/app/data/data";
import { Room, RoomType } from "@/app/type/Room";
import { Reservation } from "@/app/type/Reservation";
import {
  AddReservation,
  ReservationFormMode,
} from "@/components/addReservation";
import { Field } from "@/components/ui/field";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { type DateRange } from "react-day-picker";
import { Calendar as CalendarIcon, Search, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { getAllReservations } from "@/context/context";

const Page = () => {
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reservationList, setReservationList] = useState<Reservation[]>([]);
  const [room, setRoom] = useState<Room[]>(ROOMS); // add this state

  useEffect(() => {

    const fetchGuests = async () => {
      try {
        setLoading(true);
        const data = await getAllReservations();
        setReservationList(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load Unites");
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, []);

  const formattedRange = useMemo(() => {
    if (!date?.from || !date?.to) return null;

    return {
      from: format(date.from, "yyyy-MM-dd"),
      to: format(date.to, "yyyy-MM-dd"),
    };
  }, [date]);

  const [filterStatus, setFilterStatus] = useState("all");
  const [reservation, setReservation] = useState<Reservation[]>(reservations);
  // apply filter

  const filtered = reservationList.filter((reservation) => {
    // 🔎 Recherche texte
    const matchesQuery = Object.values(reservation).some((val) =>
      String(val).toLowerCase().includes(query.toLowerCase()),
    );

    // 🏨 Trouver la chambre correspondante
    const foundRoom = room.find((r) => r.number === reservation.chambre);

    const matchesType = filterType === "all" || foundRoom?.type === filterType;

    // 📅 Filtre dates
    const matchesDates =
      formattedRange === null ||
      reservation.checkIn === formattedRange?.from ||
      reservation.checkOut === formattedRange?.to;

    // 📌 Filtre statut
    const matchesStatus =
      filterStatus === "all" || reservation.status === filterStatus;

    return matchesQuery && matchesType && matchesDates && matchesStatus;
  });
  
  const [isAddReservationOpen, setIsAddReservationOpen] = useState(false);

  const handleAddResrvation = () => {
    setIsAddReservationOpen(true);
  };

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ReservationFormMode>("add");
  const [selectedReservation, setSelectedReservation] = useState<
    Reservation | undefined
  >();

  function openModal(mode: ReservationFormMode, reservation?: Reservation) {
    setModalMode(mode);
    setSelectedReservation(reservation);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedReservation(undefined);
  }

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

  const columns = getColumns({
    onView: (reservation) => openModal("view", reservation),
    onEdit: (reservation) => openModal("edit", reservation),
  });

  return (
    <div className={`${inter.className} flex flex-col gap-4 p-4`}>
      {/* Header */}
      <div className="flex justify-between bg-white p-4 items-center rounded-lg">
        <div>
          <h1 className={`${playfair.className} text-3xl capitalize`}>
            les reservation
          </h1>
          <p className="text-xl text-gray-400 capitalize">
            gérer vos reservation
          </p>
        </div>
        <button
          className="bg-amber-300 px-4 py-2 capitalize rounded-lg font-medium hover:bg-amber-400 transition-colors"
          onClick={handleAddResrvation}
        >
          + Ajouter Reservation
        </button>
      </div>

      {isAddReservationOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsAddReservationOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <AddReservation onClose={() => setIsAddReservationOpen(false)} />
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
              placeholder="Rechercher une reservation par nom, chambre..."
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
          <Field className="mx-auto w-60">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date-picker-range"
                  className="justify-start px-2.5 font-normal"
                >
                  <CalendarIcon />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Check In - Check Out</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </Field>

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
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Tous les status</SelectItem>
                <SelectItem value="en attente">En Attente</SelectItem>
                <SelectItem value="confirmé">Confirmé</SelectItem>
                <SelectItem value="checkin">Check In</SelectItem>
                <SelectItem value="checkout">Check Out</SelectItem>
                <SelectItem value="annulé">Annulé</SelectItem>
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
            <AddReservation
              mode={modalMode}
              reservation={selectedReservation}
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
