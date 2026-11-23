/* ============ 医械管家 · 真实盘点数据版 ============ */
const RAW=window.REAL_DATA;
const DEV=RAW.devices, META=RAW.meta;

/* ---- 增量持久化（不重复存储1.9MB基础数据）---- */
const LS='medReal_v1';
function loadLocal(){try{return JSON.parse(localStorage.getItem(LS))||{}}catch(e){return{}}}
let LOCAL=loadLocal();
LOCAL.ov=LOCAL.ov||{};LOCAL.add=LOCAL.add||[];LOCAL.del=LOCAL.del||[];
LOCAL.repairs=LOCAL.repairs||null;LOCAL.maint=LOCAL.maint||null;LOCAL.insp=LOCAL.insp||null;LOCAL.act=LOCAL.act||null;
function persist(){try{localStorage.setItem(LS,JSON.stringify(LOCAL))}catch(e){toast('本地存储空间不足',true)}}
function applyLocal(){
  DEV.forEach(d=>{if(LOCAL.ov[d.id])Object.assign(d,LOCAL.ov[d.id])});
  if(LOCAL.del.length)for(let i=DEV.length-1;i>=0;i--)if(LOCAL.del.includes(DEV[i].id))DEV.splice(i,1);
  if(LOCAL.add.length)LOCAL.add.forEach(d=>DEV.unshift(d));
}
applyLocal();

/* ---- 业务演示数据（真实表不含工单/保养/巡检业务流）---- */
function seedBiz(){return{
  repairs:[
    {id:'WX-2026-018',devId:'CN320170900006',devName:'病人监护仪',fault:'导联脱落报警，无法持续监测',reporter:'护士站',date:'2026-11-20',assign:'王工程师',status:'维修中',priority:'紧急',cost:0},
    {id:'WX-2026-017',devId:'ZY0-2638',devName:'腹腔镜（摄像系统主机）',fault:'画面间歇闪烁（科室报闲置后复检发现）',reporter:'手术室',date:'2026-11-18',assign:'',status:'待派工',priority:'一般',cost:0},
    {id:'WX-2026-016',devId:'CN320180400038',devName:'高清腹腔镜',fault:'冷光源亮度衰减',reporter:'手术室',date:'2026-11-15',assign:'赵工程师',status:'已完成',priority:'一般',cost:1200}
  ],
  maint:[
    {id:'BY-2026-042',devId:'CN320170900006',devName:'病人监护仪',type:'季度保养',plan:'2026-11-28',done:'',executor:'',status:'待执行',content:'导联性能检测、电池校准'},
    {id:'BY-2026-041',devId:'ZY0-2638',devName:'腹腔镜（摄像系统主机）',type:'年度保养',plan:'2026-11-18',done:'',executor:'',status:'已逾期',content:'光路清洁、摄像系统校准'}
  ],
  insp:[
    {id:'XJ-2026-022',devId:'CN320180400038',devName:'高清腹腔镜',dept:'手术室',inspector:'设备科',date:'2026-11-22',result:'正常',note:'图像清晰，成套组件齐全'},
    {id:'XJ-2026-021',devId:'ZY0-2638',devName:'腹腔镜（摄像系统主机）',dept:'手术室',inspector:'设备科',date:'2026-11-20',result:'异常',note:'闲置状态，建议调剂或封存'}
  ],
  act:[
    {time:'11-20 14:32',txt:'<b>王工程师</b> 更新了工单 WX-2026-018 为「维修中」'},
    {time:'11-20 10:15',txt:'<b>设备科</b> 完成本周资产盘点数据更新'},
    {time:'11-19 16:48',txt:'<b>系统</b> 检测到 <b>97</b> 台科室闲置设备（红色标记）'},
    {time:'11-18 09:20',txt:'<b>手术室</b> 提交腹腔镜主机故障复检'}
  ]
}}
if(!LOCAL.repairs){const b=seedBiz();LOCAL.repairs=b.repairs;LOCAL.maint=b.maint;LOCAL.insp=b.insp;LOCAL.act=b.act;persist()}

/* ============ ICONS ============ */
const I={
 dashboard:'<path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>',
 device:'<path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 12H9V9h2v6zm4 0h-2V7h2v8zm4 0h-2v-4h2v4z"/>',
 check:'<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>',
 maintenance:'<path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.5.5 0 00.12-.64l-1.92-3.32a.5.5 0 00-.61-.22l-2.39.96a7.03 7.03 0 00-1.62-.94l-.36-2.54a.48.48 0 00-.48-.41h-3.84a.48.48 0 00-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.5.5 0 00-.61.22L2.7 8.84a.5.5 0 00.12.64l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.5.5 0 00-.12.64l1.92 3.32c.12.22.38.3.61.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.04.24.24.41.48.41h3.84c.24 0 .44-.17.48-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.23.08.49 0 .61-.22l1.92-3.32a.5.5 0 00-.12-.64l-2.02-1.58zM12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z"/>',
 repair:'<path d="M22.7 19l-9.1-9.1c.4-1.5.1-3.1-.9-4.2-1.4-1.4-3.6-1.4-5 0l1.4 1.4c.8.8.8 2 0 2.8-.4.4-.9.6-1.4.6s-1-.2-1.4-.6L4.7 13.4c-1.4 1.4-1.4 3.6 0 5 1.1 1 2.7 1.3 4.2.9L18 28.1l4.7-4.7z"/>',
 inspection:'<path d="M9 11.4l3 3 7.6-7.6-1.4-1.4L12 11.6 10.4 10 9 11.4zm0 6l-3-3-3 3 3 3 3-3z"/>',
 supplier:'<path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>',
 report:'<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>',
 settings:'<path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.5.5 0 00.12-.64l-1.92-3.32a.5.5 0 00-.61-.22l-2.39.96a7.03 7.03 0 00-1.62-.94l-.36-2.54a.48.48 0 00-.48-.41h-3.84a.48.48 0 00-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.5.5 0 00-.61.22L2.7 8.84a.5.5 0 00.12.64l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.5.5 0 00-.12.64l1.92 3.32c.12.22.38.3.61.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.04.24.24.41.48.41h3.84c.24 0 .44-.17.48-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.23.08.49 0 .61-.22l1.92-3.32a.5.5 0 00-.12-.64l-2.02-1.58zM12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z"/>',
 plus:'<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>',
 search:'<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>',
 warn:'<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>',
 clock:'<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>',
 box:'<path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 12H9V9h2v6zm4 0h-2V7h2v8z"/>',
 trash:'<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>',
 edit:'<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>',
 x:'<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>',
 arrow:'<path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>',
 refresh:'<path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>',
 calendar:'<path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>',
 hospital:'<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-3v3h-4v-3H7v-4h3V6h4v3h3v4z"/>',
 export:'<path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>',
 filter:'<path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>',
 clipboard:'<path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>'
};
const svg=(p,c='')=>`<svg viewBox="0 0 24 24" class="${c}">${p}</svg>`;

