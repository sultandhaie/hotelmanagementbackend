import { inter, playfair } from "../app/font"

const Header = ({userName, userRole} : {userName?: string, userRole?: string}) => {
    return (
        <div className={`${inter.className} flex justify-between bg-[#fff] p-4 items-center rounded-lg`}>
            <div>
                <h1 className={`${playfair.className} text-3xl`}>
                    Bonjour, {userName}
                </h1>
                <p className="text-xl text-gray-400 capitalize">
                    {userRole}
                </p>
            </div>

            <div className="bg-amber-300 px-4 py-2 capitalize rounded-lg font-medium">
                + Ajouter resérvation
            </div>
        </div>
  )
}

export default Header
