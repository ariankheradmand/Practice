// utils.js
import axios from 'axios';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_READ_ACCESS_TOKEN

const fetchData = async (endpoint, params = {}) => {
  const options = {
    method: 'GET',
    url: `${API_BASE_URL}${endpoint}`,
    params,
    headers: {
      accept: 'application/json',
      Authorization: API_KEY,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error; // Rethrow the error for handling
  }
};

export default fetchData;
