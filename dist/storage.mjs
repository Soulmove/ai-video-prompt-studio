let dbPromise;
function db(){if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open('jingxu-studio',1);r.onupgradeneeded=()=>r.result.createObjectStore('projects',{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});return dbPromise;}
async function transaction(mode,work){const d=await db();return new Promise((resolve,reject)=>{const tx=d.transaction('projects',mode);const result=work(tx.objectStore('projects'));let value;result.onsuccess=()=>value=result.result;tx.oncomplete=()=>resolve(value);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||Error('保存被中断'));});}
export function isDeletedSnapshot(p,ids=[],clearedAt=0){return ids.includes(p.id)||(Number(clearedAt)>0&&Number(p.createdAt||0)<=Number(clearedAt));}
export function projectWasDeleted(p){try{return isDeletedSnapshot(p,JSON.parse(localStorage.getItem('jingxu-deleted-projects')||'[]'),Number(localStorage.getItem('jingxu-cleared-at')||0));}catch{return false;}}
export const saveProject=p=>projectWasDeleted(p)?Promise.reject(Error('此项目已被删除，请复制为新项目后保存。')):transaction('readwrite',s=>s.put(p));
export const loadProject=id=>transaction('readonly',s=>s.get(id));
export const listProjects=()=>transaction('readonly',s=>s.getAll());
export async function deleteProject(id){const old=localStorage.getItem('jingxu-deleted-projects');const ids=JSON.parse(old||'[]');localStorage.setItem('jingxu-deleted-projects',JSON.stringify([...new Set([...ids,id])]));try{await transaction('readwrite',s=>s.delete(id));}catch(e){old===null?localStorage.removeItem('jingxu-deleted-projects'):localStorage.setItem('jingxu-deleted-projects',old);throw e;}}
export async function clearProjects(){const old=localStorage.getItem('jingxu-cleared-at');localStorage.setItem('jingxu-cleared-at',String(Date.now()));try{await transaction('readwrite',s=>s.clear());}catch(e){old===null?localStorage.removeItem('jingxu-cleared-at'):localStorage.setItem('jingxu-cleared-at',old);throw e;}}
export const clearLastProject=()=>localStorage.removeItem('jingxu-last-project');
export function readPrefs(){try{return JSON.parse(localStorage.getItem('jingxu-prefs')||'null')||{usage:{},favorites:[],sort:'usage'};}catch{return {usage:{},favorites:[],sort:'usage'};}}
export function savePrefs(p){localStorage.setItem('jingxu-prefs',JSON.stringify(p));}
export function lastProject(id){if(id){localStorage.setItem('jingxu-last-project',id);return id;}return localStorage.getItem('jingxu-last-project');}
