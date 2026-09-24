import { MOCK_ORDERS } from '../data/orders.data.ts'
import CustomerService from './customer.service.ts'

class OrderService {
  static async getLatestOrders(limit?: number) {
    const sorted = [...MOCK_ORDERS].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    if (limit && limit > 0) {
      return sorted.slice(0, limit)
    }

    return sorted
  }

  static async getOrderById(id: string) {
    return MOCK_ORDERS.find((o) => o._id === id) || null
  }

  static async getLatestOrdersWithCustomerDetails(limit?: number) {
    const withCustomer = await Promise.all(
      MOCK_ORDERS.map(async (order) => {
        const customer = await CustomerService.getCustomerById(order.customerId)
        return {
          ...order,
          customer: customer?.name || 'Unknown',
        }
      })
    )

    const sorted = withCustomer.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    if (limit && limit > 0) {
      return sorted.slice(0, limit)
    }

    return sorted
  }
}

export default OrderService
