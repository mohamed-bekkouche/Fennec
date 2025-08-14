import api from "../api/api";

export const applyCoupon = async (code: string) => {
    return await api.post('/coupons', { code });
 
};