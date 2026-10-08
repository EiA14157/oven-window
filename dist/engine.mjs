// Pure, deterministic one-minute constraint solver. No network or recipe inference.
export function validate(model) {
 const e=[]; const int=(n,a,b)=>Number.isInteger(n)&&n>=a&&n<=b;
 if(!int(model.serve,0,1439)) e.push('Choose a valid serving time.');
 if(!int(model.capacity,1,6)) e.push('Oven capacity must be 1–6 slots.');
 if(!int(model.buffer,0,120)) e.push('Heat-change time must be 0–120 whole minutes.');
 if(!['F','C'].includes(model.unit)) e.push('Choose Fahrenheit or Celsius.');
 if(!Array.isArray(model.dishes)||model.dishes.length<1||model.dishes.length>6) return [...e,'Add 1–6 dishes.'];
 model.dishes.forEach((d,i)=>{const p=`Dish ${i+1}`;
 if(typeof d.name!=='string'||!d.name.trim()||d.name.length>80)e.push(`${p}: enter a name (80 characters maximum).`);
 if(!int(d.duration,1,720))e.push(`${p}: oven time must be 1–720 whole minutes.`);
 if(!Number.isFinite(d.temp)||d.temp<(model.unit==='F'?32:0)||d.temp>(model.unit==='F'?752:400))e.push(`${p}: enter an oven setting between ${model.unit==='F'?'32–752°F':'0–400°C'}.`);
 if(!int(d.slots,1,6))e.push(`${p}: pan space must be 1–6 slots.`);
 if(!int(d.rest,0,360)||!int(d.early,0,360)||d.early<d.rest)e.push(`${p}: finish window must be 0–360 whole minutes, with maximum at least minimum.`);
 });return e;
}
export function compatible(a,b,m){
 if(a.start<b.end&&b.start<a.end)return a.temp===b.temp&&a.slots+b.slots<=m.capacity;
 const gap=a.end<=b.start?b.start-a.end:a.start-b.end;
 return a.temp===b.temp||gap>=m.buffer;
}
export function fits(candidate,placed,m){
 if(placed.some(p=>!compatible(candidate,p,m)))return false;
 const list=[...placed,candidate];
 const marks=list.flatMap(p=>[{t:p.start,n:p.slots},{t:p.end,n:-p.slots}]).sort((a,b)=>a.t-b.t||a.n-b.n);
 let used=0;for(const mark of marks){used+=mark.n;if(used>m.capacity)return false;}return true;
}
export function solve(m,limit=180000){
 const errors=validate(m);if(errors.length)return {status:'invalid',errors};
 const over=m.dishes.find(d=>d.slots>m.capacity);if(over)return {status:'impossible',reason:`${over.name} needs ${over.slots} slots, but your oven has ${m.capacity}.`,nodes:0};
 const domains=m.dishes.map((d,id)=>{const options=[];for(let end=m.serve-d.rest;end>=m.serve-d.early;end--)options.push({...d,id,start:end-d.duration,end});return {id,options};});
 let nodes=0,limited=false;
 const search=(remaining,placed)=>{
 if(!remaining.length)return placed;
 let choice=null,opts=null;
 for(const r of remaining){const possible=[];for(const x of r.options){if(++nodes>limit){limited=true;return null;}if(fits(x,placed,m))possible.push(x);}if(!possible.length)return null;if(opts===null||possible.length<opts.length){choice=r;opts=possible;}}
 for(const x of opts){const answer=search(remaining.filter(r=>r!==choice),[...placed,x]);if(answer)return answer;if(limited)return null;}return null;
 };
 const result=search(domains,[]);
 if(result)return {status:'ok',items:result.sort((a,b)=>a.start-b.start||a.id-b.id),nodes};
 if(limited)return {status:'unknown',reason:'The search limit was reached. This does not mean your menu is impossible. Try fewer dishes or narrower finish windows, then check again.',nodes};
 let reason='No schedule satisfies all of these inputs on a one-minute timeline. The result applies only to this simplified oven model.';
 for(let i=0;i<domains.length;i++)for(let j=i+1;j<domains.length;j++){
 if(!domains[i].options.some(a=>domains[j].options.some(b=>compatible(a,b,m))))return {status:'impossible',reason:`${m.dishes[i].name} and ${m.dishes[j].name} cannot both fit their finish windows with the entered temperature, space and heat-change constraints.`,nodes};
 }
 return {status:'impossible',reason,nodes};
}
export function timeLabel(t){const day=Math.floor(t/1440);const n=((t%1440)+1440)%1440;const h=Math.floor(n/60);return `${h%12||12}:${String(n%60).padStart(2,'0')} ${h<12?'AM':'PM'}${day<0?` (${Math.abs(day)} day${day<-1?'s':''} before)`:day>0?` (+${day} day)`:''}`;}
export function actions(items,m){
 const out=[];if(!items.length)return out;
 const ordered=[...items].sort((a,b)=>a.start-b.start);out.push({time:ordered[0].start-m.buffer,text:`Begin preheat to ${ordered[0].temp}°${m.unit}. Confirm the oven is ready before loading.`});
 let lastTemp=ordered[0].temp;
 for(const item of ordered){if(item.temp!==lastTemp){out.push({time:item.start-m.buffer,text:`Allow ${m.buffer} min to change the oven to ${item.temp}°${m.unit}.`});lastTemp=item.temp;}out.push({time:item.start,text:`IN: ${item.name} · ${item.temp}°${m.unit} · ${item.duration} min · ${item.slots} slot${item.slots===1?'':'s'}`});out.push({time:item.end,text:`OUT / CHECK: ${item.name} · ${m.serve-item.end} min until serving. Check doneness with your recipe and a food thermometer where required.`});}
 out.push({time:m.serve,text:'Serving time. Verify food is ready and has been handled safely; the clock cannot do this.'});return out.sort((a,b)=>a.time-b.time);
}
