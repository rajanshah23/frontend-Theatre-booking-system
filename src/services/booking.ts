import api from "./api";

export interface BookingRequest {
  showId: string;
  seatIds: number[];
  totalAmount: number;
  paymentMethod: "KHALTI" | "CASH" | "CARD" | "ONLINE";
}

export interface BookingResponse {
  message: string;
  booking: {
    id: number;
    status: string;
  };
  paymentUrl?: string;
  pidx?: string;
}

export const createBooking = async (data: BookingRequest): Promise<BookingResponse> => {
  const response = await api.post(`/shows/${data.showId}/bookings`, {
    seatIds: data.seatIds,
    totalAmount: data.totalAmount,
    paymentMethod: data.paymentMethod,
  });
  return response.data;
};

export const confirmBooking = async (bookingId: number) => {
  try {
    const response = await api.patch(`/bookings/${bookingId}/confirm`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw new Error("Failed to confirm booking");
  }
};

export const cancelBooking = async (bookingId: number) => {
  try {
    const response = await api.delete(`/bookings/${bookingId}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw new Error("Failed to cancel booking");
  }
};

export const verifyPayment = async (paymentData: { pidx: string; bookingId: number }) => {
  try {
    const response = await api.post(`/bookings/verify-payment`, paymentData);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw new Error("Payment verification failed");
  }
};

export const getUserBookings = async () => {
  try {
    const response = await api.get(`/users/me/bookings`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) throw new Error(error.response.data.message);
    throw new Error("Failed to fetch user bookings");
  }
};

 