import axios from 'axios';
import { API_BASE_URL } from '@/lib/config';

const EMPTY_RESULT = { data: [] };

export async function getApiData(path, fallback = EMPTY_RESULT) {
  try {
    const res = await axios.get(`${API_BASE_URL}${path}`, {
      validateStatus: () => true,
    });

    if (res.status < 200 || res.status >= 300) {
      console.warn(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
      return fallback;
    }

    return res.data;
  } catch (error) {
    console.warn(`Failed to fetch ${path}:`, error);
    return fallback;
  }
}
