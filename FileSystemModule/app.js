const fs = require('fs');

fs.readdir('./',(err,files)=>{
    if(err){
        console.error("Error:",err);
    }
    else{
        console.log('Files:',files);
    }
});