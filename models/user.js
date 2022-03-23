const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    email: {type:String, required:true, unique:true},
    secretToken: String,
    active: Boolean,
    username: {type:String,required:true,unique:true},
    password: {type:String, required:true}
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

const User = mongoose.model('user', userSchema);
module.exports = User;
module.exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSaltSync(10);
        return await bcrypt.hashSync(password, salt);
    } catch(error) {
        throw new Error('Hashing failed', error);
    }
};
module.exports.comparePasswords = async (inputPassword, hashedPassword) => {
    try {
        return await bcrypt.compareSync(inputPassword, hashedPassword);
    } catch(error) {
        throw new Error('Comparing failed', error);
    }
};