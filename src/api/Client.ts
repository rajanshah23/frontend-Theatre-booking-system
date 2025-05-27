import axios from 'axios';
import { Show } from '../types/show';
import { Booking } from '../types/show';

const API_BASE = 'http://localhost:3000/api/shows'; 

export const getShows = async () => {
  const res = await axios.get<Show[]>(`${API_BASE}/shows`);
  return res.data;
};

export const getShow = async (id: string) => {
  const res = await axios.get<Show>(`${API_BASE}/shows/${id}`);
  return res.data;
};

export const bookTicket = async (booking: Booking) => {
  await axios.post(`${API_BASE}/bookings`, booking);
};