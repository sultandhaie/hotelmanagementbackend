export interface Room {
  floor: number;
  number: number;
  type: string;
  price: number;
  status: string;
}
export type RoomStatus = "DISPONIBLE" | "OCCUPE" | "RESERVE" | "NETTOYAGE" | "HORSSERVICE";
export const RoomType = ['SINGLE' , 'DOUBLE' , 'SUITEJR' , 'SUITESR']

export const STATUS_CONFIG: Record<RoomStatus, { label: string; color: string; bg: string; dot: string }> = {
  DISPONIBLE:      { label: "Disponible",    color: "text-green-700",  bg: "bg-green-50",   dot: "bg-green-500"  },
  OCCUPE:         { label: "Occupée",        color: "text-blue-700",   bg: "bg-blue-50",    dot: "bg-blue-500"   },
  RESERVE:        { label: "Réservée",       color: "text-amber-700",  bg: "bg-amber-50",   dot: "bg-amber-500"  },
  NETTOYAGE:       { label: "Nettoyage",      color: "text-purple-700", bg: "bg-purple-50",  dot: "bg-purple-500" },
  HORSSERVICE:  { label: "Hors service",   color: "text-red-700",    bg: "bg-red-50",     dot: "bg-red-500"    },
};