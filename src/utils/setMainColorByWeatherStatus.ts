export const setMainColorByWeatherClass = (weatherClass: string): void => {
  switch (weatherClass) {
    case 'clear':
      document.documentElement.style.setProperty('--primary-color', '#a9cee1')
      break
    case 'clear-cloudy':
      document.documentElement.style.setProperty('--primary-color', '#86c5e4')
      break
    case 'clouds':
      document.documentElement.style.setProperty('--primary-color', '#d66c05')
      break
    case 'fog':
      document.documentElement.style.setProperty('--primary-color', '#9db4df')
      break
    case 'rain':
      document.documentElement.style.setProperty('--primary-color', '#829f9a')
      break
    case 'snow':
      document.documentElement.style.setProperty('--primary-color', '#76bcd6')
      break
    case 'heavy-snow':
      document.documentElement.style.setProperty('--primary-color', '#92d5ff')
      break
    case 'ice':
      document.documentElement.style.setProperty('--primary-color', '#5886c9')
      break
    case 'thunderstorm':
      document.documentElement.style.setProperty('--primary-color', '#8c76b0')
      break
    default:
  }
}
