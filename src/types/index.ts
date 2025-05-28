// types/show.ts
export interface Show {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  totalSeats: number;
  image: string;
}

export interface Booking {
  showId: string;
  userId?: string;   
  seats: number;
  showTime: string;   
  customerName?: string;  
  customerEmail?: string;  
}