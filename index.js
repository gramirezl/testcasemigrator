const config = require('./config');
const constants = require('./constants/constants');
const octaneToAzure = require('./services/almOctaneToAzure');

const start = async () => {
    if (config.origin == constants.octaneConstant && config.destiny == constants.azureConstant){
      await octaneToAzure.data.ConvertOctaneToAzure();
    }
}

start();