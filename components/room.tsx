import { inter } from "../app/font";
import { Room, STATUS_CONFIG } from "../app/type/Room";

const StatRoom = ({ room }: { room: Room }) => {
  const { bg, color, dot, label } = STATUS_CONFIG[room.status];

  return (
    <div
      className={`py-4 px-6 border-2 rounded-xl ${inter.className} flex flex-col justify-center items-center gap-2 min-w-[90px] cursor-pointer hover:scale-105 transition-transform ${bg} ${color}`}
      style={{ borderColor: dot.replace("bg-", "") }}
    >
      {/* Numéro de chambre */}
      <h2 className="text-xl font-bold">{room.number}</h2>

      {/* Type */}
      <div className="py-1 px-3 bg-white border rounded-lg text-xs font-medium text-gray-600">
        {room.type}
      </div>

      {/* Status badge */}
      <div className={`inline-flex items-center gap-1.5 text-xs font-semibold`}>
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        {label}
      </div>
    </div>
  );
};

export default StatRoom;