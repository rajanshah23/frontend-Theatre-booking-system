import axios from "axios";

const API = "http://localhost:3000/api/shows";

export const initiatePayment = async (bookingId: number, totalAmount: number) => {
  try {
    const res = await axios.post(`${API}/initiate`, {
      bookingId,
      totalAmount,
      paymentMethod: "online",
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Payment initiation failed");
  }
};

export const verifyPayment = async (pidx: string) => {
  try {
    const res = await axios.post(`${API}/verify`, { pidx });
    return res.data;  
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Payment verification failed");
  }
};