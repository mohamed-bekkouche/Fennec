import api from "../api/api"


export const getAllProductImages = async () => {
    return await api.get("/product-images")
}