/* ============ 工具 ============ */
function money(n){return '¥'+Number(n||0).toLocaleString('zh-CN',{maximumFractionDigits:0})}
function moneyW(n){const v=Number(n||0)/10000;return v>=10000?(v/10000).toFixed(2)+'亿':v.toFixed(1)+'万'}
function statusTag(s){const m={'账实相符':'tag-green','台无实有':'tag-red','台有实无':'tag-orange','已报废':'tag-gray','未标注':'tag-gray','在用':'tag-green','维修中':'tag-red','待派工':'tag-orange','已完成':'tag-green','待执行':'tag-blue','已逾期':'tag-red','正常':'tag-green','异常':'tag-red','紧急':'tag-red','一般':'tag-blue'};return `<span class="tag ${m[s]||'tag-gray'}">${s}</span>`}
function flagTag(f){const m={idle:'<span class="tag tag-red"><span class="flag-dot flag-idle"></span>科室闲置</span>',highfail:'<span class="tag tag-orange"><span class="flag-dot flag-highfail"></span>故障率高</span>',special:'<span class="tag tag-purple"><span class="flag-dot flag-special"></span>特殊约定</span>'};return m[f]||''}
function toast(msg,err=false){const box=document.getElementById('toastBox');const el=document.createElement('div');el.className='toast'+(err?' err':'');el.innerHTML=svg(err?I.warn:I.check)+'<span>'+msg+'</span>';box.appendChild(el);setTimeout(()=>{el.style.opacity='0';el.style.transition='.2s';setTimeout(()=>el.remove(),200)},2600)}
function openModal(title,body,foot){document.getElementById('modal').innerHTML=`<div class="modal-head"><h3>${title}</h3><div class="x" onclick="closeModal()">${svg(I.x)}</div></div><div class="modal-body">${body}</div><div class="modal-foot">${foot}</div>`;document.getElementById('overlay').classList.add('show')}
function closeModal(){document.getElementById('overlay').classList.remove('show')}
document.getElementById('overlay').addEventListener('click',e=>{if(e.target.id==='overlay')closeModal()});
function confirmBox(msg,cb){openModal('确认操作',`<p style="font-size:13px;line-height:1.7;color:var(--muted)">${msg}</p>`,`<button class="btn" onclick="closeModal()">取消</button><button class="btn btn-danger" id="confirmYes">确认</button>`);document.getElementById('confirmYes').onclick=()=>{closeModal();cb()}}
function addAct(txt){LOCAL.act.unshift({time:'刚刚',txt});if(LOCAL.act.length>30)LOCAL.act.pop();persist()}

/* ============ 导航 ============ */
const pages=[
 {id:'dashboard',name:'工作台',icon:I.dashboard,title:'工作台'},
 {id:'inventory',name:'设备台账',icon:I.device,title:'设备台账（真实盘点数据）'},
 {id:'stocktake',name:'资产盘点',icon:I.clipboard,title:'资产盘点作业'},
 {id:'check',name:'盘点核查',icon:I.check,title:'盘点核查'},
 {id:'repairs',name:'维修工单',icon:I.repair,title:'维修工单'},
 {id:'maintenance',name:'维护保养',icon:I.maintenance,title:'维护保养'},
 {id:'inspections',name:'设备巡检',icon:I.inspection,title:'设备巡检'},
 {id:'suppliers',name:'供应商',icon:I.supplier,title:'供应商分析'},
 {id:'reports',name:'统计报表',icon:I.report,title:'统计报表'},
 {id:'settings',name:'系统设置',icon:I.settings,title:'系统设置'}
];
const mobilePages=['dashboard','stocktake','inventory','check','reports'];
let currentPage='dashboard';
let notifOpen=false;

function renderNav(){
 const pending=LOCAL.repairs.filter(r=>r.status!=='已完成').length;
 document.getElementById('navList').innerHTML='<div class="nav-label">资产盘点</div>'+pages.map((p,i)=>{
   const badge=(p.id==='repairs'&&pending)?`<span class="nav-badge">${pending}</span>`:'';
   const sep=i===4?'<div class="nav-label" style="margin-top:10px">业务运营</div>':i===8?'<div class="nav-label" style="margin-top:10px">系统</div>':'';
   return sep+`<div class="nav-item ${currentPage===p.id?'active':''}" onclick="go('${p.id}')">${svg(p.icon)}<span>${p.name}</span>${badge}</div>`;
 }).join('');
 document.getElementById('mobileNav').innerHTML=mobilePages.map(id=>{const p=pages.find(x=>x.id===id);return `<div class="mi ${currentPage===id?'active':''}" onclick="go('${id}')">${svg(p.icon)}<span>${p.name.replace('工作台','首页').replace('设备台账','设备').replace('盘点核查','核查').replace('统计报表','报表')}</span></div>`}).join('');
}
function go(p){currentPage=p;closeSidebar();render();window.scrollTo(0,0)}
function openSidebar(){document.getElementById('sidebar').classList.add('open');document.getElementById('overlaySidebar').classList.add('show')}
function closeSidebar(){document.getElementById('sidebar').classList.remove('open');document.getElementById('overlaySidebar').classList.remove('show')}

function getAlerts(){
 const a=[];
 if(META.flag.find(x=>x[0]==='idle'))a.push({type:'资产盘点',level:'danger',text:`发现 ${META.flag.find(x=>x[0]==='idle')[1]} 台科室闲置设备，建议调剂处置`,icon:I.warn,page:'check',t:'闲置设备'});
 if(META.flag.find(x=>x[0]==='highfail'))a.push({type:'资产盘点',level:'warning',text:`${META.flag.find(x=>x[0]==='highfail')[1]} 台设备故障率较高，建议重点巡检`,icon:I.maintenance,page:'check',t:'故障率较高'});
 const no=(META.status.find(x=>x[0]==='台有实无')||[])[1]||0;
 if(no)a.push({type:'账实核查',level:'danger',text:`${no} 台资产「台有实无」，需线下核实追查`,icon:I.warn,page:'check',t:'台有实无'});
 const have=(META.status.find(x=>x[0]==='台无实有')||[])[1]||0;
 if(have)a.push({type:'账实核查',level:'warning',text:`${have} 台资产「台无实有」，需补录台账`,icon:I.box,page:'check',t:'台无实有'});
 LOCAL.repairs.filter(r=>r.status!=='已完成').forEach(r=>a.push({type:'待处理工单',level:r.priority==='紧急'?'danger':'warning',text:`${r.devName}：${r.fault}`,icon:I.repair,page:'repairs',t:'工单'}));
 return a;
}

/* ============ 渲染入口 ============ */
function render(){
 document.getElementById('pageTitle').textContent=pages.find(p=>p.id===currentPage)?.title||'工作台';
 renderNav();
 const fn={dashboard:renderDashboard,inventory:renderInventory,stocktake:renderStocktake,check:renderCheck,repairs:renderRepairs,maintenance:renderMaintenance,inspections:renderInspections,suppliers:renderSuppliers,reports:renderReports,settings:renderSettings}[currentPage];
 document.getElementById('content').innerHTML=fn?fn():'';
 document.getElementById('alertDot').style.display=getAlerts().length?'block':'none';
 if(notifOpen&&currentPage==='dashboard')renderNotifPanel();
}

