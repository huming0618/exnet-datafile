const fs = require('fs');
const net = require('net');
const path = require('path');
const url = require('url');

const serverInfo = (function(){
    const parsed = url.parse(process.argv[2]);
    return {
        port: parseInt(parsed.port),
        hostname: parsed.hostname
    }
}());

const filePath = path.resolve(process.argv[3]);
const fileStream = fs.createWriteStream(filePath);

const client = new net.Socket();

client.on('data', (data)=>{
    console.log('......');
    fileStream.write(data);
});

client.on('error', (e)=>{
    console.log('Error-', e);
});

client.on('close', ()=>{
    console.log('connection is closed');
});

client.connect({
    port : serverInfo.port,
    host : serverInfo.hostname
});