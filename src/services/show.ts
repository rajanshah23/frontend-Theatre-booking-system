// src/services/show.ts
import api from './api';
import { Show, Booking } from '../types';

/**
 * Fetch all shows
 */
export const getShows = async (): Promise<Show[]> => {
  try {
    const response = await api.get('/shows');
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch shows');
  }
};

/**
 * Fetch single show by ID
 */
export const getShow = async (id: string): Promise<Show> => {
  try {
    const response = await api.get(`/shows/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(`Failed to fetch show with ID ${id}`);
  }
};

/**
 * Book tickets for a specific show
 */
 export const bookTicket = async (booking: Booking): Promise<void> => {
  try {
    // ✅ Convert seat numbers to strings (like Postman does)
    const seatNumbers = booking.seatNumbers.map(String);
    console.log("Booking seats:", seatNumbers); // For debugging

    await api.post(`/shows/${booking.showId}/seats/book`, {
      seatNumbers,
    });
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.response?.data?.error) {
      throw new Error(error.response.data.error); // ✅ show API-level errors
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('Booking failed');
    }
  }
};



/**
 * Get available seats for a specific show
 */
export const getSeatsAvailability = async (
  showId: string
): Promise<{ seatNumber: string; status: string }[]> => {
  try {
    const response = await api.get(`/shows/${showId}/seats-availability`);
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch seat availability');
  }
};
