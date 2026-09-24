import express from 'express'
import cors from 'cors'
import chatRouter from './src/chatRouter.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Chat app backend is running')
})

app.use('/api', chatRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})