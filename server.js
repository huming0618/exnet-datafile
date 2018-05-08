const fs = require('fs');
const net = require('net');
const path = require('path');
const server = net.createServer();

if (process.argv.length !== 3){
    console.error('[Error] No file specified as the input.');
    return;
}

const filePath = path.resolve(process.argv[2]);

if (!fs.existsSync(filePath)){
    console.error(`[Error] File ${filePath} cannpt be found`);
}

const state = fs.statSync(filePath);
console.info(`Input File: ${filePath}`);
console.info(`[Size]: ${Math.floor(state.size/1024/1024/1024)}GB`);

const PORT = 9090;

server.on('connection', (socket)=>{
    var fileStream = fs.createReadStream(filePath);

    fileStream.on('error', (e)=>console.log('error:' + e));
    fileStream.on('open', ()=>fileStream.pipe(socket));
    fileStream.on('finish', ()=>socket.end());
})

server.listen(PORT, ()=>{
    console.log('START....');
})