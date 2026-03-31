import { Banknote, BanknoteX, Check, DoorClosed, MapPin, UserRound } from 'lucide-react'
import { Reservation } from '../app/type/Reservation'

const CheckInOut = ({res}:{res:Reservation}) => {
  return (
    <div key={res.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg mb-2">
      <div>
        <h1 className="text-xl mb-1">{res.nom}</h1>
        <div className="flex gap-4 items-center mb-1">
          <div className="inline-flex gap-1 items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-600 inset-ring inset-ring-gray-500/10">
            <MapPin size={15} />
            <h2 className="capitalize">{res.reservationPar}</h2>
          </div>
          <div>
            {res.payer ? (
              <div className="inline-flex gap-1 capitalize items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-600 inset-ring inset-ring-gray-500/10">
                <Banknote size={15} />
                <h2>Payer</h2>
              </div>
            ) : (
              <div className="inline-flex gap-1 capitalize items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-600 inset-ring inset-ring-gray-500/10">
                <BanknoteX size={15} />
                <h2>Non Payer</h2>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-4 capitalize text-sm text-gray-500 items-center mb-1">
          <div className="flex items-center gap-1">
            <DoorClosed size={15} />
            <h3>chambre {res.chambre}</h3>
          </div>
          <div className="flex items-center gap-1">
            <UserRound size={15} />
            <h3>
              {res.numbers} {res.numbers === 1 ? "personne" : "personnes"}
            </h3>
          </div>
        </div>
      </div>
      <div className="p-1 bg-green-50 rounded-lg border-2 border-green-500">
        <Check size={30} color="#00c950" />
      </div>
    </div>
  )

}

export default CheckInOut
