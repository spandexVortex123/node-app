const { DataTypes } = require('sequelize')
const sequelize = require('../db')
const Note = require('./note')

const User = sequelize.define('users', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user'
    }
}, {
    tableName: 'users'
})

User.hasMany(Note, { as: 'notes' })

module.exports = User;