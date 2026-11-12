let dbPromise;
function db(){if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open('jingxu-studio',1);r.onupgradeneeded=()=>r.result.createObjectStore('projects',{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});return dbPromise;}
async function transaction(mode,work){const d=await db();return new Promise((resolve,reject)=>{const tx=d.transaction('projects',mode);const result=work(tx.objectStore('projects'));let value;result.onsuccess=()=>value=result.result;tx.oncomplete=()=>resolve(value);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('保存被中断'));});}
export const saveProject=p=>transaction('readwrite',s=>s.put(p));
export const loadProject=id=>transaction('readonly',s=>s.get(id));
export const listProjects=()=>transaction('readonly',s=>s.getAll());
export const deleteProject=id=>transaction('readwrite',s=>s.delete(id));
export function readPrefs(){try{return JSON.parse(localStorage.getItem('jingxu-prefs')||'null')||{usage:{},favorites:[],sort:'usage'};}catch{return {usage:{},favorites:[],sort:'usage'};}}
export function savePrefs(p){localStorage.setItem('jingxu-prefs',JSON.stringify(p));}
export function lastProject(id){if(id){localStorage.setItem('jingxu-last-project',id);return id;}return localStorage.getItem('jingxu-last-project');}
