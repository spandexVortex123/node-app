const express = require('express')
const app = express()
const port = 3000
const bodyParse = require('body-parser')
const jwt = require('jsonwebtoken')
const md5 = require('md5')
const secret = 'jwtsecret'

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

app.post('/login', (req, res) => {

	if (!req.body.username || !req.body.password) {
		res.json({
			message: 'Username/Password cannot be empty'
		})
	} else {
		let username = req.body.username
		let password = req.body.password

		let passwordHash = md5(password);

		(async function () {
			let user = await User.findAll({
				where: {
					username,
					password: passwordHash
				}
			})

			if (!user[0]) {
				res.json({
					message: 'Username/Password incorrect'
				})
			} else {
				let { id, password, createdAt, updatedAt, ...data } = user[0].dataValues;
				// console.log(data)
				let token = jwt.sign(data, secret, {
					expiresIn: '300s'
				})
				res.json({
					message: 'Login successful',
					token
				})
			}

		})()
		// res.send('asdf')
	}
})

app.post('/register', (req, res) => {

	if (!req.body.username && !req.body.password) {
		res.json({
			message: 'Username/Password cannot be empty'
		})
	} else {
		let username = req.body.username
		let password = md5(req.body.password)

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

	if (req.headers.authorization) {

		let token = req.headers.authorization.split(' ')[1]

		try {
			let data = jwt.verify(token, secret);
			// console.log(data)
			if (data.username === req.query.username) {
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
					res.json({
						message: 'Note added successfully'
					})
				})()
			} else {
				res.json({
					message: 'Username incorrect'
				})
			}
		} catch (error) {
			res.json({
				message: error.message
			})
		}
	} else {
		res.json({
			message: 'Token not present in header'
		})
	}
})

app.get('/usernotes', (req, res) => {

	if (!req.headers.authorization) {
		res.json({
			message: 'Token not present'
		})
	} else {
		let token = req.headers.authorization.split(' ')[1];
		try {
			let data = jwt.verify(token, secret);
			(async function () {
				let user = await User.findAll({
					where: {
						username: data.username
					}
				})
				let notesList = await Note.findAll({
					where: {
						userId: user[0].id
					}
				})
				res.json({
					message: `Notes list for user ${data.username}`,
					data: notesList
				})
			})()
		} catch (error) {
			res.json({
				message: error.message
			})
		}
	}
})

app.listen(port, () => console.log(`Server started on port ${port}`))