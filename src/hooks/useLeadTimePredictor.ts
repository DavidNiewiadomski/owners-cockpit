import { useQuery, useMutation } from '@tanstack/react-query';
import type { ForecastRequest} from '@/lib/api/leadtime-predictor';
import { leadTimePredictorAPI, ForecastResponse, ModelStatus } from '@/lib/api/leadtime-predictor';

// Query keys
const QUERY_KEYS = {
  modelStatus: ['leadtime-predictor', 'model-status'],
  healthCheck: ['leadtime-predictor', 'health'],
  forecast: (request: ForecastRequest) => ['leadtime-predictor', 'forecast', request],
};

// Hook for getting model status
export function useModelStatus() {
  return useQuery({
    queryKey: QUERY_KEYS.modelStatus,
    queryFn: () => leadTimePredictorAPI.getModelStatus(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
}

// Hook for health check
export function useHealthCheck() {
  return useQuery({
    queryKey: QUERY_KEYS.healthCheck,
    queryFn: () => leadTimePredictorAPI.healthCheck(),
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 15 * 1000, // Refetch every 15 seconds
  });
}

// Hook for forecasting (manual trigger)
export function useForecast() {
  return useMutation({
    mutationFn: (request: ForecastRequest) => leadTimePredictorAPI.forecast(request),
  });
}

// Hook for triggering model training
export function useModelTraining() {
  return useMutation({
    mutationFn: () => leadTimePredictorAPI.triggerModelTraining(),
  });
}

// Hook for getting cached forecast (if you want to cache forecasts)
export function useCachedForecast(request: ForecastRequest, enabled: boolean = false) {
  return useQuery({
    queryKey: QUERY_KEYS.forecast(request),
    queryFn: () => leadTimePredictorAPI.forecast(request),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
