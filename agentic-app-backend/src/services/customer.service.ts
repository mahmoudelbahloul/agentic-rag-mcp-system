import { MOCK_CUSTOMERS } from '../data/customers.data.ts'

class CustomerService {
  static async getLatestCustomers(limit?: number) {
    const sorted = [...MOCK_CUSTOMERS].sort(
      (a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
    )

    if (limit && limit > 0) {
      return sorted.slice(0, limit)
    }

    return sorted
  }

  static async getCustomerById(id: string) {
    return MOCK_CUSTOMERS.find((c) => c._id === id) || null
  }
}

export default CustomerService
