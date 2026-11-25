{
const $=id=>document.getElementById(id);
const fmt=n=>Math.round(n).toLocaleString('en-US');
if($('scene')){
const NS='http://www.w3.org/2000/svg';
const sun=document.getElementById('sun');
let rays='';
for(let i=0;i<12;i++){const a=i*Math.PI/6;const x1=1010+Math.cos(a)*62,y1=80+Math.sin(a)*62,x2=1010+Math.cos(a)*92,y2=80+Math.sin(a)*92;rays+=`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#F5C400" stroke-width="8" stroke-linecap="round"/>`}
sun.innerHTML=rays+'<circle cx="1010" cy="80" r="50" fill="#F5C400"/><circle cx="996" cy="66" r="22" fill="#FFE27A" opacity=".6"/>';
const cells=document.getElementById('cells');
let c='';
for(let i=1;i<5;i++){const t=i/5;c+=`<line x1="${(0+200*t).toFixed(1)}" y1="${(84-50*t).toFixed(1)}" x2="${(10+200*t).toFixed(1)}" y2="${(108-50*t).toFixed(1)}"/>`}
c+='<line x1="5" y1="96" x2="205" y2="46"/>';
cells.innerHTML=c;
const rows=document.getElementById('rows');
let s=7,out='';
const rnd=()=>{s=s*16807%2147483647;return s/2147483647};
const ys=[322,362,404];
ys.forEach((y,ri)=>{
out+=`<rect x="540" y="${y+14}" width="660" height="8" fill="var(--soil2)"/>`;
out+=`<line x1="560" y1="${y+12}" x2="1200" y2="${y+12}" stroke="#16346E" stroke-width="3"/>`;
for(let x=580+ri*14;x<1200;x+=46){
const h=22+rnd()*10;
out+=`<ellipse cx="${x}" cy="${y-h/2+10}" rx="${12+rnd()*4}" ry="${h/2}" fill="#2E8B1E"/>`;
out+=`<ellipse cx="${x-4}" cy="${y-h/2+6}" rx="6" ry="${h/3}" fill="#5BBF3A" opacity=".8"/>`;
if(rnd()>.45)out+=`<circle cx="${x+5}" cy="${y+2}" r="5" fill="#E2412E"/>`;
}
});
out+=`<path d="M560 306 V416" stroke="#16346E" stroke-width="3"/>`;
rows.innerHTML=out;



}
const crops=[
{name:'Tomatoes',ha:0.5,t:8,p:0.90},
{name:'Onions',ha:0.75,t:7,p:1.20},
{name:'Potatoes',ha:0.75,t:5,p:0.88}];
const costs=[['Seed, fertiliser and crop protection',6000],['Packaging and transport',2400],['Labour: 4 paid roles',4800],['Irrigation upkeep and energy',1200],['Admin and other',1600]];
const rev=crops.reduce((a,c)=>a+c.t*1000*c.p,0);
const cost=costs.reduce((a,c)=>a+c[1],0);
const tonnes=crops.reduce((a,c)=>a+c.t,0);
if($('crops')){
$('crops').innerHTML=crops.map(c=>`<tr><td>${c.name}</td><td class="n">${c.ha}</td><td class="n">${c.t}</td><td class="n">${c.p.toFixed(2)}</td><td class="n">${fmt(c.t*1000*c.p)}</td></tr>`).join('')+`<tr class="tot"><td>Total</td><td class="n">${crops.reduce((a,c)=>a+c.ha,0)}</td><td class="n">${tonnes}</td><td class="n">${(rev/tonnes/1000).toFixed(2)}</td><td class="n">${fmt(rev)}</td></tr>`;
}
if($('bars')){
const mx=Math.max(...crops.map(c=>c.t*c.p));
$('bars').innerHTML=crops.map(c=>`<div class="bar"><span>${c.name}</span><div class="track"><div class="fill" style="width:${(c.t*c.p/mx*100).toFixed(1)}%"></div></div><b>$${fmt(c.t*1000*c.p)}</b></div>`).join('');
}
if($('pl')){
$('pl').innerHTML=`<tr><td>Sales revenue</td><td class="n">${fmt(rev)}</td></tr>`+costs.map(c=>`<tr><td>${c[0]}</td><td class="n">−${fmt(c[1])}</td></tr>`).join('')+`<tr class="tot"><td>Operating surplus (${Math.round((rev-cost)/rev*100)}%)</td><td class="n">${fmt(rev-cost)}</td></tr>`;
}
const use=[
['Solar pumping','Solar pump, panels and controller for the existing borehole',2500,'Reliable production water'],
['Drip irrigation','Drip lines, filters and fittings for 2 hectares',1500,'Higher yields, less water and labour'],
['Seeds and fertiliser','First-cycle seed, fertiliser and crop protection',1500,'Agricultural production'],
['Farm equipment','Knapsack sprayers, hand tools, scale and crates',500,'Operational efficiency'],
['Packaging and storage','Grading table, packing materials, shaded store',1000,'Fewer post-harvest losses'],
['Working capital','Wages and transport until the first sales come in',2000,'Continuous production'],
['Market development','Buyer visits, samples and delivery trials',500,'Domestic, then regional sales'],
['Standards and certification','Training and early steps toward produce standards',500,'Future export readiness']];
if($('use-rows')){
const tot=use.reduce((a,u)=>a+u[2],0);
$('use-rows').innerHTML=use.map(u=>`<tr><td><b>${u[0]}</b><br><span class="muted">${u[1]}</span></td><td class="n">${fmt(u[2])}</td><td>${u[3]}</td></tr>`).join('')+`<tr class="tot"><td>Total funding requirement</td><td class="n">${fmt(tot)}</td><td></td></tr>`;
const mx=Math.max(...use.map(u=>u[2]));
if($('ubars'))$('ubars').innerHTML=use.map(u=>`<div class="bar"><span>${u[0]}</span><div class="track"><div class="fill" style="width:${(u[2]/mx*100).toFixed(0)}%"></div></div><b>${Math.round(u[2]/tot*100)}%</b></div>`).join('');
}
if($('sim')){
const D={land:2,yld:10,cyc:1,price:1,opex:16000};
const ids=['land','yld','cyc','price','opex'];
const show={land:v=>v+' ha',yld:v=>v+' t/ha',cyc:v=>v+(v==1?' cycle':' cycles'),price:v=>'US$'+v.toFixed(2),opex:v=>'US$'+fmt(v)};
const calc=()=>{
const v={};ids.forEach(k=>{v[k]=parseFloat($('s-'+k).value);$('o-'+k).textContent=show[k](v[k])});
const t=v.land*v.yld*v.cyc,r=t*1000*v.price,s=r-v.opex,m=r?s/r*100:0,be=t?v.opex/(t*1000):0;
$('r-t').textContent=t.toFixed(1)+' t';
$('r-rev').textContent='US$'+fmt(r);
$('r-sur').textContent=(s<0?'−US$':'US$')+fmt(Math.abs(s));
$('r-sur').dataset.neg=s<0?'1':'0';
$('r-sur-l').textContent=s<0?'Operating loss':'Operating surplus';
$('r-m').textContent=m.toFixed(1)+'%';
$('r-be').textContent='US$'+be.toFixed(2)+' per kg';
const mx=Math.max(r,v.opex,1);
$('b-rev').style.width=(r/mx*100).toFixed(1)+'%';
$('b-cost').style.width=(v.opex/mx*100).toFixed(1)+'%';
try{localStorage.setItem('wygei-sim',JSON.stringify(v))}catch(e){}
};
let saved=null;try{saved=JSON.parse(localStorage.getItem('wygei-sim')||'null')}catch(e){}
ids.forEach(k=>{$('s-'+k).value=(saved&&saved[k]!=null)?saved[k]:D[k];$('s-'+k).addEventListener('input',calc)});
$('sim-reset').addEventListener('click',()=>{ids.forEach(k=>$('s-'+k).value=D[k]);calc()});
calc();
}
const f=$('enq');
if(f){
const t=$('out-text'),err=$('f-err');
f.addEventListener('submit',e=>{
e.preventDefault();
const name=$('f-name').value.trim(),phone=$('f-phone').value.trim(),type=$('f-type').value,msg=$('f-msg').value.trim();
if(!name){err.textContent='Please add your name so we know who to reply to.';$('f-name').focus();return}
err.textContent='';
const text=`Hello WYGEI, my name is ${name}.\nI am interested in: ${type}.${phone?`\nMy phone: ${phone}`:''}${msg?`\n\n${msg}`:''}`;
t.textContent=text;
$('wa').href='https://wa.me/263787597638?text='+encodeURIComponent(text);
$('em').href='mailto:tchikondo@wygei.co.zw?subject='+encodeURIComponent('Enquiry: '+type)+'&body='+encodeURIComponent(text);
$('out').classList.add('show');
});
$('copy').addEventListener('click',async e=>{try{await navigator.clipboard.writeText(t.textContent);e.target.textContent='Copied'}catch(x){e.target.textContent='Select the text above to copy'}});
if(location.hash==='#join'){$('f-type').value='Joining the youth programme'}
if(location.hash==='#buy'){$('f-type').value='Buying fresh produce'}
if(location.hash==='#energy'){$('f-type').value='A borehole or solar power'}
}
for(const tb of document.querySelectorAll('table.stack')){const h=[...tb.tHead.rows[0].cells].map(c=>c.textContent);for(const r of tb.tBodies[0].rows)[...r.cells].forEach((c,i)=>c.dataset.l=h[i])}
}
