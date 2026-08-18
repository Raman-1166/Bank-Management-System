import api from './axiosConfig';

export const accountApi = {
  // Add a new account
  create: async (accountData) => {
    const response = await api.post('/account', accountData);
    return response.data;
  },

  // Get accounts by Customer ID
  getByCustomerId: async (customerId) => {
    const response = await api.get(`/account/customer/${customerId}`);
    return response.data;
  },

  // Get account by Account Number
  getByAccountNumber: async (accountNo) => {
    const response = await api.get(`/account/account/${accountNo}`);
    return response.data;
  },

  // Update an account
  update: async (accountData) => {
    const response = await api.put('/account', accountData);
    return response.data;
  },

  // Delete an account
  delete: async (accountNo) => {
    const response = await api.delete(`/account/${accountNo}`);
    return response.data;
  }
};