/* ---- 工作台 ---- */
function renderDashboard(){
 const ok=(META.status.find(x=>x[0]==='账实相符')||[])[1]||0;
 const idle=(META.flag.find(x=>x[0]==='idle')||[])[1]||0;
 const no=(META.status.find(x=>x[0]==='台无实有')||[])[1]||0;
 const cats=META.catTop.slice(0,7),colors=['#3b82f6','#14b8a6','#f59e0b','#8b5cf6','#ef4444','#ec4899','#06b6d4'];
 return `
 <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:4px"><div class="section-title">青岛西海岸新区人民医院 · 资产概览</div><span class="src-badge">${svg(I.check)}真实盘点数据</span></div>
 <div class="section-sub">数据来源：${META.source}　|　盘点时间 2026.10.28</div>
 <div class="stock-banner mb16" onclick="go('stocktake')">
  <div class="sb-deco sb-deco1"></div><div class="sb-deco sb-deco2"></div>
  <div class="sb-icon">${svg(I.clipboard)}</div>
  <div class="sb-main">
   <div class="sb-tag">📋 资产盘点作业</div>
   <div class="sb-title">开始一轮资产盘点</div>
   <div class="sb-desc">按科室逐台核对账实状态，实时记录盘盈盘亏，自动生成盘点表</div>
  </div>
  <div class="sb-stats">
   <div><b>${META.total.toLocaleString()}</b><span>待盘点资产</span></div>
   <div><b>${META.deptCount}</b><span>覆盖科室</span></div>
   <div><b>${getStockProgress().done}</b><span>本轮已盘</span></div>
  </div>
  <div class="sb-btn">${getStockProgress().done>0?'继续盘点':'开始盘点'} ${svg(I.arrow)}</div>
 </div>
 <div class="grid g4 mb16">
  <div class="card stat"><div class="label">在账资产总数</div><div class="value">${META.total.toLocaleString()}</div><div class="delta">覆盖 <b>${META.deptCount}</b> 个科室</div><div class="ic ic-blue">${svg(I.box)}</div></div>
  <div class="card stat"><div class="label">资产总原值</div><div class="value" style="font-size:25px">${moneyW(META.totalValue)}</div><div class="delta">账面原值合计</div><div class="ic ic-teal">${svg(I.report)}</div></div>
  <div class="card stat"><div class="label">账实相符</div><div class="value" style="color:var(--success)">${ok.toLocaleString()}</div><div class="delta">占比 <b>${(ok/META.total*100).toFixed(1)}%</b></div><div class="ic ic-green">${svg(I.check)}</div></div>
  <div class="card stat"><div class="label">需关注资产</div><div class="value" style="color:var(--danger)">${(META.total-ok).toLocaleString()}</div><div class="delta">闲置 <b class="up">${idle}</b> · 异常 <b class="up">${no}</b></div><div class="ic ic-red">${svg(I.warn)}</div></div>
 </div>
 <div class="grid g-2-1 mb16">
  <div class="card"><div class="card-head"><h3>资产类别分布 TOP7</h3><span class="sub">共 ${META.catCount} 类</span></div><div class="card-body">
   ${cats.map((x,i)=>`<div class="bar-row"><div class="name">${x[0].slice(0,6)}</div><div class="bar-track"><div class="bar-fill" style="width:${x[1]/cats[0][1]*100}%;background:${colors[i]}"></div></div><div class="num">${x[1]}</div></div>`).join('')}
  </div></div>
  <div class="card"><div class="card-head"><h3>盘点预警</h3><span class="sub" style="cursor:pointer;color:var(--primary)" onclick="notifOpen=true;render()">全部 →</span></div><div class="card-body" style="padding-top:6px">
   ${getAlerts().slice(0,5).map(x=>`<div class="alert-row"><div class="alert-ic" style="background:${x.level==='danger'?'#fef2f2':'#fffbeb'}">${svg(x.icon,x.level==='danger'?'fill:#dc2626':'fill:#d97706')}</div><div class="t"><b>${x.text}</b><span>${x.type}</span></div></div>`).join('')}
  </div></div>
 </div>
 <div class="grid g2">
  <div class="card"><div class="card-head"><h3>快速入口</h3></div><div class="card-body"><div class="quick-actions">
   <div class="qa" onclick="go('stocktake')"><div class="qi ic-red">${svg(I.clipboard)}</div>资产盘点</div>
   <div class="qa" onclick="go('check')"><div class="qi ic-orange">${svg(I.check)}</div>盘点核查</div>
   <div class="qa" onclick="go('inventory')"><div class="qi ic-blue">${svg(I.search)}</div>查找设备</div>
   <div class="qa" onclick="go('repairs');setTimeout(()=>openRepairModal(),100)"><div class="qi ic-orange">${svg(I.repair)}</div>创建报修</div>
   <div class="qa" onclick="go('reports')"><div class="qi ic-green">${svg(I.export)}</div>导出台账</div>
  </div></div></div>
  <div class="card"><div class="card-head"><h3>最近动态</h3></div><div class="card-body"><div class="timeline">
   ${LOCAL.act.slice(0,5).map(a=>`<div class="tl-item"><div class="time">${a.time}</div><div class="txt">${a.txt}</div></div>`).join('')}
  </div></div></div>
 </div>`;
}
function renderNotifPanel(){
 const a=getAlerts();
 document.getElementById('content').insertAdjacentHTML('afterbegin',`<div class="card mb16" id="notifPanel" style="border-color:#fde68a"><div class="card-head"><h3>预警通知中心</h3><span class="sub">共 ${a.length} 条 · <span style="cursor:pointer;color:var(--primary)" onclick="notifOpen=false;render()">收起</span></span></div><div class="card-body" style="max-height:280px;overflow-y:auto">${a.map(x=>`<div class="alert-row"><div class="alert-ic" style="background:${x.level==='danger'?'#fef2f2':'#fffbeb'}">${svg(x.icon,x.level==='danger'?'fill:#dc2626':'fill:#d97706')}</div><div class="t"><b>${x.text}</b><span>${x.type}</span></div><span class="tag ${x.level==='danger'?'tag-red':'tag-orange'}" style="cursor:pointer" onclick="go('${x.page}');notifOpen=false">查看</span></div>`).join('')}</div></div>`);
}

/* ============ 设备台账 ============ */
let inv={q:'',dept:'',cat:'',status:'',flag:'',page:1,size:20};
function filteredDevices(){
 const q=inv.q.trim().toLowerCase();
 return DEV.filter(d=>{
  if(q&&!((d.n||'').toLowerCase().includes(q)||(d.id||'').toLowerCase().includes(q)||(d.sn||'').toLowerCase().includes(q)||(d.v||'').toLowerCase().includes(q)||(d.fno||'').toLowerCase().includes(q)))return false;
  if(inv.dept&&d.dp!==inv.dept)return false;
  if(inv.cat&&d.cat!==inv.cat)return false;
  if(inv.status&&d.s!==inv.status)return false;
  if(inv.flag&&d.flag!==inv.flag)return false;
  return true;
 });
}
function renderInventory(){
 const list=filteredDevices();
 const pages=Math.max(1,Math.ceil(list.length/inv.size));
 if(inv.page>pages)inv.page=pages;
 const slice=list.slice((inv.page-1)*inv.size,inv.page*inv.size);
 const depts=META.deptTop.map(x=>x[0]);
 const cats=META.catTop.map(x=>x[0]);
 return `
 <div class="section-title">设备台账</div>
 <div class="section-sub">来源真实盘点，共 ${DEV.length.toLocaleString()} 台资产 · 当前筛选 ${list.length.toLocaleString()} 台</div>
 <div class="card"><div class="toolbar">
  <div class="search-box">${svg(I.search)}<input placeholder="搜索名称/资产编号/SN/厂家/固定资产号" value="${inv.q}" oninput="inv.q=this.value;inv.page=1;refreshTable()"></div>
  <select onchange="inv.dept=this.value;inv.page=1;refreshTable()"><option value="">全部科室</option>${depts.map(x=>`<option ${inv.dept===x?'selected':''}>${x}</option>`).join('')}</select>
  <select onchange="inv.cat=this.value;inv.page=1;refreshTable()"><option value="">全部类别</option>${cats.map(x=>`<option ${inv.cat===x?'selected':''}>${x}</option>`).join('')}</select>
  <select onchange="inv.status=this.value;inv.page=1;refreshTable()"><option value="">全部状态</option>${['账实相符','台无实有','台有实无','已报废'].map(x=>`<option ${inv.status===x?'selected':''}>${x}</option>`).join('')}</select>
  <button class="btn" onclick="inv={q:'',dept:'',cat:'',status:'',flag:'',page:1,size:20};render()">${svg(I.refresh)}重置</button>
  <button class="btn btn-primary" style="margin-left:auto" onclick="openDeviceModal()">${svg(I.plus)}新增设备</button>
 </div>
 <div id="tableArea">${invTable(slice,list,pages)}</div>
 </div>`;
}
function invTable(slice,list,pages){
 return `<div class="table-wrap"><table>
  <thead><tr><th>设备名称 / 型号</th><th>资产编号</th><th>所属科室</th><th>厂家</th><th>原值</th><th>启用时间</th><th>台账状态</th><th>标记</th><th style="text-align:right">操作</th></tr></thead>
  <tbody>${slice.length?slice.map(d=>`<tr onclick="showDetail('${d.id}')" style="cursor:pointer">
   <td><div class="device-name">${d.n}${d.cp&&d.cp.length?` <span class="tag tag-blue" style="font-size:9px">成套${d.cp.length+1}件</span>`:''}</div><div class="device-meta">${d.m||'—'}</div></td>
   <td style="font-family:monospace;font-size:11px">${d.id}<div class="device-meta">${d.fno||''}</div></td>
   <td>${d.dp||'—'}</td><td style="font-size:11.5px;max-width:150px">${(d.v||'—').slice(0,16)}</td>
   <td class="money">${money(d.p)}</td><td style="font-size:11.5px">${d.sd||'—'}</td><td>${statusTag(d.s)}</td><td>${flagTag(d.flag)}</td>
   <td style="text-align:right;white-space:nowrap" onclick="event.stopPropagation()"><button class="btn btn-ghost btn-sm" title="编辑" onclick="openDeviceModal('${d.id}')">${svg(I.edit)}</button><button class="btn btn-ghost btn-sm" style="color:var(--danger)" title="删除" onclick="delDevice('${d.id}')">${svg(I.trash)}</button></td>
  </tr>`).join(''):`<tr><td colspan="9"><div class="empty">${svg(I.search)}<div>未找到匹配的设备</div></div></td></tr>`}</tbody>
 </table></div>
 <div class="pagination"><span class="pager-info">显示 ${(inv.page-1)*inv.size+1}-${Math.min(inv.page*inv.size,list.length)} / ${list.length.toLocaleString()} 条　第 ${inv.page}/${pages} 页</span>
 <div class="page-btns"><button ${inv.page<=1?'disabled':''} onclick="inv.page--;refreshTable()">‹</button><button class="active">${inv.page}</button><button ${inv.page>=pages?'disabled':''} onclick="inv.page++;refreshTable()">›</button></div></div>`;
}
function refreshTable(){const list=filteredDevices(),pages=Math.max(1,Math.ceil(list.length/inv.size));document.getElementById('tableArea').innerHTML=invTable(list.slice((inv.page-1)*inv.size,inv.page*inv.size),list,pages)}

