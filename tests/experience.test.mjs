import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as M from '../dist/model.mjs';
import {workflowSteps,suggestedView,hasCreativeContent,homeMarkup,workflowMarkup,nextStepMarkup} from '../dist/experience.mjs';
import {TEMPLATES} from '../dist/catalog.mjs';

test('an untouched project stays empty when the homepage and creative guidance are displayed',()=>{
 const p=M.makeBlankProject(),before=structuredClone(p);assert.equal(hasCreativeContent(p),false);
 homeMarkup(p);workflowMarkup(p,'characters');workflowSteps(p);assert.deepEqual(p,before);assert.equal(M.generate(p),'');
});
test('the suggested next step follows authored progress and never counts a brief as a finished shot',()=>{
 const p=M.makeBlankProject();p.logline='有人在雨夜送来一封信';assert.equal(suggestedView(p),'characters');
 p.characters.push(M.blankCharacter());assert.equal(suggestedView(p),'style');p.style.look='phone';assert.equal(suggestedView(p),'scenes');
 p.scenes.push(M.blankScene());assert.equal(suggestedView(p),'storyboard');const s=M.makeShot(p);s.action='';p.shots.push(s);assert.equal(workflowSteps(p)[3].done,false);
 s.segments=[{action:'她抬头看向雨窗'}];assert.equal(workflowSteps(p)[3].done,true);
});
test('non-narrative drafts remain discoverable without inventing project content',()=>{
 for(const author of [p=>p.specsChosen=true,p=>p.style.texture=['grain'],p=>p.references.push({id:'r'}),p=>{const s=M.makeShot(p);s.camera={move:'push'};p.shots.push(s);},p=>p.commerce.sellingPoints='棉麻材质']){const p=M.makeBlankProject();author(p);assert.equal(hasCreativeContent(p),true);}
 const p=M.makeBlankProject();p.mode='commerce';assert.equal(suggestedView(p),'commerce');assert.equal(hasCreativeContent(p),false);
});
test('the home page uses real editable templates and does not expose a public works gallery',()=>{
 const p=M.makeBlankProject(),html=homeMarkup(p);for(const id of [...html.matchAll(/data-action="template-preview" data-id="([^"]+)"/g)].map(x=>x[1]))assert.ok(TEMPLATES.some(t=>t.id===id));
 assert.ok(html.includes('暂未开放'));assert.ok(!html.includes('data-action="open-gallery"'));assert.ok(!html.includes('data-action="upload-work"'));
});
test('project names are escaped in the recent project entry',()=>{
 const p=M.makeBlankProject();p.title='<img src=x onerror=alert(1)>';const html=homeMarkup(p,{hasDraft:true});assert.ok(html.includes('&lt;img src=x onerror=alert(1)&gt;'));assert.ok(!html.includes(p.title));
});

test('commerce guidance advances through video stages but does not require a timeline for still images',()=>{
 const p=M.makeBlankProject();p.mode='commerce';p.commerce.output='video';assert.ok(nextStepMarkup(p,'commerce','product').includes('data-value="visual"'));assert.ok(nextStepMarkup(p,'commerce','visual').includes('data-value="timeline"'));
 p.commerce.output='image';assert.ok(!nextStepMarkup(p,'commerce','visual').includes('data-value="timeline"'));assert.ok(nextStepMarkup(p,'commerce','visual').includes('show-final-prompt'));
});
