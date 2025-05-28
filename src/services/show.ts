import api from './api';
import { Show, Booking } from '../types';

// Get all shows
export const getShows = async (): Promise<Show[]> => {
  try {
    const response = await api.get('/show');
    return response.data.data; // assuming backend responds with { message, data }
  } catch (error) {
    throw new Error('Failed to fetch shows');
  }
};

// Get a single show by ID
export const getShow = async (id: string): Promise<Show> => {
  try {
    const response = await api.get(`/shows/${id}`);
    return response.data.data;
  } catch (error) {
    throw new Error(`Failed to fetch show with ID ${id}`);
  }
};

// Book a ticket
export const bookTicket = async (booking: Booking): Promise<void> => {
  try {
    await api.post('/bookings', booking);
  } catch (error) {
    throw new Error('Booking failed');
  }
};
