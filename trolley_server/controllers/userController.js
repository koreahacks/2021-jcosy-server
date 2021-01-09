const UserModel = require('../models/userModel');

const user = {
    readAll: async (req, res) => {
        const todos = await Todo.findAll();
        try {
            if (!todos.length) {
                return res.status(404).send({err: 'Todo not found'});
            }
            // 보기 좋게 출력
            res.status(200).send(todos);
        } catch (err) {
            res.status(500).send(err);
        }
    }
}

module.exports = user;