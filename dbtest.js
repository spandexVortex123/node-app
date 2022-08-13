const { Sequelize } = require('sequelize')

let host = 'rpie'
let username = 'nuser'
let password = 'npassword'
let db = 'app'

const sequelize = new Sequelize(`mariadb://${username}:${password}@${host}:3306/${db}`)

try {
    sequelize.authenticate()
    console.log('connected')
} catch (error) {
    console.log('error', error)
}