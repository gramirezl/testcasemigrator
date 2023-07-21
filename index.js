const fs = require('fs');
const readXlsxFile = require('read-excel-file/node')
const xl = require('excel4node');
const format = require('string-format')
const config = require('./config');
const constants = require('./constants');

const start = async () => {
    format.extend(String.prototype, {})
    //var wb = new xl.Workbook();
    /*
    wb = writeCells(arrayData, wb);
    wb.write('ExcelTest.csv');
    */
    var fileName = `./${config.fileFolder}/${config.fileName}`;
    
    var sheetNameArray = await readExcelSheets(fileName);
    var arrayData = await readExcel(fileName, sheetNameArray);

    var matrixData = GetMatrixData(arrayData);
    writeCsv(`${config.OutputLocation}${config.fileName}.csv`, matrixData);
    
}

async function readExcelSheets(fileName){
  var sheetNameArray = [];
    await readXlsxFile.readSheetNames(fileName).then((sheetNames) => {
      sheetNameArray = sheetNames;      
    });

    return sheetNameArray;
}

async function readExcel(fileName, sheetNameArray){
  
  let sheetRowsMap = {};
  const promises = sheetNameArray.map(async (sheet) => {
    return {
      sheetName: sheet,
      sheetRows: await readXlsxFile(fileName, { sheet:sheet})
    }
  });

  const sheetRowsByResources = await Promise.all(promises);
  
  sheetRowsByResources.forEach (sheetRowsByResource => {
    sheetRowsMap[sheetRowsByResource.sheetName] = sheetRowsByResource.sheetRows
  });

  return sheetRowsMap;
}

function writeCells(excelData, wb){
  var sequenceId = config.sequenceInit;
  var ws = wb.addWorksheet('Casos de prueba');
  var dataToWrite = [];
  dataToWrite.push(constants.azureHeader);

  try{
    for (let sheet in excelData){
      let sheetData = excelData[sheet];

      dataToWrite.push(createAzureTestCaseHeader(sheetData, sequenceId));
      dataToWrite = dataToWrite.concat(writeAzureTestCases(sheetData));
      sequenceId++;
    }

    ws = writeDataToExcel(ws, dataToWrite);
  }
  catch(err){
    console.log(err);
  }

  return wb;
}

function GetMatrixData(excelData){
  var sequenceId = config.sequenceInit;
  var dataToWrite = [];
  dataToWrite.push(constants.azureHeader);

  try{
    for (let sheet in excelData){
      let sheetData = excelData[sheet];

      dataToWrite.push(createAzureTestCaseHeader(sheetData, sequenceId));
      dataToWrite = dataToWrite.concat(writeAzureTestCases(sheetData));
      sequenceId++;
    }
  }
  catch(err){
    console.log(err);
  }

  return dataToWrite;
}

function createAzureTestCaseHeader(sheetData, sequenceId){
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

// The dataToWrite is an array of arrays: [['value1','value2'], ['value3']]
function writeDataToExcel(ws, dataToWrite){
  let row = 1;

  dataToWrite.forEach(rowData => {
    let column = 1;
    rowData.forEach(columnData => {
      ws.cell(row, column).string(columnData);
      column++;
    });

    row++;
  });

  return ws;
}

// The dataToWrite is an array of arrays: [['value1','value2'], ['value3']]
function writeCsv(archivo, data){
  var file = fs.createWriteStream(archivo);

  file.on('error', function(err){
    console.log(err);
  })

  let isFirstRow = true;
  data.forEach(function(v){
    for (let index = 0; index < v.length; index++) {
      let value = v[index].replaceAll('\n', '').replaceAll('"', '');

      if(value.length == 0 || isFirstRow){
        value = index == v.length - 1 ? `${value}` : `${value},` ;  
      }
      else{
        value = index == v.length - 1 ? `\"${value}\"` : `\"${value}\",`;
      }
      
      file.write(value);
    }

      file.write('\n');
      isFirstRow = false;
  });

  file.end;
  console.log("The file was saved! " + archivo);
}

start();