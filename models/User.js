// подключитьь монгус который дает возомжность создавать модели
const mongoose = require('mongoose');

// создать схему
const Schema = mongoose.Schema;
// создаем настройки для схемы
const userSchema = new Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    nickname: {
        type: String,
        require: false
    }
})


// создаем модель и експортируем

module.exports = mongoose.model('users', userSchema);