export interface Show {
  id: string;
  title: string;
  poster: string;
  description?: string;
  showTimes: string[];
}

export interface Booking {
  showId: string;
  userId: string;
  seats: number;
}