function showDetail(id){
 const d=DEV.find(x=>x.id===id);if(!d)return;
 const kv=(k,v)=>`<div class="kv"><div class="k">${k}</div><div class="v">${v||'—'}</div></div>`;
 openModal('设备详情',`
  <div class="detail-head"><div class="detail-icon">${svg(I.device)}</div><div class="detail-title"><h2>${d.n} ${flagTag(d.flag)}</h2><p>资产编号 ${d.id} · ${d.dp||'未分配科室'}</p></div></div>
  <div class="grid g2" style="gap:0 20px">
   <div>${kv('设备型号',d.m)}${kv('设备序列号',d.sn)}${kv('设备厂家',d.v)}${kv('固定资产编号',d.fno)}${kv('资产类别',d.cat)}</div>
   <div>${kv('原值',money(d.p))}${kv('单位',d.u)}${kv('启用时间',d.sd)}${kv('报废时间',d.ed)}${kv('台账状态',statusTag(d.s))}</div>
  </div>
  ${d.cp&&d.cp.length?`<div class="pkg"><div class="pkg-t">成套设备组件（${d.cp.length} 件）</div><ul>${d.cp.map(c=>`<li><b>${c.n}</b><span>${c.m||''}　SN:${c.sn||'—'}</span></li>`).join('')}</ul></div>`:''}
  ${d.chg?`<div class="pkg" style="margin-top:10px"><div class="pkg-t">历史变更溯源</div><div style="font-size:12px">变更日期 <b>${d.chg.d||'—'}</b>　原因 <b>${d.chg.why||'—'}</b>　变更人 <b>${d.chg.by||'—'}</b></div></div>`:''}
  ${d.note?`<div class="pkg" style="margin-top:10px"><div class="pkg-t">备注</div><div style="font-size:12px">${d.note}</div></div>`:''}
 `,`<button class="btn" onclick="closeModal()">关闭</button><button class="btn btn-primary" onclick="closeModal();openDeviceModal('${d.id}')">${svg(I.edit)}编辑</button>`);
}
function openDeviceModal(id){
 const d=id?DEV.find(x=>x.id===id):null;
 const f=(l,n,v,t='text',x='')=>`<div class="fg"><label>${l}</label><input type="${t}" name="${n}" value="${v||''}" ${x}></div>`;
 const sel=(l,n,v,os)=>`<div class="fg"><label>${l}</label><select name="${n}">${os.map(o=>`<option ${v===o?'selected':''}>${o}</option>`).join('')}</select></div>`;
 openModal(d?'编辑设备':'新增设备',`<form id="devForm"><div class="form-grid">
  ${f('设备名称 *','n',d?.n)}${f('资产编号','id',d?.id,'text',d?'readonly':'placeholder="自动生成"')}
  ${f('型号','m',d?.m)}${f('序列号','sn',d?.sn)}
  ${f('厂家','v',d?.v)}${f('固定资产编号','fno',d?.fno)}
  ${sel('所属科室','dp',d?.dp||META.deptTop[0][0],META.deptTop.map(x=>x[0]))}
  ${sel('资产类别','cat',d?.cat||META.catTop[0][0],META.catTop.map(x=>x[0]))}
  ${f('原值（元）','p',d?.p,'number','step="0.01"')}${f('单位','u',d?.u||'台')}
  ${f('启用时间','sd',d?.sd,'date')}${f('报废时间','ed',d?.ed,'date')}
  ${sel('台账状态','s',d?.s||'账实相符',['账实相符','台无实有','台有实无','已报废'])}
  ${sel('标记','flag',d?.flag||'',[['','无标记'],['idle','科室闲置(红)'],['highfail','故障率高(黄)'],['special','特殊约定(橙)']].map(x=>x[0]))}
  <div class="fg full"><label>备注</label><textarea name="note">${d?.note||''}</textarea></div>
 </div></form>`,`<button class="btn" onclick="closeModal()">取消</button><button class="btn btn-primary" id="saveDev">保存</button>`);
 // 修复标记下拉的显示文本
 const fs=document.querySelector('#devForm select[name=flag]');if(fs)[...fs.options].forEach((o,i)=>o.textContent=['无标记','科室闲置(红)','故障率高(黄)','特殊约定(橙)'][i]);
 document.getElementById('saveDev').onclick=()=>{
  const o=Object.fromEntries(new FormData(document.getElementById('devForm')).entries());
  if(!o.n.trim()){toast('请填写设备名称',true);return}
  o.p=Number(o.p)||0;
  if(d){Object.assign(d,o);LOCAL.ov[d.id]={...LOCAL.ov[d.id],...o};toast('设备信息已更新')}
  else{o.id=o.id.trim()||('NEW-'+Date.now());o.cp=[];o.chg='';DEV.unshift(o);LOCAL.add.push({...o});addAct(`新增设备 <b>${o.n}</b>`);toast('设备已添加')}
  persist();closeModal();render();
 };
}
function delDevice(id){const d=DEV.find(x=>x.id===id);confirmBox(`确定删除「${d.n}」（${d.id}）吗？`,()=>{const i=DEV.findIndex(x=>x.id===id);DEV.splice(i,1);if(!LOCAL.ov[id])LOCAL.del.push(id);else delete LOCAL.ov[id];persist();toast('设备已删除');render()})}
function globalSearchFn(v){if(!v.trim())return;inv.q=v;inv.page=1;if(currentPage!=='inventory')go('inventory');else{render()}}

