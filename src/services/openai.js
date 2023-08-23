// src/services/openai.js

import axios from 'axios';

const getAccountBalance = async (apiKey) => {
  try {
    const response = await axios.get('https://api.openai.com/v1/account', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return response.data.balance;
  } catch (error) {
    console.error('Error fetching account balance:', error);
    throw error;
  }
};

export default getAccountBalance;