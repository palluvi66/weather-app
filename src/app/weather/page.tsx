'use client';
import { IoSearch } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useEffect, useState } from 'react';
// import Image from 'next/image';
// import sunnybg from '@/assets/sunny.jpg';
// import mist from '@/assets/mist.jpg'; 
// import cloudybg from '@/assets/cloudy.jpg';
// import rain from '@/assets/rainy.jpg';



type Weather = {
  name: string;
  localtime: string;
  country: string;
  condition: {
    text: string;
    icon: string;
  };
  wind_kph: number;
  humidity: number;
  current: {
    temp_c: number;
  };
} | null;
export default function WeatherApp() {
  const [weather, setWeather] = useState<Weather>(null);
  const [query, setQuery] = useState('India');
  const [searchTerm, setSearchTerm] = useState('');
  const [time12, setTime12] = useState("");
  const [dateOnly, setDateOnly] = useState("");
  const [weatherCondition, setWeatherCondition] = useState('sunny');
  const [bgImage, setBgImage] = useState('');



  useEffect(() => {
    if (weather?.localtime) {
      const [datePart, timePart] = weather.localtime.split(' ');

      // Format time to 12-hour
      const [hours, minutes] = timePart.split(':');
      const timeDate = new Date();
      timeDate.setHours(Number(hours));
      timeDate.setMinutes(Number(minutes));

      const localTime12 = timeDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const formattedDate = new Date(datePart).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'long',
      });

      setTime12(localTime12);
      setDateOnly(formattedDate);
    }
  }, [weather]);

  useEffect(() => {
    async function fetchWeatherData(city: string): Promise<void> {
      try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=41386656f06d4f06b2a111600251507&q=${city}&aqi=no`);
        const weatherData = await response.json();
        if (weatherData && weatherData.current && weatherData.location) {
          setWeather({
            name: weatherData.location.name,
            localtime: weatherData.location.localtime,
            country: weatherData.location.country,
            condition: weatherData.current.condition,
            wind_kph: weatherData.current.wind_kph,
            humidity: weatherData.current.humidity,
            current: {
              temp_c: weatherData.current.temp_c,
            },
          });
          setWeatherCondition(weatherData.current.condition.text); // <-- ✅ add this line

        } else {
          console.error("Invalid response data:", weatherData);
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    }
    fetchWeatherData(query);
  }, [query]);

  useEffect(() => {
    function getbgImage(condition: string): string {
      const conditionLower = condition.toLowerCase();

      if (conditionLower.includes('sunny'))
        return "/assets/sunnybg.jpg";
      if (conditionLower.includes('clear'))
        return "/assets/night-clearbg.jpg";
      if (conditionLower.includes('sleet') || conditionLower.includes('patchy sleet') || conditionLower.includes('light sleet') || conditionLower.includes('heavy sleet') || conditionLower.includes('moderate or heavy sleet'))
        return "/assets/heavy-sleet.jpg";

      if (conditionLower.includes('partly cloudy'))
        return "/assets/partlycloudybg.jpg";
      if (conditionLower.includes('overcast'))
        return "/assets/patchy.jpg";

      if (conditionLower.includes('patchy rain nearby') || conditionLower.includes('overcast') || conditionLower.includes('cloudy'))
        return "/assets/cloudy.jpg";

      if (conditionLower.includes('light rain shower') || conditionLower.includes('light rain') || conditionLower.includes('light drizzle') || conditionLower.includes('patchy light rain') || conditionLower.includes('patchy light drizzle') || conditionLower.includes('moderate rain') || conditionLower.includes('drizzle') || conditionLower.includes('light rain at times'))
        return "/assets/lightrain.jpg";
      if (conditionLower.includes('rain') || conditionLower.includes('torrential rain shower') || conditionLower.includes('heavy rain') || conditionLower.includes('heavy rain at times') || conditionLower.includes('moderate rain at times') || conditionLower.includes('moderate or heavy rain shower') || conditionLower.includes('moderate or heavy rain') || conditionLower.includes('heavy rain shower'))
        return "/assets/rain.jpg";

      if (conditionLower.includes('patchy light rain with thunder') || conditionLower.includes('light rain with thunder') || conditionLower.includes('moderate or heavy rain with thunder') || conditionLower.includes('heavy rain with thunder') || conditionLower.includes('torrential rain shower with thunder') || conditionLower.includes('moderate or heavy rain shower with thunder'))
        return "/assets/rainwiththunderstorm.jpg";
      if (conditionLower.includes('snow') || conditionLower.includes('sleet') || conditionLower.includes('light snow') || conditionLower.includes('heavy snow') || conditionLower.includes('patchy light snow') || conditionLower.includes('patchy heavy snow') || conditionLower.includes('moderate or heavy snow'))
        return "/assets/snow.jpg";


      if (conditionLower.includes('mist'))
        return "/assets/mist.jpg";

      return "/assets/sunnybg.jpg";
    }


    setBgImage(getbgImage(weatherCondition))
  }, [weatherCondition]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      setQuery(searchTerm.trim());
      setSearchTerm('');
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >

      {/* <div className="absolute   w-full h-full -z-10">
    <CarouselComponent />
  </div> */}

      <div className=" items-center  bg-transparent  flex-col justify-center rounded-lg flex ">
        <h1 className='text-4xl sm:text-5xl md:text-5xl lg:text-5x -mt-22 lg:-mt-10 mb-2 font-bold text-cyan-900 italic'>Weather</h1>
        <form className='flex  border-gray-500 sm:mt-18 md:mt-10 overflow-hidden items-center bg-blue-100 rounded-full px-2 md:px-4 md:py-5 py-2 border lg:py-3 lg:px-4
        w-[250px] sm:w-[580px] md:w-[500px] lg:w-[400px]' onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search city..."
            className="flex-grow bg-transparent  outline-none text-cyan-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="">
            <IoSearch className="text-lg" />
          </button>
        </form>
        {weather && (
          <div className='text-center mt-4 lg:mt-10 items-center justify-center '>
            <h2 className='text-3xl sm:text-4xl md:text-4xl lg:text-4xl font-bold text-cyan-900 '>{weather.name}, {weather.country}</h2>
            <div className="flex flex-row gap-6 justify-center">
              <p className=' text-lg -mb-2 sm:text-xl md:text-2xl lg:text-2xl flex items-center justify-center font-bold text-cyan-900'>
                {time12}
              </p>
              <p className=' text-xl sm:text-3xl md:text-2xl lg:text-3xl gap-2 flex items-center justify-center font-bold text-cyan-900'>
                <FaRegCalendarAlt className="text-cyan-900" />
                {dateOnly}
              </p>
            </div>
            <div className='space-x-2 flex items-center justify-center mr-8'>
              <img src={weather.condition.icon} alt={weather.condition.text} className='w-35 h-35' />
              <div className="flex flex-col mt-6 items-center">
                <p className='text-xl sm:text-3xl md:text-3xl lg:text-3xl font-bold text-cyan-900'>{weather.current.temp_c} °C</p>
                <p className='text-xl sm:text-3xl md:text-3xl lg:text-3xl font-bold text-cyan-900 mt-2'>{weather.condition.text}</p>
              </div>
            </div>
            <div className="flex gap-4  items-center  justify-center">
              <p className='mt-2 text-xl sm:text-3xl md:text-3xl lg:text-3xl font-bold text-cyan-900 '>Wind:{weather.wind_kph}kph</p>
              <p className='mt-2 text-xl sm:text-3xl md:text-3xl lg:text-3xl font-bold md:font-bold text-cyan-900 '>Humidity:{weather.humidity}%</p>
            </div>
          </div>
        )}
      </div>
    </div>

  );
}