/* ============ 资产盘点作业 ============ */
LOCAL.stock=LOCAL.stock||{};  // {deviceId: {r:盘点结果, t:时间, note:备注}}
function getStockProgress(){
 const done=Object.keys(LOCAL.stock).length;
 let pct=DEV.length?done/DEV.length*100:0;
 if(done>0&&pct<1)pct=1;
 return {done, total:DEV.length, pct:Math.round(pct)};
}
let stk={dept:'',q:'',filter:'all',page:1,size:15};
function stkFiltered(){
 const q=stk.q.trim().toLowerCase();
 return DEV.filter(d=>{
  if(stk.dept&&d.dp!==stk.dept)return false;
  if(q&&!((d.n||'').toLowerCase().includes(q)||(d.id||'').toLowerCase().includes(q)||(d.sn||'').toLowerCase().includes(q)))return false;
  const done=!!LOCAL.stock[d.id];
  if(stk.filter==='done'&&!done)return false;
  if(stk.filter==='todo'&&done)return false;
  if(stk.filter==='abnormal'&&(!done||LOCAL.stock[d.id].r==='账实相符'))return false;
  return true;
 });
}
function renderStocktake(){
 const p=getStockProgress();
 const results={相符:0,盘亏:0,盘盈:0,报废:0,闲置:0};
 Object.values(LOCAL.stock).forEach(s=>{
  if(s.r==='账实相符')results.相符++;
  else if(s.r==='台有实无')results.盘亏++;
  else if(s.r==='台无实有')results.盘盈++;
  else if(s.r==='已报废')results.报废++;
  else if(s.r==='闲置')results.闲置++;
 });
 const list=stkFiltered(),pages=Math.max(1,Math.ceil(list.length/stk.size));
 if(stk.page>pages)stk.page=pages;
 const slice=list.slice((stk.page-1)*stk.size,stk.page*stk.size);
 const depts=META.deptTop.map(x=>x[0]);
 return `
 <div class="section-title">资产盘点作业</div>
 <div class="section-sub">按科室逐台核对实物与台账，记录盘点结果 · 盘点数据仅保存于本地</div>
 <div class="card mb16" style="padding:18px 20px">
  <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
   <div style="flex:1;min-width:220px">
    <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:8px"><span>本轮盘点进度</span><b style="color:var(--primary)">${p.done} / ${p.total} 台（${p.pct}%）</b></div>
    <div class="bar-track" style="height:11px"><div class="bar-fill" style="width:${p.pct}%;background:linear-gradient(90deg,#2563eb,#0d9488)"></div></div>
   </div>
   <button class="btn btn-danger btn-sm" onclick="resetStock()">${svg(I.refresh)}清空进度</button>
   <button class="btn btn-sm" onclick="exportStock()">${svg(I.export)}导出盘点表</button>
  </div>
 </div>
 <div class="grid g4 mb16">
  <div class="card stat" style="padding:14px 16px"><div class="label">已盘 · 账实相符</div><div class="value" style="font-size:24px;color:var(--success)">${results.相符}</div><div class="ic ic-green">${svg(I.check)}</div></div>
  <div class="card stat" style="padding:14px 16px"><div class="label">盘亏（台有实无）</div><div class="value" style="font-size:24px;color:var(--danger)">${results.盘亏}</div><div class="ic ic-red">${svg(I.warn)}</div></div>
  <div class="card stat" style="padding:14px 16px"><div class="label">盘盈（台无实有）</div><div class="value" style="font-size:24px;color:#d97706">${results.盘盈}</div><div class="ic ic-orange">${svg(I.plus)}</div></div>
  <div class="card stat" style="padding:14px 16px"><div class="label">报废 / 闲置</div><div class="value" style="font-size:24px;color:var(--muted)">${results.报废} / ${results.闲置}</div><div class="ic ic-purple">${svg(I.box)}</div></div>
 </div>
 <div class="card"><div class="toolbar">
  <div class="search-box">${svg(I.search)}<input placeholder="搜索设备名称/编号/SN" value="${stk.q}" oninput="stk.q=this.value;stk.page=1;refreshStock()"></div>
  <select onchange="stk.dept=this.value;stk.page=1;refreshStock()"><option value="">全部科室</option>${depts.map(x=>`<option ${stk.dept===x?'selected':''}>${x}</option>`).join('')}</select>
  <select onchange="stk.filter=this.value;stk.page=1;refreshStock()">
   <option value="all" ${stk.filter==='all'?'selected':''}>全部设备</option>
   <option value="todo" ${stk.filter==='todo'?'selected':''}>未盘点</option>
   <option value="done" ${stk.filter==='done'?'selected':''}>已盘点</option>
   <option value="abnormal" ${stk.filter==='abnormal'?'selected':''}>盘亏/盘盈</option>
  </select>
  <button class="btn" onclick="stk={dept:'',q:'',filter:'all',page:1,size:15};render()">${svg(I.refresh)}重置</button>
 </div>
 <div id="stockArea">${stkTable(slice,list,pages)}</div>
 </div>`;
}
function stkTable(slice,list,pages){
 const opts=[['账实相符','✓ 账实相符'],['台有实无','盘亏·台有实无'],['台无实有','盘盈·台无实有'],['已报废','已报废'],['闲置','闲置']];
 return `<div class="table-wrap"><table>
  <thead><tr><th>设备名称 / 型号</th><th>资产编号</th><th>科室</th><th>台账状态</th><th>盘点结果</th><th>盘点时间</th><th style="text-align:right">操作</th></tr></thead>
  <tbody>${slice.length?slice.map(d=>{
   const rec=LOCAL.stock[d.id];
   const badge=rec?`<span class="tag ${rec.r==='账实相符'?'tag-green':rec.r==='台有实无'?'tag-red':rec.r==='台无实有'?'tag-orange':'tag-gray'}">${rec.r}</span>`:'<span class="tag tag-gray">未盘点</span>';
   return `<tr>
    <td><div class="device-name">${d.n}</div><div class="device-meta">${d.m||''}</div></td>
    <td style="font-family:monospace;font-size:11px">${d.id}</td><td>${d.dp||'—'}</td><td>${statusTag(d.s)}</td>
    <td>${badge}</td><td style="font-size:11px;color:var(--muted)">${rec?rec.t:'—'}</td>
    <td style="text-align:right"><select onchange="markStock('${d.id}',this.value)" style="padding:5px 8px;font-size:11.5px"><option value="">${rec?'更改结果':'选择结果'}</option>${opts.map(o=>`<option value="${o[0]}" ${rec&&rec.r===o[0]?'selected':''}>${o[1]}</option>`).join('')}</select></td>
   </tr>`;
  }).join(''):`<tr><td colspan="7"><div class="empty">${svg(I.clipboard)}<div>当前筛选下暂无设备</div></div></td></tr>`}</tbody>
 </table></div>
 <div class="pagination"><span class="pager-info">显示 ${(stk.page-1)*stk.size+1}-${Math.min(stk.page*stk.size,list.length)} / ${list.length.toLocaleString()} 台　第 ${stk.page}/${pages} 页</span>
 <div class="page-btns"><button ${stk.page<=1?'disabled':''} onclick="stk.page--;refreshStock()">‹</button><button class="active">${stk.page}</button><button ${stk.page>=pages?'disabled':''} onclick="stk.page++;refreshStock()">›</button></div></div>`;
}
function refreshStock(){const list=stkFiltered(),pages=Math.max(1,Math.ceil(list.length/stk.size));document.getElementById('stockArea').innerHTML=stkTable(list.slice((stk.page-1)*stk.size,stk.page*stk.size),list,pages)}
function markStock(id,r){
 if(!r)return;
 const d=DEV.find(x=>x.id===id);
 const oldS=d?.s||'—';
 LOCAL.stock[id]={r,s0:oldS,t:new Date().toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})};
 // 盘点结果联动台账状态（闲置为标记，不覆盖台账状态）
 if(d&&r!=='闲置'){d.s=r;LOCAL.ov[id]={...LOCAL.ov[id],s:r}}
 persist();toast(`已记录「${d?.n||id}」：${r}`);render();
}
function resetStock(){confirmBox('确定清空本轮全部盘点进度吗？此操作不可恢复。',()=>{LOCAL.stock={};persist();toast('盘点进度已清空');render()})}
function exportStock(){
 const h=['资产编号','设备名称','型号','序列号','科室','台账原状态','盘点结果','盘点时间'];
 const fm={'账实相符':'账实相符','台有实无':'盘亏(台有实无)','台无实有':'盘盈(台无实有)','已报废':'已报废','闲置':'闲置'};
 const rows=Object.entries(LOCAL.stock).map(([id,s])=>{const d=DEV.find(x=>x.id===id)||{};return [id,d.n,d.m,d.sn,d.dp,s.s0||'—',fm[s.r]||s.r,s.t]});
 if(!rows.length){toast('暂无盘点记录，请先盘点',true);return}
 const csv='\uFEFF'+[h,...rows].map(r=>r.map(x=>`"${String(x??'').replace(/"/g,'""')}"`).join(',')).join('\n');
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='资产盘点表_'+new Date().toISOString().slice(0,10)+'.csv';a.click();toast('盘点表已导出');
}

