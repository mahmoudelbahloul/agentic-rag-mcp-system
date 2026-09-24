class WeatherService {
  apiKey: string
  private baseUrl = 'https://api.weatherapi.com/v1/current.json'

  constructor(apiKey: string) {
    this.apiKey = apiKey

    if (!this.apiKey) {
      throw new Error('API key is required for WeatherService')
    }
  }

  async getCurrentWeather(city: string) {
    const url = `${this.baseUrl}?key=${this.apiKey}&q=${encodeURIComponent(city)}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Weather API request failed with status ${response.status}`)
    }

    return await response.json()
  }
}

export default WeatherService
