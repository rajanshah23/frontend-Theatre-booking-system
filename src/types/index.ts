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
  seatNumbers: string[];
  seatIds?: number[];
  totalAmount: number;
  paymentMethod: "KHALTI" | "CASH" | "CARD" | "ONLINE";
  showTime: string;
  customerName?: string;
  customerEmail?: string;
}

export interface SeatAvailability {
  id: number;
  seatNumber: string;
  status: "available" | "booked" | "reserved";
}
