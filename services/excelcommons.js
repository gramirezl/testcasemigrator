const readXlsxFile = require('read-excel-file/node');

var methods = {
    readExcelSheets: async function(fileName){
        var sheetNameArray = [];
        await readXlsxFile.readSheetNames(fileName).then((sheetNames) => {
        sheetNameArray = sheetNames;      
      });
  
        return sheetNameArray;
    },

    readExcel: async function(fileName, sheetNameArray){
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
}

exports.data = methods;