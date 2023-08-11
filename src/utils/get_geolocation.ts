export const getLocation = (
  changeCode: (code: string) => void,
  changeDefaultCoordinates: (coordinates: number[]) => void, 
  setGeoLocationResult: React.Dispatch<React.SetStateAction<string>>
): void => {
  let coordinates: number[] = [];
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        changeCode('');
        changeDefaultCoordinates([position.coords.latitude, position.coords.longitude]);
        setGeoLocationResult('OK');
      }, 
      (error: GeolocationPositionError) => {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setGeoLocationResult("User denied the request for Geolocation.")
            break;
          case error.POSITION_UNAVAILABLE:
            setGeoLocationResult("Location information is unavailable.")
            break;
          case error.TIMEOUT:
            setGeoLocationResult("The request to get user location timed out.")
            break;
          default:
            setGeoLocationResult("An unknown error occurred.")
            break;
        }
      }
    );
    
  }
  else {
    setGeoLocationResult("Geolocation is not supported by this browser.")
  }
}
