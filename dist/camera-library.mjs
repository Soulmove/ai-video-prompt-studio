import {uid,clone,cameraDefaults} from './model.mjs';
export function makeCameraTemplate(project,name,draft,id=uid()){
 name=String(name||'').trim();if(!name)throw Error('请先给摄影预选命名。');
 const camera={};for(const key of Object.keys(cameraDefaults()))if(draft[key]!==undefined)camera[key]=clone(draft[key]);
 if(!camera.framing&&!camera.move&&!camera.lens&&!camera.focus)throw Error('请至少选择景别、运镜、镜头观感或对焦。');
 const catalog={};for(const [key,options] of Object.entries(project.customOptions||{})){const used=options.filter(x=>camera[key]===x.id);if(used.length)catalog[key]=clone(used);}
 return {id,name:name.slice(0,60),camera,catalog,updatedAt:Date.now()};
}
export function mergeCameraCatalog(project,template){project.customOptions??={};for(const [key,options] of Object.entries(template.catalog||{})){project.customOptions[key]??=[];for(const option of options)if(!project.customOptions[key].some(x=>x.id===option.id))project.customOptions[key].push(clone(option));}}
export function applyCameraTemplate(project,shot,template){if(!template?.camera)throw Error('摄影预选不存在。');mergeCameraCatalog(project,template);shot.camera=clone(template.camera);shot.cameraPresetId=template.id;shot.cameraPresetName=template.name;}
export function clearShotCamera(shot){shot.camera={};delete shot.cameraPresetId;delete shot.cameraPresetName;}
