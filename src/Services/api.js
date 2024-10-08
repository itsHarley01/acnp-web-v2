import axios from 'axios';

const API_URL = 'https://a-cn-p-backend.vercel.app';

export const fetchAboutDescription = async () => {
    const response = await axios.get(`${API_URL}/about`);
    console.log(response)
    return response.data;
};

export const fetchServices = async () => {
    const response = await axios.get(`${API_URL}/services`);
    return response.data; 
};
  
export const fetchProjects = async () => {
    const response = await axios.get(`${API_URL}/images`);
    return response.data; 
  };

export const fetchContactInfo = async () => {
    const response = await axios.get(`${API_URL}/contacts`); 
    return response.data; 
};

export const fetchProductsByType = async (type) => {
    const response = await axios.get(`${API_URL}/products/${type}`);
    return response.data;
};

export const createAppointment = async (appointmentData) => {
  const updatedAppointmentData = {
      ...appointmentData,
      contacted: "false", 
      finished: "false",   
  };
  const response = await axios.post(`${API_URL}/appointment`, updatedAppointmentData);
  return response.data; 
};
export const getDateByAppointment = async () => {
    const response = await axios.get(`${API_URL}/appointmentDate`);
    return response.data;
};

export const createMessage = async (messageData) => {
    const response = await axios.post(`${API_URL}/feedback`, messageData);
    return response.data; 
};
    
    