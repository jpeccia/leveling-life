import { useEffect, useState } from 'react';
import { getWeatherActivity } from '../lib/apiWeather';
import axios from 'axios';

const WeatherActivity = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>('');
  const [suggestedCities, setSuggestedCities] = useState<{ name: string, region: string }[]>([]);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  const handleCityChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setCity(input);

    if (input.trim() !== '') {
      try {
        const response = await axios.get(
          `https://api.weatherapi.com/v1/search.json?key=dfb03677d56a4e4e8fa231205242711&q=${encodeURIComponent(input)}`
        );
        const cities = response.data.map((city: any) => ({ name: city.name, region: city.region }));
        setSuggestedCities(cities);
        setShowAllSuggestions(false); // Resetar a opção de mostrar todos.
      } catch (error) {
        console.error('Erro ao buscar sugestões de cidades:', error);
      }
    } else {
      setSuggestedCities([]);
    }
  };

  const handleSearch = () => {
    if (city.trim() !== '') {
      setLoading(true);
      setError(null);
      getWeatherActivity(city)
        .then((data) => {
          setWeather(data);
          setLoading(false);
        })
        .catch((error) => {
          setError('Erro ao buscar os dados do clima.');
          setLoading(false);
        });
    } else {
      setError('Por favor, insira uma cidade.');
    }
  };

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setSuggestedCities([]);
    handleSearch();
  };

  const showMoreSuggestions = () => {
    setShowAllSuggestions(true);
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  if (!weather) return (
    <div>
      <h3 className="text-lg font-semibold">Atividades para o Dia</h3> 
      <p>Busque a sua cidade</p>
      <input
        type="text"
        placeholder="Digite a cidade"
        value={city}
        onChange={handleCityChange}
        className="border p-2"
      />
      <button onClick={handleSearch} className="ml-2 border p-2 bg-blue-500 text-white">
        Buscar
      </button>
      {suggestedCities.length > 0 && (
        <div>
          <ul className="mt-2">
            {suggestedCities.slice(0, showAllSuggestions ? suggestedCities.length : 5).map((suggestion, index) => (
              <li
                key={index}
                className="cursor-pointer hover:bg-gray-200 p-1"
                onClick={() => handleCitySelect(suggestion.name)}
              >
                {suggestion.name}, {suggestion.region}
              </li>
            ))}
          </ul>
          {!showAllSuggestions && suggestedCities.length > 5 && (
            <button onClick={showMoreSuggestions} className="mt-2 border p-2 bg-gray-300">
              Mostrar mais opções
            </button>
          )}
        </div>
      )}
    </div>
  );

  const temperature = weather?.current?.temp_c ?? null;

  const getActivitySuggestion = (temperature: number) => {
    if (temperature < 10) {
      return `❄️ Está frio demais (atualmente ${temperature}°C)! Enrole-se na capa do aventureiro, prepare um chá mágico e assista a um épico!`;
    } else if (temperature >= 10 && temperature < 20) {
      return `🌤️ Temperatura amena (atualmente ${temperature}°C)! Explore o parque como se fosse uma missão de caça a tesouros!`;
    } else if (temperature >= 20 && temperature < 30) {
      return `☀️ Sol perfeito (atualmente ${temperature}°C)! Faça um piquenique e mostre que todo herói sabe aproveitar o dia!`;
    } else {
      return `🔥 Calor extremo (atualmente ${temperature}°C)! Beba uma poção refrescante e se jogue nas águas frescas!`;
    }
  };

  const activitySuggestion = temperature !== null ? getActivitySuggestion(temperature) : 'Nenhuma sugestão disponível';

  return (
    <div>
      <h3 className="text-lg font-semibold">Atividades para o Dia</h3>
      <p>Temperatura atual: {temperature}°C</p>
      <div id="weather-activity">
        <p>{activitySuggestion}</p>
      </div>
    </div>
  );
};

export default WeatherActivity;
