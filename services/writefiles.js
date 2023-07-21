const fs = require('fs');

var methods = {
    // The dataToWrite is an array of arrays: [['value1','value2'], ['value3']]
    writeCsv: function (archivo, data){
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
}

exports.data = methods;