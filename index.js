const express = require('express')
const app = express()
const port = 3000
const bodyParse = require('body-parser')

// Middlewares
app.use(bodyParse.json())

app.get('/', (req, res) => {
	res.json({
		message: "hello world"
	})
})

app.post('/post', (req, res) => {
	let data = req.body
	console.log(data)
	res.send('asdf')
})

app.get('/all', (req, res) => {
	// return all users
})

app.listen(port, () => console.log(`Server started on port ${port}`))