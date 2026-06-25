export interface Reservation {
  id: number | string;
  guest :{
    guestType: string,
    nom: string,
    companyName? : string,
    phone? : string,
  }
  room:{
    number: string,
  }
  payer: boolean;
  reservationPar: string;
  numbers: number;
  chambre: number;
  createdTime: string;
  checkIn: string;
  checkOut: string;
  telephone: string;
  email: string;
  montant: number;
  status: ResrvationStatus;
  notes: string;
}

export const RoomType = ["Single" , "Double" , "Suite"]
export type ResrvationStatus = "EN_ATTENTE" | "confirmé" | "CHECKIN" |  "checkout" | "annulé";
export const STATUS_CONFIG: Record<ResrvationStatus, { label: string; color: string; bg: string; dot: string }> = {
  checkout:      { label: "Check-Out",    color: "text-green-700",  bg: "bg-green-50",   dot: "bg-green-500"  },
  CHECKIN:         { label: "Check-In",        color: "text-blue-700",   bg: "bg-blue-50",    dot: "bg-blue-500"   },
  "EN_ATTENTE":        { label: "En Attente",       color: "text-amber-700",  bg: "bg-amber-50",   dot: "bg-amber-500"  },
  "confirmé":       { label: "Confirmée",      color: "text-purple-700", bg: "bg-purple-50",  dot: "bg-purple-500" },
  "annulé":  { label: "Annulé",   color: "text-red-700",    bg: "bg-red-50",     dot: "bg-red-500"    },
};