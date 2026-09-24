import express from 'express'
import cors from 'cors'
import chatRoutes from './routes/chat.route.ts'
import customerRoutes from './routes/customer.route.ts'
import orderRoutes from './routes/order.route.ts'
import weatherRoutes from './routes/weather.route.ts'


const app = express()


app.use(express.json())
app.use(cors())

app.use('/api', chatRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/weather', weatherRoutes)


const port: number = Number(process.env.PORT) || 3000

app.get('/', (req, res) => {
  res.send('Hello agentic backend')
})

app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`)
})