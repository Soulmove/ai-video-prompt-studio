// API keys are opaque credentials. Google, rather than a guessed key pattern,
// decides whether they are valid. Only enforce safe transport and input bounds.
export function normalizeGoogleKey(raw){
 if(typeof raw!=='string')throw Error('请粘贴 Google AI Studio 中的 API 密钥。');
 let key=raw.trim().replace(/^[\u200B-\u200D\uFEFF]+|[\u200B-\u200D\uFEFF]+$/g,'').trim();
 key=key.replace(/^(?:x-goog-api-key\s*:\s*|Bearer\s+)/i,'').trim();
 if(key.length>=2&&((key[0]==='"'&&key.at(-1)==='"')||(key[0]==="'"&&key.at(-1)==="'")))key=key.slice(1,-1).trim();
 if(!key)throw Error('请粘贴 Google AI Studio 中的 API 密钥。');
 if(key.length>8192)throw Error('密钥内容过长。请只复制“API 密钥”，不要复制整段 cURL 命令。');
 if(/\s/.test(key))throw Error('密钥中间有空格或换行。请用 AI Studio 的“复制密钥”按钮重新复制。');
 if(key.length<8||!/^[\x21-\x7E]+$/.test(key)||/[<>"'`]/.test(key))throw Error('密钥内容不完整或含额外字符。请只粘贴 API 密钥本身，是否有效将由 Google 验证。');
 return key;
}
export function normalizeGoogleModel(raw){
 const model=String(raw||'gemini-4-hydrogen').trim().replace(/^models\//,'');
 if(!/^[a-z0-9][a-z0-9.-]{1,100}$/.test(model))throw Error('请填写 Google 模型 ID，例如 gemini-4-hydrogen。');
 return model;
}
export async function readCreationResponse(response){
 const type=response.headers.get('content-type')||'';
 if(!type.includes('application/json'))throw Error(response.status===401||response.status===403||response.redirected?'网站登录已过期，请刷新页面后重新连接。':`服务未返回有效结果（HTTP ${response.status}），请稍后重试。`);
 let data;try{data=await response.json();}catch{throw Error('服务返回内容不完整，请稍后重试。');}
 if(!response.ok)throw Error(data?.error?.message||`请求未完成（HTTP ${response.status}）。`);
 return data;
}
