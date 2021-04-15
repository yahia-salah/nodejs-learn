const http = require('http');
const server = http.createServer((req,res)=>{
    if(req.url==="/"){
        res.write('Hello World!');
    }
    else if(req.url==='/api/courses'){
        res.write(JSON.stringify([{name:"One"},{name:"Two"},{name:"Three"}]));
    }
    res.end();
});

server.listen(3000);

console.log('Listening on port 3000...');
