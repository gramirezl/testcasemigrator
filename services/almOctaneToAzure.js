const format = require('string-format')
const constants = require('../constants/constants');
const config = require('../config');
const excelReader = require('./excelcommons');
const writeFile = require('./writefiles');

var methods = {
  ConvertOctaneToAzure: async function(){
    format.extend(String.prototype, {})

    var fileName = `./${config.fileFolder}/${config.fileName}`;
    
    var sheetNameArray = await excelReader.data.readExcelSheets(fileName);
    var arrayData = await excelReader.data.readExcel(fileName, sheetNameArray);

    var matrixData = GetMatrixData(arrayData);
    writeFile.data.writeCsv(`${config.OutputLocation}${config.fileName}.csv`, matrixData);
  }
}

function GetMatrixData (excelData){
  var dataToWrite = [];
    dataToWrite.push(constants.azureHeader);
  
    try{
      for (let sheet in excelData){
        let sheetData = excelData[sheet];
  
        dataToWrite.push(createAzureTestCaseHeader(sheetData));
        dataToWrite = dataToWrite.concat(writeAzureTestCases(sheetData));
      }
    }
    catch(err){
      console.log(err);
    }
  
    return dataToWrite;
}

  function createAzureTestCaseHeader(sheetData){
    var arrayData = [];
    let testCaseNameArray = sheetData[0][0].split('-');
  
    arrayData.push('');
    arrayData.push(constants.azureWorkingType);
    arrayData.push(testCaseNameArray[testCaseNameArray.length - 1]);
    arrayData.push('');
    arrayData.push('');
    arrayData.push('');
    arrayData.push(config.AreaPath);
    arrayData.push(config.AssignedTo);
    arrayData.push(constants.azureState);
    return arrayData;
  }
  
  function writeAzureTestCases(sheetData) {
    let initRowData = 3
    let initColumnData = 1;
    let testCaseSequence = 1;
    var arrayMatrix = [];
    var arrayData = [];
    var isValidarInitialized = false;
  
    for (let index = initRowData; index < sheetData.length; index++) {
         
      if (sheetData[index][initColumnData] == 'Normal') {
        if (arrayData.length > 1){
          arrayData.push('');
          arrayData.push('');
          arrayData.push('');
          arrayMatrix.push(arrayData);
        }
  
        arrayData = ['', '', ''];
        arrayData.push(testCaseSequence.toString());
        arrayData.push(sheetData[index][initColumnData + 1].replaceAll(',', ''));
        testCaseSequence++;
        isValidarInitialized = false;
  
        if(index == sheetData.length - 1){
          arrayMatrix.push(arrayData);
        }
      }
      else if(sheetData[index][initColumnData] == 'Validar' && !isValidarInitialized){
        arrayData.push(sheetData[index][initColumnData + 1].replaceAll(',', ''));
        isValidarInitialized = true;      
      }
      else if(sheetData[index][initColumnData] == 'Validar' && isValidarInitialized){
        arrayData[arrayData.length -1] = `${arrayData[arrayData.length -1]} ${sheetData[index][initColumnData + 1].replaceAll(',', '')}`;
      }    
    }
  
    return arrayMatrix;
  }
  
  exports.data = methods;