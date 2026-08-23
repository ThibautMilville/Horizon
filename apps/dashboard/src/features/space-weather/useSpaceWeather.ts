import {useCallback, useEffect, useState} from "react";

import {
  NOAA_KP_ENDPOINT,
  parseNoaaKpResponse,
  SPACE_WEATHER_REFRESH_MS,
  type SpaceWeatherObservation,
} from "./space-weather";

export function useSpaceWeather() {
  const [observation, setObservation] = useState<SpaceWeatherObservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    try {
      const response = await fetch(NOAA_KP_ENDPOINT, {signal});
      if (!response.ok) {
        throw new Error(`NOAA SWPC returned ${response.status}`);
      }
      const next = parseNoaaKpResponse(await response.json());
      if (!next) {
        throw new Error("NOAA SWPC returned an unexpected payload");
      }
      setObservation(next);
      setErrorMessage(undefined);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      setErrorMessage(error instanceof Error ? error.message : "NOAA SWPC request failed");
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    const interval = window.setInterval(() => void load(), SPACE_WEATHER_REFRESH_MS);
    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, [load]);

  return {
    observation,
    loading,
    errorMessage,
    retry: () => void load(),
  };
}
