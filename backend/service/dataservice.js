const sequelize = require('../config/sequelize.config');
const data = require('../model/data.model');

const getData = async(request, response) => {
    sequelize.sync()
        .then(async () => {
            let data = await data.findAll();
            response.status(200).json(data);
        })
        .catch((error) => console.log('Failed to synchronize with the database', error));
}



module.exports = { getData };