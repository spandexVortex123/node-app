const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const Note = sequelize.define('note', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    description: {
        type: DataTypes.STRING,
    },
    isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'notes'
})

module.exports = Note;