/* ============ 盘点核查 ============ */
let checkView='all';
function renderCheck(){
 const idle=(META.flag.find(x=>x[0]==='idle')||[])[1]||0;
 const hf=(META.flag.find(x=>x[0]==='highfail')||[])[1]||0;
 const sp=(META.flag.find(x=>x[0]==='special')||[])[1]||0;
 const no=(META.status.find(x=>x[0]==='台有实无')||[])[1]||0;
 const have=(META.status.find(x=>x[0]==='台无实有')||[])[1]||0;
 const scrap=(META.status.find(x=>x[0]==='已报废')||[])[1]||0;
 const cards=[
  {k:'idle',n:'科室闲置设备',v:idle,c:'var(--danger)',bg:'#fef2f2',hint:'红色标记 · 建议调剂/封存',icon:I.warn},
  {k:'highfail',n:'故障率较高',v:hf,c:'#ca8a04',bg:'#fefce8',hint:'黄色标记 · 建议重点巡检',icon:I.maintenance},
  {k:'special',n:'特殊约定设备',v:sp,c:'#ea580c',bg:'#fff7ed',hint:'橙色标记 · 投放/第三方质保',icon:I.box},
  {k:'台有实无',n:'台有实无',v:no,c:'var(--danger)',bg:'#fef2f2',hint:'账面有、实物无 · 需追查',icon:I.search},
  {k:'台无实有',n:'台无实有',v:have,c:'#d97706',bg:'#fffbeb',hint:'实物有、账面无 · 需补录',icon:I.plus},
  {k:'已报废',n:'已报废资产',v:scrap,c:'var(--muted)',bg:'#f1f5f9',hint:'已报废 · 待处置',icon:I.trash}
 ];
 let list=[];
 if(checkView==='idle')list=DEV.filter(d=>d.flag==='idle');
 else if(checkView==='highfail')list=DEV.filter(d=>d.flag==='highfail');
 else if(checkView==='special')list=DEV.filter(d=>d.flag==='special');
 else if(checkView==='台有实无')list=DEV.filter(d=>d.s==='台有实无');
 else if(checkView==='台无实有')list=DEV.filter(d=>d.s==='台无实有');
 else if(checkView==='已报废')list=DEV.filter(d=>d.s==='已报废');
 const viewName=cards.find(c=>c.k===checkView)?.n||'全部需核查资产';
 const shown=list.slice(0,60);
 return `
 <div class="section-title">盘点核查</div>
 <div class="section-sub">基于颜色标记与台账状态的异常资产筛查 · 点击卡片查看明细</div>
 <div class="grid g3 mb16">${cards.map(c=>`<div class="card chk-card" style="border-left-color:${c.c}" onclick="checkView='${c.k}';render()">
  <div style="display:flex;align-items:center;justify-content:space-between"><div class="num" style="color:${c.c}">${c.v}</div><div style="width:36px;height:36px;border-radius:9px;background:${c.bg};display:flex;align-items:center;justify-content:center">${svg(c.icon,c.icon===I.warn?`fill:${c.c}`:'fill:'+c.c)}</div></div>
  <div class="lbl">${c.n}</div><div class="hint" style="color:${c.c}">${c.hint}</div>
 </div>`).join('')}</div>
 <div class="card"><div class="card-head"><h3>${viewName}</h3><span class="sub">共 ${list.length.toLocaleString()} 台${list.length>60?' · 显示前 60 台':''}</span></div>
 <div class="toolbar"><div class="tabs">
  <div class="tab ${checkView==='all'?'active':''}" onclick="checkView='all';render()">全部异常</div>
  ${cards.map(c=>`<div class="tab ${checkView===c.k?'active':''}" onclick="checkView='${c.k}';render()">${c.n}<span class="c">${c.v}</span></div>`).join('')}
 </div></div>
 <div class="table-wrap"><table><thead><tr><th>设备名称</th><th>资产编号</th><th>科室</th><th>厂家</th><th>原值</th><th>台账状态</th><th>标记</th><th style="text-align:right">操作</th></tr></thead><tbody>
 ${shown.length?shown.map(d=>`<tr><td><div class="device-name">${d.n}</div><div class="device-meta">${d.m||''}</div></td><td style="font-family:monospace;font-size:11px">${d.id}</td><td>${d.dp||'—'}</td><td style="font-size:11px">${(d.v||'—').slice(0,14)}</td><td class="money">${money(d.p)}</td><td>${statusTag(d.s)}</td><td>${flagTag(d.flag)}</td><td style="text-align:right"><button class="btn btn-ghost btn-sm" style="color:var(--primary)" onclick="showDetail('${d.id}')">详情</button></td></tr>`).join(''):`<tr><td colspan="8"><div class="empty">该分类暂无设备</div></td></tr>`}
 </tbody></table></div></div>`;
}

