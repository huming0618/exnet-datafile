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

let byteCount = 0;
let startTS = null;

client.on('data', (data)=>{
    // console.log(`${data.byteLength} is received`);
    byteCount = byteCount + data.byteLength;
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

startTS = Date.now();

setInterval(()=>{
    let ts = Date.now();
    let rate = byteCount/1024/((ts - startTS)/1000);
    console.info(`${(new Date()).toString()}: ${(byteCount/1024/1024).toFixed(2)}MB is reseived, with rate ${rate.toFixed(2)}KB/s`)
}, 10 * 1000)