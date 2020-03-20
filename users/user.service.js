const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

async function authenticate({ username, password }) {
    const user = await user.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash )){
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getAll() {
    return await User.find().select('-hash');
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function create(userParam) {
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    if(!user) throw 'User not found';
    if (user.name !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password,10);
    }

    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}


module.eports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};