// src/services/showService.ts

import api from "./api";
import axios from "axios";
import { Show, Booking } from "../types";

const API = "http://localhost:3000/api/shows";

// Fetch all shows
export const getShows = async (): Promise<Show[]> => {
  const response = await api.get("/shows");
  return response.data.data;
};

// Fetch a single show by ID
export const getShow = async (id: string): Promise<Show> => {
  const response = await api.get(`/shows/${id}`);
  return response.data.data;
};

// Book ticket for a show
export const bookTicket = async (
  booking: Booking
): Promise<{
  booking: { id: number; [key: string]: any };
  paymentUrl?: string;
}> => {
  try {
    const response = await api.post(`/shows/${booking.showId}/bookings`, {
      seatIds: booking.seatIds,
      totalAmount: booking.totalAmount,
      paymentMethod: booking.paymentMethod,
      showTime: booking.showTime,
      seatNumbers: booking.seatNumbers,
    });

    // If payment method is KHALTI, return payment URL
    if (booking.paymentMethod.toUpperCase() === "KHALTI") {
      return {
        booking: response.data.booking,
        paymentUrl: response.data.paymentUrl,
      };
    }

    return {
      booking: response.data.booking,
    };
  } catch (error: any) {
    if (error.response?.data?.message)
      throw new Error(error.response.data.message);
    throw new Error("Booking failed");
  }
};

// Get seats availability for a show
export const getSeatsAvailability = async (
  showId: string
): Promise<
  {
    id: number;
    seatNumber: string;
    status: "available" | "booked" | "reserved";
  }[]
> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found, please login");

    const response = await axios.get(`${API}/${showId}/seats/availability`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  } catch (error: any) {
    console.error(
      "Seat availability error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to load seat availability");
  }
};
