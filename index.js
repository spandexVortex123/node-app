const express = require('express')
const app = express()
const port = 3000
const bodyParse = require('body-parser')
const sequelize = require('./db')

const Note = require('./model/note')
const User = require('./model/user')

Note.sync()
User.sync()

// Middlewares
app.use(bodyParse.json())

app.get('/', (req, res) => {
	(async function () {
		let users = await User.findAll()
		res.json({
			message: 'Hello world',
			users
		})
	})()
})

app.post('/post', (req, res) => {
	let data = req.body
	console.log(data)
	res.send('asdf')
})

app.post('/register', (req, res) => {
	let username = req.body.username
	let password = req.body.password

	try {
		(async function () {
			let user = User.build({ username, password })
			var savedUser = await user.save()

			res.json({
				message: 'User Registered successfully',
				data: savedUser
			})
		})()

	} catch (error) {

	}

})

app.get('/notes', (req, res) => {
	(async function () {
		let notes = await Note.findAll()
		res.json({
			message: 'List of all notes',
			notes: notes
		})
	})()
})

app.post('/addNote', (req, res) => {
	// console.log(req.query["username"])
	let username = req.query.username;
	(async function () {
		let user = await User.findAll({
			where: {
				username: username
			}
		})
		// console.log(user[0].id)
		let note = Note.build({ description: req.body.description })
		let savedNote = await note.save()
		// console.log(savedNote)
		savedNote.update({
			userId: user[0].id
		})
		res.send(user)

	})()
})

app.get('/usernotes', (req, res) => {
	let username = req.query.username;
	(async function () {
		let user = await User.findAll({
			where: {
				username
			}
		})

		let notesList = await Note.findAll({
			where: {
				userId: user[0].id
			}
		})

		res.json({
			message: `Notes list for user ${username}`,
			data: notesList
		})

	})()
})


app.listen(port, () => console.log(`Server started on port ${port}`))