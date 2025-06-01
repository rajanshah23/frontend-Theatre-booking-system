// src/utils/seats.ts

export type SeatAvailability = {
  seatNumber: string;
  status: string; // e.g. 'available', 'booked', etc.
};

 
export const areSeatsAvailable = (
  selectedSeats: string[],
  availableSeats: SeatAvailability[]
): boolean => {
 
  const availableSeatNumbers = availableSeats
    .filter(seat => seat.status === 'available')
    .map(seat => seat.seatNumber.toUpperCase());

  // Check every selected seat against available seats list
  return selectedSeats.every(seat => availableSeatNumbers.includes(seat.toUpperCase()));
};
