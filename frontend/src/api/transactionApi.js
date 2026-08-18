import api from './axiosConfig';

export const transactionApi = {
  // Deposit money
  deposit: async (transactionData) => {
    // transactionData should include accountNumber, amount, transactionType
    const response = await api.post('/transaction/deposit', transactionData);
    return response.data;
  },

  // Withdraw money
  withdraw: async (transactionData) => {
    // transactionData should include accountNumber, amount, transactionType
    const response = await api.post('/transaction/withdraw', transactionData);
    return response.data;
  },

  // Transfer money
  transfer: async (transactionData) => {
    // transactionData should include Senderaccount, Receiveraccount, amount, transactionType
    const response = await api.post('/transaction/transaction', transactionData);
    return response.data;
  },

  // Get transaction history
  // Note: Backend specifically requires POST method for this endpoint
  getHistory: async () => {
    // Controller class is @RequestMapping("/api/transaction") and method is @PostMapping("/transaction/history")
    // Therefore full path is /api/transaction/transaction/history
    const response = await api.post('/transaction/transaction/history');
    return response.data;
  }
};
