const API_URL = "http://localhost:5000/api"; // backend local

export const getServices = async () => {
  const res = await fetch(`${API_URL}/services`);
  if (!res.ok) throw new Error("Impossible de récupérer les services");
  return res.json();
};

export const createBooking = async (data: any) => {
  const res = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Impossible de créer la réservation");
  return res.json();
};
