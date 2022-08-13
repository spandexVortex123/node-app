const { Sequelize } = require('sequelize')
const db = {
    host: 'rpie',
    username: 'nuser',
    password: 'npassword',
    db: 'app'
}

const sequelize = new Sequelize(`mariadb://${db.username}:${db.password}@${db.host}:3306/${db.db}`)

module.exports = sequelize;