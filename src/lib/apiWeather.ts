import axios from 'axios';

export const getWeatherActivity = async (city: string) => {
  try {
    const apiKey = import.meta.env.VITE_API_WEATHER_KEY;
    const response = await axios.get(
      `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(city)}&lang=pt`
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar o clima:', error);
    throw error;
  }
};
