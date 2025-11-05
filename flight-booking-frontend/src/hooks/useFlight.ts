// hooks/useFlight.ts

import { useState, useEffect } from 'react';
import { flightService } from '../services/flightService';
import { FlightDetails, BookFlightRequest } from '../types/flight';

/**
 * Custom hook để lấy chi tiết chuyến bay
 */
export const useFlightDetails = (flightId: string) => {
  const [flightData, setFlightData] = useState<FlightDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFlightDetails();
  }, [flightId]);

  const fetchFlightDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await flightService.getFlightDetails(flightId);
      setFlightData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch flight details');
      console.error('Error in useFlightDetails:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchFlightDetails();
  };

  return {
    flightData,
    loading,
    error,
    refetch,
  };
};

/**
 * Custom hook để đặt chuyến bay
 */
export const useBookFlight = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<any>(null);

  const bookFlight = async (bookingData: BookFlightRequest) => {
    try {
      setLoading(true);
      setError(null);
      const result = await flightService.bookFlight(bookingData);
      setBookingResult(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to book flight';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setBookingResult(null);
  };

  return {
    bookFlight,
    loading,
    error,
    bookingResult,
    reset,
  };
};

/**
 * Custom hook để toggle favorite
 */
export const useFavoriteFlight = () => {
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async (flightId: string) => {
    try {
      setLoading(true);
      const isFavorite = await flightService.toggleFavorite(flightId);
      return isFavorite;
    } catch (err) {
      console.error('Error toggling favorite:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    toggleFavorite,
    loading,
  };
};