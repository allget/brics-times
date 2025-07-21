"use client"
import { useState } from "react"
import { TrendingUp, TrendingDown, Thermometer } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface CurrencyData {
  pair: string
  rate: number
  change: number
  trend: "up" | "down"
}

interface WeatherData {
  city: string
  country: string
  temp: number
}

export function Ticker() {
  const { t } = useLanguage()

  const [currencies] = useState<CurrencyData[]>([
    { pair: "BRL/USD", rate: 0.1794, change: 0.0008, trend: "up" },
    { pair: "INR/USD", rate: 0.0116, change: 0.0002, trend: "up" },
    { pair: "CNY/USD", rate: 0.1391, change: -0.0012, trend: "down" },
    { pair: "ZAR/USD", rate: 0.0566, change: 0.0015, trend: "up" },
    { pair: "RUB/USD", rate: 0.0103, change: 0.0001, trend: "up" },
    { pair: "IRR/USD", rate: 0.000024, change: 0.000001, trend: "up" },
    { pair: "EGP/USD", rate: 0.0203, change: -0.0003, trend: "down" },
    { pair: "ETB/USD", rate: 0.0082, change: 0.0001, trend: "up" },
    { pair: "AED/USD", rate: 0.2723, change: 0.0, trend: "up" },
    { pair: "SAR/USD", rate: 0.2667, change: 0.0005, trend: "up" },
  ])

  const [weather] = useState<WeatherData[]>([
    { city: t("city.brasilia"), country: t("country.brazil"), temp: 28 },
    { city: t("city.moscow"), country: t("country.russia"), temp: -5 },
    { city: t("city.new-delhi"), country: t("country.india"), temp: 31 },
    { city: t("city.beijing"), country: t("country.china"), temp: 8 },
    { city: t("city.pretoria"), country: t("country.south-africa"), temp: 24 },
    { city: t("city.tehran"), country: t("country.iran"), temp: 15 },
    { city: t("city.cairo"), country: t("country.egypt"), temp: 22 },
    { city: t("city.addis-ababa"), country: t("country.ethiopia"), temp: 18 },
    { city: t("city.abu-dhabi"), country: t("country.uae"), temp: 26 },
    { city: t("city.riyadh"), country: t("country.saudi-arabia"), temp: 19 },
  ])

  return (
    <div className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-900 dark:border-zinc-600 overflow-hidden">
      <div className="flex animate-scroll">
        {/* Currencies Section */}
        <div className="flex items-center whitespace-nowrap">
          <span className="px-4 py-2 text-xs font-bold tracking-widest text-zinc-700 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-800">
            {t("ticker.currencies")}
          </span>
          {currencies.map((currency, index) => (
            <div key={index} className="flex items-center px-4 py-2 border-r border-zinc-300 dark:border-zinc-700">
              <span className="text-xs font-bold tracking-wider text-zinc-900 dark:text-zinc-100 mr-2">
                {currency.pair}
              </span>
              <span className="text-xs text-zinc-700 dark:text-zinc-300 mr-1">{currency.rate.toFixed(4)}</span>
              <div className="flex items-center">
                {currency.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 text-green-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-600" />
                )}
                <span className={`text-xs ml-1 ${currency.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {currency.change > 0 ? "+" : ""}
                  {currency.change.toFixed(4)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Weather Section */}
        <div className="flex items-center whitespace-nowrap">
          <span className="px-4 py-2 text-xs font-bold tracking-widest text-zinc-700 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-800 border-l border-zinc-300 dark:border-zinc-700">
            {t("ticker.weather")}
          </span>
          {weather.map((city, index) => (
            <div key={index} className="flex items-center px-4 py-2 border-r border-zinc-300 dark:border-zinc-700">
              <span className="text-xs font-bold tracking-wider text-zinc-900 dark:text-zinc-100 mr-2">
                {city.city}
              </span>
              <div className="flex items-center">
                <Thermometer className="w-3 h-3 text-zinc-600 dark:text-zinc-400 mr-1" />
                <span
                  className={`text-xs ${
                    city.temp > 25
                      ? "text-red-600"
                      : city.temp < 10
                        ? "text-blue-600"
                        : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {city.temp}°C
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Duplicate for seamless loop */}
        <div className="flex items-center whitespace-nowrap">
          <span className="px-4 py-2 text-xs font-bold tracking-widest text-zinc-700 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-800 border-l border-zinc-300 dark:border-zinc-700">
            {t("ticker.currencies")}
          </span>
          {currencies.map((currency, index) => (
            <div
              key={`dup-${index}`}
              className="flex items-center px-4 py-2 border-r border-zinc-300 dark:border-zinc-700"
            >
              <span className="text-xs font-bold tracking-wider text-zinc-900 dark:text-zinc-100 mr-2">
                {currency.pair}
              </span>
              <span className="text-xs text-zinc-700 dark:text-zinc-300 mr-1">{currency.rate.toFixed(4)}</span>
              <div className="flex items-center">
                {currency.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 text-green-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-600" />
                )}
                <span className={`text-xs ml-1 ${currency.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {currency.change > 0 ? "+" : ""}
                  {currency.change.toFixed(4)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center whitespace-nowrap">
          <span className="px-4 py-2 text-xs font-bold tracking-widest text-zinc-700 dark:text-zinc-300 bg-zinc-200 dark:bg-zinc-800 border-l border-zinc-300 dark:border-zinc-700">
            {t("ticker.weather")}
          </span>
          {weather.map((city, index) => (
            <div
              key={`dup-${index}`}
              className="flex items-center px-4 py-2 border-r border-zinc-300 dark:border-zinc-700"
            >
              <span className="text-xs font-bold tracking-wider text-zinc-900 dark:text-zinc-100 mr-2">
                {city.city}
              </span>
              <div className="flex items-center">
                <Thermometer className="w-3 h-3 text-zinc-600 dark:text-zinc-400 mr-1" />
                <span
                  className={`text-xs ${
                    city.temp > 25
                      ? "text-red-600"
                      : city.temp < 10
                        ? "text-blue-600"
                        : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {city.temp}°C
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
