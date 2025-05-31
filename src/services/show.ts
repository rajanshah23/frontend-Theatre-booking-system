// services/show.ts
import api from './api';
import { Show, Booking } from '../types';

 
export const getShows = async (): Promise<Show[]> => {
  try {
    const response = await api.get('/shows');
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch shows');
  }
};

 
export const getShow = async (id: string): Promise<Show> => {
  try {
    const response = await api.get(`/shows/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(`Failed to fetch show with ID ${id}`);
  }
};

 
export const bookTicket = async (booking: Booking): Promise<void> => {
  try {
    for (const seatNumber of booking.seats) {
      await api.post(`/shows/${booking.showId}/seats/book`, {
        seatNumber: seatNumber.trim(),
        showTime: booking.showTime,
      });
    }
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('Booking failed');
    }
  }
};


 
export const getSeatsAvailability = async (showId: string): Promise<{ seatNumber: string; status: string }[]> => {
  try {
    const response = await api.get(`/shows/${showId}/seats-availability`);
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch seat availability');
  }
};