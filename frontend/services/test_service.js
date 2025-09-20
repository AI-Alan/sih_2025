import axiosInstance from "../network/core/axiosInstance";

export const getRoot = async () => {
    try {
        const response = await axiosInstance.get('/');
        return response.data;
    } catch (error) {
        console.error('Error fetching root:', error);
        throw error;
    }
};