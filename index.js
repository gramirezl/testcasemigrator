const config = require('./config');
const constants = require('./constants/constants');
const octaneToAzure = require('./services/almOctaneToAzure');

const start = async () => {
    if (config.Origin == constants.octaneConstant && config.Destiny == constants.azureConstant){
      await octaneToAzure.data.ConvertOctaneToAzure();
    }
}

start();