/* ============ 维修工单 ============ */
function renderRepairs(){
 const list=LOCAL.repairs;
 return `<div class="section-title">维修工单</div><div class="section-sub">业务运营数据 · 报修、派工与维修进度跟踪</div>
 <div class="grid g4 mb16">
  <div class="card stat"><div class="label">全部工单</div><div class="value">${list.length}</div><div class="ic ic-blue">${svg(I.repair)}</div></div>
  <div class="card stat"><div class="label">待派工</div><div class="value">${list.filter(r=>r.status==='待派工').length}</div><div class="ic ic-orange">${svg(I.clock)}</div></div>
  <div class="card stat"><div class="label">维修中</div><div class="value">${list.filter(r=>r.status==='维修中').length}</div><div class="ic ic-purple">${svg(I.refresh)}</div></div>
  <div class="card stat"><div class="label">维修费用</div><div class="value" style="font-size:23px">${money(list.reduce((s,r)=>s+(r.cost||0),0))}</div><div class="ic ic-green">${svg(I.report)}</div></div>
 </div>
 <div class="card"><div class="card-head"><h3>工单列表</h3><button class="btn btn-primary" style="margin-left:auto" onclick="openRepairModal()">${svg(I.plus)}新建报修</button></div>
 <div class="table-wrap"><table><thead><tr><th>编号</th><th>故障设备</th><th>故障描述</th><th>报修人/日期</th><th>负责人</th><th>优先级</th><th>状态</th><th style="text-align:right">操作</th></tr></thead><tbody>
 ${list.length?list.map(r=>`<tr><td style="font-family:monospace;font-size:11px">${r.id}</td><td><div class="device-name">${r.devName}</div><div class="device-meta">${r.devId}</div></td><td style="max-width:200px;font-size:12px">${r.fault}</td><td>${r.reporter}<div class="device-meta">${r.date}</div></td><td>${r.assign||'—'}</td><td>${statusTag(r.priority)}</td><td>${statusTag(r.status)}</td><td style="text-align:right;white-space:nowrap">${r.status!=='已完成'?`<button class="btn btn-ghost btn-sm" style="color:var(--primary)" onclick="advanceRepair('${r.id}')">推进 →</button>`:''}<button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="delRepair('${r.id}')">${svg(I.trash)}</button></td></tr>`).join(''):`<tr><td colspan="8"><div class="empty">暂无工单</div></td></tr>`}
 </tbody></table></div></div>`;
}
function openRepairModal(){
 const opts=DEV.slice(0,300).map(d=>`<option value="${d.id}" data-name="${d.n}">${d.n}（${d.id}）</option>`).join('');
 openModal('新建报修工单',`<form id="repForm"><div class="form-grid">
  <div class="fg full"><label>故障设备 *（可搜索台账前300台）</label><select name="devId" id="repDev">${opts}</select></div>
  <div class="fg"><label>报修人</label><input name="reporter" placeholder="科室/姓名"></div>
  <div class="fg"><label>优先级</label><select name="priority"><option>一般</option><option>紧急</option></select></div>
  <div class="fg full"><label>故障描述 *</label><textarea name="fault" placeholder="描述故障现象..."></textarea></div>
 </div></form>`,`<button class="btn" onclick="closeModal()">取消</button><button class="btn btn-primary" id="saveRep">提交报修</button>`);
 document.getElementById('saveRep').onclick=()=>{
  const o=Object.fromEntries(new FormData(document.getElementById('repForm')).entries());
  if(!o.fault.trim()){toast('请填写故障描述',true);return}
  const sel=document.getElementById('repDev'),name=sel.options[sel.selectedIndex].dataset.name;
  LOCAL.repairs.unshift({id:'WX-2026-'+String(LOCAL.repairs.length+1).padStart(3,'0'),devId:o.devId,devName:name,fault:o.fault,reporter:o.reporter||'设备科',date:new Date().toISOString().slice(0,10),assign:'',status:'待派工',priority:o.priority,cost:0});
  persist();addAct(`<b>${o.reporter||'设备科'}</b> 提交了「${name}」报修`);closeModal();toast('报修工单已创建');render();
 };
}
function advanceRepair(id){
 const r=LOCAL.repairs.find(x=>x.id===id);
 if(r.status==='待派工'){
  openModal('派工处理',`<div class="fg"><label>指派工程师</label><input id="asg" value="王工程师"></div>`,`<button class="btn" onclick="closeModal()">取消</button><button class="btn btn-primary" id="ok">确认派工</button>`);
  document.getElementById('ok').onclick=()=>{r.assign=document.getElementById('asg').value;r.status='维修中';persist();closeModal();toast('已派工');render()};
 }else{
  openModal('完成维修',`<div class="form-grid"><div class="fg"><label>维修费用（元）</label><input type="number" id="cost" value="0"></div><div class="fg"><label>完成日期</label><input type="date" id="cdate" value="${new Date().toISOString().slice(0,10)}"></div></div>`,`<button class="btn" onclick="closeModal()">取消</button><button class="btn btn-primary" id="ok">确认完成</button>`);
  document.getElementById('ok').onclick=()=>{r.cost=Number(document.getElementById('cost').value)||0;r.status='已完成';persist();closeModal();toast('工单已完成');render()};
 }
}
function delRepair(id){confirmBox('确定删除该工单吗？',()=>{LOCAL.repairs=LOCAL.repairs.filter(x=>x.id!==id);persist();toast('已删除');render()})}

/* ============ 维护保养 ============ */
function renderMaintenance(){
 return `<div class="section-title">维护保养</div><div class="section-sub">业务运营数据 · 保养计划与执行记录</div>
 <div class="card"><div class="card-head"><h3>保养计划</h3><button class="btn btn-primary" style="margin-left:auto" onclick="openMaintModal()">${svg(I.plus)}新增计划</button></div>
 <div class="table-wrap"><table><thead><tr><th>编号</th><th>设备</th><th>类型</th><th>计划日期</th><th>完成日期</th><th>执行人</th><th>状态</th><th style="text-align:right">操作</th></tr></thead><tbody>
 ${LOCAL.maint.map(m=>`<tr><td style="font-family:monospace;font-size:11px">${m.id}</td><td>${m.devName}</td><td>${m.type}</td><td>${m.plan}</td><td>${m.done||'—'}</td><td>${m.executor||'—'}</td><td>${statusTag(m.status)}</td><td style="text-align:right;white-space:nowrap">${m.status!=='已完成'?`<button class="btn btn-ghost btn-sm" style="color:var(--success)" onclick="completeMaint('${m.id}')">${svg(I.check)}</button>`:''}<button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="delMaint('${m.id}')">${svg(I.trash)}</button></td></tr>`).join('')}
 </tbody></table></div></div>`;
}
function openMaintModal(){
 openModal('新增保养计划',`<form id="mForm"><div class="form-grid">
  <div class="fg full"><label>设备</label><select name="devId" id="mDev">${DEV.slice(0,200).map(d=>`<option value="${d.id}" data-name="${d.n}">${d.n}（${d.id}）</option>`).join('')}</select></div>
  <div class="fg"><label>保养类型</label><select name="type"><option>月度保养</option><option>季度保养</option><option>半年保养</option><option>年度保养</option></select></div>
  <div class="fg"><label>计划日期</label><input type="date" name="plan" value="${new Date().toISOString().slice(0,10)}"></div>
  <div class="fg full"><label>保养内容</label><textarea name="content"></textarea></div>
 </div></form>`,`<button class="btn" onclick="closeModal()">取消</button><button class="btn btn-primary" id="ok">保存</button>`);
 document.getElementById('ok').onclick=()=>{
  const o=Object.fromEntries(new FormData(document.getElementById('mForm')).entries());
  const sel=document.getElementById('mDev'),name=sel.options[sel.selectedIndex].dataset.name;
  LOCAL.maint.unshift({id:'BY-2026-'+String(LOCAL.maint.length+1).padStart(3,'0'),devId:o.devId,devName:name,type:o.type,plan:o.plan,done:'',executor:'',status:'待执行',content:o.content});
  persist();closeModal();toast('保养计划已创建');render();
 };
}
function completeMaint(id){const m=LOCAL.maint.find(x=>x.id===id);openModal('完成保养',`<div class="form-grid"><div class="fg"><label>执行人</label><input id="ex" value="王工程师"></div><div class="fg"><label>完成日期</label><input type="date" id="dn" value="${new Date().toISOString().slice(0,10)}"></div></div>`,`<button class="btn" onclick="closeModal()">取消</button><button class="btn btn-primary" id="ok">确认</button>`);document.getElementById('ok').onclick=()=>{m.executor=document.getElementById('ex').value;m.done=document.getElementById('dn').value;m.status='已完成';persist();closeModal();toast('已完成');render()}}
function delMaint(id){confirmBox('确定删除？',()=>{LOCAL.maint=LOCAL.maint.filter(x=>x.id!==id);persist();toast('已删除');render()})}

