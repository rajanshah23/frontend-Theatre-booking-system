// types/show.ts
export interface Show {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  price: number;
  totalSeats: number;
  image: string;
  showTimes: string[];  
}

export interface Booking {
  showId: string;
  userId?: string;
  seats: string[];
  showTime: string;
  customerName?: string;
  customerEmail?: string;
}