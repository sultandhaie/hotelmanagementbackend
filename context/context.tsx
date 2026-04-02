import { Guest } from "@/app/type/Client";
import { GuestInterface } from "@/app/type/Guest";

export async function createRoom(data: {
  number: number;
  floor: number;
  type: "SINGLE" | "DOUBLE" | "SUITEJR" | "SUITESR";
  price: number;
}) {
  const API_URL = "http://localhost:3001";
  const response = await fetch(`${API_URL}/room/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to post room");
  }

  return response;
}

export async function getAllRooms() {
  const API_URL = "http://localhost:3001";
  const response = await fetch(`${API_URL}/room/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get rooms");
  }

  const data = await response.json();
  return data;
}

export async function updateRoom(number:number , data: {
  floor?: number;
  type?: "SINGLE" | "DOUBLE" | "SUITEJR" | "SUITESR";
  price?: number;
}) {
  const API_URL = `http://localhost:3001`;
  const response = await fetch(`${API_URL}/room/update/${number}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to Update room");
  }

  return response;
}

export async function deleteRoom(number:number) {
  const API_URL = `http://localhost:3001`;
  const response = await fetch(`${API_URL}/room/delete/${number}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to Delete room");
  }

  return response;
}

// Unite

export async function createUnite(data: {
  name: string;
}) {
  const API_URL = "http://localhost:3001";
  const response = await fetch(`${API_URL}/unite/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to post Unite");
  }

  return response;
}

export async function getAllUnites() {
  const API_URL = "http://localhost:3001";
  const response = await fetch(`${API_URL}/unite/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get Unites");
  }

  const data = await response.json();
  console.log(data)
  return data;
}

// Depot
export async function getAllDepot() {
  const API_URL = "http://localhost:3001";
  const response = await fetch(`${API_URL}/depot/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get Depot");
  }

  const data = await response.json();
  return data;
}

export async function createDepot(data: {
  name: string;
}) {
  const API_URL = "http://localhost:3001";
  const response = await fetch(`${API_URL}/depot/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to post depot");
  }

  return response;
}

// Categories
export async function getAllCategories() {
  const API_URL = "http://localhost:3001";
  const response = await fetch(`${API_URL}/categorie/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get categorie");
  }

  const data = await response.json();
  return data;
}

export async function createCategorie(data: {
  name: string;
}) {
  const API_URL = "http://localhost:3001";
  const response = await fetch(`${API_URL}/categorie/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to post categorie");
  }

  return response;
}

// Fournisseurs
export async function getAllSuppliers() {
  const API_URL = "http://localhost:3001";
  const response = await fetch(`${API_URL}/fournisseur/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get fournisseur");
  }

  const data = await response.json();
  return data;
}

// Products
export async function getAllProducts() {
  const API_URL = "http://localhost:3001";
  const response = await fetch(`${API_URL}/product/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get products");
  }

  const data = await response.json();
  console.log(data)
  return data;
}

export async function addProduct(data: {
  name: string,
  categoryId: number,
  uniteId: number,
}) {
  const API_URL = "http://localhost:3001";
  const response = await fetch(`${API_URL}/product/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to add products");
  }

  console.log(response)
  return response;
}

// Clients
export async function getAllGuests() {
  const API_URL = "http://localhost:3001";
  const response = await fetch(`${API_URL}/guest/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get Guests");
  }

  const data = await response.json();
  console.log(data)
  return data;
}


export async function createGuest(data: {
  data : Guest
}) {
  const API_URL = "http://localhost:3001";
  const response = await fetch(`${API_URL}/guest/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to add Guest");
  }

  console.log(response)
  return response;
}

// Reservation
export async function getAllReservations() {
  const API_URL = "http://localhost:3001";
  const response = await fetch(`${API_URL}/reservation/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get Reservations");
  }

  const data = await response.json();
  console.log(data)
  return data;
}