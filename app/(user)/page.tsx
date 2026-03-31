"use client";
import Header from "../../components/header";
import Statistique from "../../components/statistique";
import RoomDashboard from "../../components/roomDashboard";
import ChecksSide from "../../components/checksSide";
import { useEffect, useState } from "react";
import { userInterface } from "../type/User";

const Page = () => {
  const [user,SetUser] = useState<userInterface>({} as userInterface)
  useEffect(() => {
  const fetchUser = async () => {
    const response = await fetch("http://localhost:3001/user/get", {
      credentials: "include",
    });
    const content = await response.json();
    SetUser(content)
  };

  fetchUser();
}, []);
  return (
    <div
    //className="flex flex-col h-dvh"
    >
      <Header userName={user.nom} userRole={user.role}/>
      <Statistique />
      <div className="mt-4 flex justify-between gap-4">
        <RoomDashboard />
        <ChecksSide />
      </div>
    </div>
  );
};

export default Page;
