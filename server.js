const express = require('express')
const dbConnect = require('./dbConnect')
require('dotenv').config()
const app = express()
app.use(express.json())
const path = require('path')
const userRoute = require('./routes/usersRoute')
const transactionsRoute = require('./routes/transactionsRoute')
const productsRoute = require('./routes/productsRoute')
const categoriesRoute = require('./routes/categoriesRoute')
app.use('/api/users/' , userRoute)
app.use('/api/transactions/' , transactionsRoute)
app.use('/api/products/' , productsRoute)
app.use('/api/categories/' , categoriesRoute)

const port =process.env.PORT || 5000

if(process.env.NODE_ENV === 'production')
{
     app.use('/' , express.static('client/build'))

     app.get('*' , (req, res)=>{
         res.sendFile(path.resolve(__dirname, 'client/build/index.html'))
     })
}

app.listen(port, () => console.log(`Inventory application server started at port ${port}.`))