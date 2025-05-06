import axios from 'axios';
const API_BASE_URL = 'http://192.168.0.12:8080';

export const submitProfile = async (profileData: {
  nickname: string;
  location: string;
  userType: 'seller' | 'customer';
  selectedCakes: number[];
}) => {
  const response = await axios.post(`${API_BASE_URL}/api/users`, profileData);
  return response.data;
};