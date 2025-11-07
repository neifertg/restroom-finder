import { UserLocation, GeolocationError } from '@/types';

/**
 * Get the user's current location using the browser's Geolocation API
 */
export const getCurrentLocation = (): Promise<UserLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: 0,
        message: 'Geolocation is not supported by your browser',
      } as GeolocationError);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let message = 'Unable to retrieve your location';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable. Please try again.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out. Please try again.';
            break;
        }

        reject({
          code: error.code,
          message,
        } as GeolocationError);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

/**
 * Watch the user's location for continuous updates
 */
export const watchLocation = (
  onSuccess: (location: UserLocation) => void,
  onError: (error: GeolocationError) => void
): number | null => {
  if (!navigator.geolocation) {
    onError({
      code: 0,
      message: 'Geolocation is not supported by your browser',
    });
    return null;
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      onSuccess({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
    },
    (error) => {
      let message = 'Unable to retrieve your location';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = 'Location permission denied';
          break;
        case error.POSITION_UNAVAILABLE:
          message = 'Location information unavailable';
          break;
        case error.TIMEOUT:
          message = 'Location request timed out';
          break;
      }

      onError({
        code: error.code,
        message,
      });
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    }
  );
};

/**
 * Stop watching the user's location
 */
export const clearLocationWatch = (watchId: number): void => {
  if (navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
};