/* ============ 设备巡检 ============ */
function renderInspections(){
 return `<div class="section-title">设备巡检</div><div class="section-sub">业务运营数据 · 日常巡检登记</div>
 <div class="card"><div class="card-head"><h3>巡检记录</h3><button class="btn btn-primary" style="margin-left:auto" onclick="openInspModal()">${svg(I.plus)}新增巡检</button></div>
 <div class="table-wrap"><table><thead><tr><th>编号</th><th>设备</th><th>科室</th><th>巡检人</th><th>日期</th><th>结果</th><th>备注</th><th style="text-align:right">操作</th></tr></thead><tbody>
 ${LOCAL.insp.map(x=>`<tr><td style="font-family:monospace;font-size:11px">${x.id}</td><td>${x.devName}</td><td>${x.dept}</td><td>${x.inspector}</td><td>${x.date}</td><td>${statusTag(x.result)}</td><td style="font-size:11.5px;color:var(--muted)">${x.note}</td><td style="text-align:right"><button class="btn btn-ghost btn-sm" style="color:var(--danger)" onclick="delInsp('${x.id}')">${svg(I.trash)}</button></td></tr>`).join('')}
 </tbody></table></div></div>`;
}
function openInspModal(){
 openModal('新增巡检记录',`<form id="iForm"><div class="form-grid">
  <div class="fg full"><label>设备</label><select name="devId" id="iDev">${DEV.slice(0,200).map(d=>`<option value="${d.id}" data-name="${d.n}" data-dept="${d.dp}">${d.n}（${d.id}）</option>`).join('')}</select></div>
  <div class="fg"><label>巡检人</label><input name="inspector" value="设备科"></div>
  <div class="fg"><label>日期</label><input type="date" name="date" value="${new Date().toISOString().slice(0,10)}"></div>
  <div class="fg"><label>结果</label><select name="result"><option>正常</option><option>异常</option></select></div>
  <div class="fg full"><label>备注</label><textarea name="note"></textarea></div>
 </div></form>`,`<button class="btn" onclick="closeModal()">取消</button><button class="btn btn-primary" id="ok">保存</button>`);
 document.getElementById('ok').onclick=()=>{const o=Object.fromEntries(new FormData(document.getElementById('iForm')).entries());const s=document.getElementById('iDev'),op=s.options[s.selectedIndex];LOCAL.insp.unshift({id:'XJ-2026-'+String(LOCAL.insp.length+1).padStart(3,'0'),devId:o.devId,devName:op.dataset.name,dept:op.dataset.dept,inspector:o.inspector,date:o.date,result:o.result,note:o.note||'—'});persist();closeModal();toast('已保存');render()};
}
function delInsp(id){confirmBox('确定删除？',()=>{LOCAL.insp=LOCAL.insp.filter(x=>x.id!==id);persist();toast('已删除');render()})}

/* ============ 供应商（从真实厂家统计）============ */
function renderSuppliers(){
 const vs=META.vendorTop;
 const max=vs[0]?vs[0][1]:1;
 return `<div class="section-title">供应商分析</div><div class="section-sub">基于真实台账的厂家设备拥有量 TOP（原值单位为元）</div>
 <div class="card"><div class="card-head"><h3>厂家设备数量排名</h3><span class="sub">共 ${vs.length} 家（TOP25）</span></div><div class="card-body">
  ${vs.map((x,i)=>`<div class="bar-row"><div class="name" style="width:170px;text-align:left;font-size:11px" title="${x[0]}">${(i+1)+'. '+x[0].slice(0,11)}</div><div class="bar-track"><div class="bar-fill" style="width:${x[1]/max*100}%;background:${['#3b82f6','#14b8a6','#f59e0b','#8b5cf6'][i%4]}"></div></div><div class="num" style="width:34px">${x[1]}</div></div>`).join('')}
 </div></div>`;
}

/* ============ 统计报表 ============ */
function renderReports(){
 const bar=(obj,max)=>obj.map((x,i)=>`<div class="bar-row"><div class="name">${x[0].slice(0,7)}</div><div class="bar-track"><div class="bar-fill" style="width:${x[1]/max*100}%;background:${['#3b82f6','#14b8a6','#f59e0b','#8b5cf6','#ef4444','#ec4899','#06b6d4','#84cc16'][i%8]}"></div></div><div class="num">${x[1]}</div></div>`).join('');
 const st=META.status,dc=META.deptTop,cc=META.catTop;
 return `<div class="section-title">统计报表</div><div class="section-sub">真实盘点数据统计 · 共 ${DEV.length.toLocaleString()} 台资产</div>
 <div class="grid g4 mb16">
  <div class="card stat"><div class="label">资产总原值</div><div class="value" style="font-size:23px">${moneyW(META.totalValue)}</div><div class="ic ic-blue">${svg(I.report)}</div></div>
  <div class="card stat"><div class="label">资产台数</div><div class="value">${DEV.length.toLocaleString()}</div><div class="ic ic-teal">${svg(I.box)}</div></div>
  <div class="card stat"><div class="label">涉及科室</div><div class="value">${META.deptCount}</div><div class="ic ic-purple">${svg(I.hospital)}</div></div>
  <div class="card stat"><div class="label">资产类别</div><div class="value">${META.catCount}</div><div class="ic ic-orange">${svg(I.device)}</div></div>
 </div>
 <div class="grid g3 mb16">
  <div class="card"><div class="card-head"><h3>科室资产 TOP</h3></div><div class="card-body">${bar(dc,dc[0][1])}</div></div>
  <div class="card"><div class="card-head"><h3>类别分布 TOP</h3></div><div class="card-body">${bar(cc,cc[0][1])}</div></div>
  <div class="card"><div class="card-head"><h3>台账状态</h3></div><div class="card-body">${bar(st,st[0][1])}</div></div>
 </div>
 <div class="card"><div class="card-head"><h3>资产明细导出</h3><button class="btn" style="margin-left:auto" onclick="exportCSV()">${svg(I.export)}导出 CSV</button></div><div class="card-body" style="font-size:12.5px;color:var(--muted)">导出全部 ${DEV.length.toLocaleString()} 台设备的完整台账（含资产编号、SN、厂家、原值、启用时间、台账状态、标记等字段），UTF-8 编码，可直接用 Excel 打开。</div></div>`;
}
function exportCSV(){
 const h=['资产编号','设备名称','型号','序列号','厂家','固定资产编号','曾用编号','资产类别','原值(元)','单位','启用时间','报废时间','台账状态','科室','标记','备注','变更日期','变更原因','变更人'];
 const fm={idle:'科室闲置',highfail:'故障率高',special:'特殊约定'};
 const rows=DEV.map(d=>[d.id,d.n,d.m,d.sn,d.v,d.fno,d.old,d.cat,d.p,d.u,d.sd,d.ed,d.s,d.dp,fm[d.flag]||'',d.note,d.chg?.d||'',d.chg?.why||'',d.chg?.by||'']);
 const csv='\uFEFF'+[h,...rows].map(r=>r.map(x=>`"${String(x??'').replace(/"/g,'""')}"`).join(',')).join('\n');
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.download='青岛西海岸新区人民医院_资产台账_'+new Date().toISOString().slice(0,10)+'.csv';a.click();toast('台账已导出');
}

/* ============ 设置 ============ */
function renderSettings(){
 return `<div class="section-title">系统设置</div><div class="section-sub">数据管理与系统信息</div>
 <div class="grid g2">
  <div class="card"><div class="card-head"><h3>数据管理</h3></div><div class="card-body">
   <p style="font-size:12.5px;color:var(--muted);line-height:1.8">基础台账来自真实盘点表（${META.total} 台，1.9MB），只读内嵌；您的增删改以增量方式保存在浏览器本地，不重复占用存储空间。业务运营数据（工单/保养/巡检）亦存本地。</p>
   <div style="display:flex;gap:9px;flex-wrap:wrap"><button class="btn" onclick="exportCSV()">${svg(I.export)}导出台账</button><button class="btn btn-danger" onclick="confirmBox('确定清除所有本地修改并恢复初始数据吗？',()=>{localStorage.removeItem(LS);location.reload()})">${svg(I.refresh)}清除本地修改</button></div>
  </div></div>
  <div class="card"><div class="card-head"><h3>系统信息</h3></div><div class="card-body"><div style="font-size:12.5px;line-height:2.2;color:var(--muted)">
   <div>系统名称：<b style="color:var(--text)">医械管家 MedDevice Manager</b></div>
   <div>版本：<b style="color:var(--text)">v2.0 真实数据版</b></div>
   <div>数据来源：<b style="color:var(--text)">${META.source}</b></div>
   <div>资产规模：<b style="color:var(--text)">${META.total} 台 / ${moneyW(META.totalValue)}</b></div>
   <div>存储方式：<b style="color:var(--text)">增量本地存储</b></div>
  </div></div></div>
 </div>`;
}

/* ============ INIT ============ */
render();
