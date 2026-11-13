import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const base=path.join(path.dirname(fileURLToPath(import.meta.url)),'dist');
const mime={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp'};
const server=http.createServer((req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const target=path.resolve(base,'.'+(pathname==='/'?'/index.html':pathname));if(!target.startsWith(base+path.sep)){res.writeHead(403);return res.end('Forbidden');}if(!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});fs.createReadStream(target).pipe(res);}catch{res.writeHead(400);res.end('Bad request');}});
server.listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${server.address().port}`));
