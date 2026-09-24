import type { Request, Response } from 'express'
import OrderService from '../services/order.service.ts'

class OrderController {
  static async getAllOrders(req: Request, res: Response) {
    try {
      const { limit } = req.query
      const parsedLimit = limit !== undefined ? Number(limit) : undefined

      if (parsedLimit !== undefined && Number.isNaN(parsedLimit)) {
        return res.status(400).json({ success: false, message: 'Invalid limit parameter: must be a number.' })
      }

      const orders = await OrderService.getLatestOrders(parsedLimit)

      res.json({ success: true, data: orders })
    } catch (error: any) {
      console.error('Error fetching orders:', error)
      res.status(500).json({ success: false, message: 'Failed to fetch orders.' })
    }
  }

  static async getOrderById(req: Request, res: Response) {
    try {
      const id = String(req.params.id)

      const order = await OrderService.getOrderById(id)

      if (!order) {
        return res.status(404).json({ success: false, message: `Order with id '${id}' not found.` })
      }

      res.json({ success: true, data: order })
    } catch (error: any) {
      console.error('Error fetching order:', error)
      res.status(500).json({ success: false, message: 'Failed to fetch order.' })
    }
  }
}

export default OrderController
