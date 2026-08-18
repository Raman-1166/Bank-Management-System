import api from './axiosConfig';

export const customerApi = {
  // Get all customers
  getAll: async () => {
    const response = await api.get('/customer');
    return response.data;
  },

  // Get customer by ID
  getById: async (id) => {
    const response = await api.get(`/customer/${id}`);
    return response.data;
  },

  // Add a new customer
  create: async (customerData) => {
    // We send data exactly matching the Customer model
    const response = await api.post('/customer', customerData);
    return response.data;
  },

  // Update a customer
  update: async (customerData) => {
    const response = await api.put('/customer', customerData);
    return response.data;
  },

  // Delete a customer
  delete: async (id) => {
    const response = await api.delete(`/customer/${id}`);
    return response.data;
  }
};
