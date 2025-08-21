'use client';
import { IoSearch } from "react-icons/io5";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { StaticImageData } from "next/image";

// Assets
import sunnybg from '@/assets/sunnybg.jpg';
import mist from '@/assets/mist.jpg';
import cloudybg from '@/assets/cloudy.jpg';
import rain from '@/assets/rain.jpg';
import heavy from '@/assets/heavy-sleet.jpg';
import lightrain from '@/assets/lightrain.jpg';
import nightclear from '@/assets/night-clearbg.avif';
import partlycloudy from '@/assets/partlycloudybg.jpg';
import patchy from '@/assets/patchy.jpg';
import rainwiththunderstorm from '@/assets/rainwiththunderstorm.jpg';
import snow from '@/assets/snow.jpg';

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
  const [bgImage, setBgImage] = useState<string | StaticImageData>(sunnybg);

  // ✅ Format date/time
  useEffect(() => {
    if (weather?.localtime) {
      const [datePart, timePart] = weather.localtime.split(' ');
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

  // ✅ Fetch weather
  useEffect(() => {
    async function fetchWeatherData(city: string): Promise<void> {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=41386656f06d4f06b2a111600251507&q=${city}&aqi=no`
        );
        const weatherData = await response.json();

        if (weatherData?.current && weatherData?.location) {
          setWeather({
            name: weatherData.location.name,
            localtime: weatherData.location.localtime,
            country: weatherData.location.country,
            condition: weatherData.current.condition,
            wind_kph: weatherData.current.wind_kph,
            humidity: weatherData.current.humidity,
            current: { temp_c: weatherData.current.temp_c },
          });
          setWeatherCondition(weatherData.current.condition.text);
        } else {
          console.error("Invalid response data:", weatherData);
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    }
    fetchWeatherData(query);
  }, [query]);

  // ✅ Map condition → background
  function getbgImage(condition: string): string | StaticImageData {
    const lower = condition.toLowerCase();
    if (lower.includes("sunny")) return sunnybg;
    if (lower.includes("clear")) return nightclear;
    if (lower.includes("sleet")) return heavy;
    if (lower.includes("partly cloudy")) return partlycloudy;
    if (lower.includes("overcast")) return patchy;
    if (lower.includes("cloudy")) return cloudybg;
    if (
      lower.includes("light rain shower") ||
      lower.includes("light drizzle") ||
      lower.includes("drizzle") ||
      lower.includes("light rain") ||
      lower.includes("patchy light rain")
    )
      return lightrain;
    if (lower.includes("thunder")) return rainwiththunderstorm;
    if (lower.includes("rain")) return rain;
    if (lower.includes("snow")) return snow;
    if (lower.includes("mist")) return mist;

    return sunnybg; // fallback
  }

  // ✅ Update bgImage when condition changes
  useEffect(() => {
    setBgImage(getbgImage(weatherCondition));
  }, [weatherCondition]);

  // ✅ Search handler
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      setQuery(searchTerm.trim());
      setSearchTerm('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background Image */}
      <Image
        src={bgImage}
        alt="Background"
        fill
        className="object-cover -z-10"
        priority
      />

      {/* Content */}
      <div className="items-center bg-transparent flex-col justify-center rounded-lg flex">
        <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-5xl mb-2 font-bold text-cyan-900">
          Weather
        </h1>

        {/* Search */}
        <form
          className="flex border-gray-500 mt-6 overflow-hidden items-center bg-blue-100 rounded-full px-4 py-2 border
          w-[250px] sm:w-[580px] md:w-[500px] lg:w-[400px]"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search city..."
            className="flex-grow bg-transparent outline-none text-cyan-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <IoSearch className="text-lg" />
          </button>
        </form>

        {/* Weather Info */}
        {weather && (
          <div className="text-center mt-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-cyan-900">
              {weather.name}, {weather.country}
            </h2>

            <div className="flex flex-row gap-6 justify-center mt-2">
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-cyan-900">
                {time12}
              </p>
              <p className="text-xl sm:text-2xl flex items-center gap-2 font-bold text-cyan-900">
                <FaRegCalendarAlt className="text-cyan-900" />
                {dateOnly}
              </p>
            </div>

            <div className="flex items-center justify-center mt-6 gap-4">
              <img
                src={weather.condition.icon}
                alt={weather.condition.text}
                className="w-20 h-20"
              />
              <div>
                <p className="text-2xl font-bold text-cyan-900">
                  {weather.current.temp_c} °C
                </p>
                <p className="text-xl font-bold text-cyan-900 mt-1">
                  {weather.condition.text}
                </p>
              </div>
            </div>

            <div className="flex gap-10 justify-center mt-6">
              <p className="text-xl sm:text-2xl font-bold text-cyan-900">
                Wind: {weather.wind_kph} kph
              </p>
              <p className="text-xl sm:text-2xl font-bold text-cyan-900">
                Humidity: {weather.humidity}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
