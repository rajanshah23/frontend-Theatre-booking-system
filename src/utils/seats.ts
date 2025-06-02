 

export type SeatAvailability = {
  seatNumber: string;
  status: string;  
};

 
export const seatLabel = (index: number, cols = 10): string => {
  const rows = "ABCDEFGHIJKLMN";    
  const row = rows[Math.floor(index / cols)];
  const col = (index % cols) + 1;
  return `${row}${col}`;
};
 
export const areSeatsAvailable = (
  selectedSeats: string[],
  availableSeats?: SeatAvailability[]  
): boolean => {
  const seats = availableSeats ?? [];   

  const availableSeatNumbers = seats
    .filter(seat => seat.status.toLowerCase() === "available")
    .map(seat => seat.seatNumber.toUpperCase());

  return selectedSeats.every(seat =>
    availableSeatNumbers.includes(seat.toUpperCase())
  );
};
