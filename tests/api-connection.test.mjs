import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizeGoogleKey,normalizeGoogleModel,readCreationResponse} from '../dist/api-connection.mjs';

test('opaque Google credentials accept punctuation and long authorization-style values without guessing validity',()=>{
 for(const key of ['SYNTHETIC.ABC+def/123=xyz','SYNTHETIC.'+'a'.repeat(1500),'AIza_SYNTHETIC_123456'])assert.equal(normalizeGoogleKey(key),key);
 assert.equal(normalizeGoogleKey(' \n"SYNTHETIC.ABC+def/123="\r\n '),'SYNTHETIC.ABC+def/123=');
 assert.equal(normalizeGoogleKey('x-goog-api-key: SYNTHETIC.ABC+def/123='),'SYNTHETIC.ABC+def/123=');
 assert.equal(normalizeGoogleKey('Bearer SYNTHETIC.ABC+def/123='),'SYNTHETIC.ABC+def/123=');
});
test('transport validation rejects missing, multiline, placeholder and oversized credentials without echoing them',()=>{
 for(const key of ['', 'short', 'SYNTHETIC Key 123', 'SYNTHETIC\nKey123', '<redacted>', '中'.repeat(20), 'x'.repeat(8193)])assert.throws(()=>normalizeGoogleKey(key));
 assert.equal(normalizeGoogleModel('models/gemini-4-hydrogen'),'gemini-4-hydrogen');
 assert.throws(()=>normalizeGoogleModel('https://other.example'));
});
test('client response diagnostics distinguish expired site login, server failures and provider errors',async()=>{
 await assert.rejects(readCreationResponse(new Response('<html>login</html>',{status:403})),/登录已过期/);
 await assert.rejects(readCreationResponse(new Response('oops',{status:502})),/HTTP 502/);
 await assert.rejects(readCreationResponse(new Response(JSON.stringify({error:{message:'Google 额度受限'}}),{status:429,headers:{'Content-Type':'application/json'}})),/额度受限/);
 assert.deepEqual(await readCreationResponse(new Response('{"verified":true}',{headers:{'Content-Type':'application/json'}})),{verified:true});
});
