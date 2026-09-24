import type { Request, Response } from 'express'
import WeatherService from '../services/weather.service.ts'

class WeatherController {
  static async getWeather(req: Request, res: Response) {
    try {
      const city = (req.query.city as string) || 'Cairo'

      const weather = new WeatherService(process.env.WEATHER_API_KEY!)

      const data = await weather.getCurrentWeather(city)

      res.json({ success: true, data })
    } catch (error: any) {
      console.error('Error fetching weather data:', error)
      res.status(500).json({ success: false, message: 'Failed to fetch weather data.' })
    }
  }
}

export default WeatherController
