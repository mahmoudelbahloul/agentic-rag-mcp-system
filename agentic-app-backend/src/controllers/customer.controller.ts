import type { Request, Response } from 'express'
import CustomerService from '../services/customer.service.ts'

class CustomerController {
  static async getAllCustomers(req: Request, res: Response) {
    try {
      const { limit } = req.query
      const parsedLimit = limit !== undefined ? Number(limit) : undefined

      if (parsedLimit !== undefined && Number.isNaN(parsedLimit)) {
        return res.status(400).json({ success: false, message: 'Invalid limit parameter: must be a number.' })
      }

      const customers = await CustomerService.getLatestCustomers(parsedLimit)

      res.json({ success: true, data: customers })
    } catch (error: any) {
      console.error('Error fetching customers:', error)
      res.status(500).json({ success: false, message: 'Failed to fetch customers.' })
    }
  }

  static async getCustomerById(req: Request, res: Response) {
    try {
      const id = String(req.params.id)

      const customer = await CustomerService.getCustomerById(id)

      if (!customer) {
        return res.status(404).json({ success: false, message: `Customer with id '${id}' not found.` })
      }

      res.json({ success: true, data: customer })
    } catch (error: any) {
      console.error('Error fetching customer:', error)
      res.status(500).json({ success: false, message: 'Failed to fetch customer.' })
    }
  }
}

export default CustomerController
