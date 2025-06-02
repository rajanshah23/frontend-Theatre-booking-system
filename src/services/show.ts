import api from "./api";
import { Show, Booking } from "../types";

export const getShows = async (): Promise<Show[]> => {
  const response = await api.get("/shows");
  return response.data.data;
};

export const getShow = async (id: string): Promise<Show> => {
  const response = await api.get(`/shows/${id}`);
  return response.data.data;
};

export const bookTicket = async (
  booking: Booking
): Promise<{ booking: any; paymentUrl?: string }> => {
  try {
    const response = await api.post(`/shows/${booking.showId}/bookings`, {
      seatIds: booking.seatIds,
      totalAmount: booking.totalAmount,
      paymentMethod: booking.paymentMethod,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message)
      throw new Error(error.response.data.message);
    throw new Error("Booking failed");
  }
};

export const getSeatsAvailability = async (
  showId: string
): Promise<{ id: number; seatNumber: string; status: "available" | "booked" | "reserved" }[]> => {
  try {
    const response = await api.get(`/shows/${showId}/seats/availability`);
    return response.data.data;
  } catch (error: any) {
    console.error("Seat availability error:", error.response?.data || error);
    throw new Error("Failed to load seat availability");
  }
};
