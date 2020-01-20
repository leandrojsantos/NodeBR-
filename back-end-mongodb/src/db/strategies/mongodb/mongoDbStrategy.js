const ICrud = require('../base/interfaceDb')
const Mongoose = require('mongoose')

const STATUS = {
    0: 'Disconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Disconectando',
}

class MongoDB extends ICrud {

    constructor(connection, schema) {
        super()
        this._connection = connection;
        this._collection = schema;
    }

    async isConnected() {
        const state = STATUS[this._connection.readyState]
        if (state === 'Conectado') return state;

        if (state !== 'Conectando') return state

        await new Promise(resolve => setTimeout(resolve, 1000))

        return STATUS[this._connection.readyState]

    }
    static connect() {
        /**conexao com .env */
        Mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true

        }, function (error) {
            if (!error) return;
            console.log('*****erro conexão MONGODB!', error)
        })
        const connection = Mongoose.connection
        connection.once('open', () => console.log('=> MONGODB OK'))
        return connection;
    }

    async create(item) {
        return this._collection.create(item)
    }
    async read(item = {}) {
        return this._collection.find(item, {
            //user
            username: 1,
            password: 1,
            //file
            name: 1,
            size: 1,
            key: 1,
            url: 1
        })
    }
    async update(id, item) {
        return this._collection.updateOne({
            _id: id
        }, {
            $set: item
        })
    }

    async delete(id) {
        return this._collection.deleteOne({
            _id: id
        })
    }

}

module.exports = MongoDB