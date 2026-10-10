const {current}=require('./_auth');
module.exports=async(req,res)=>{try{const u=await current(req);if(!u){res.statusCode=302;res.setHeader('Location','/');return res.end()}let html=require('./_site-data');
const ipadEnhancement=`<style>
/* iPad friendly: restrained cream interface and larger touch targets */
:root{--ink:#45443f;--muted:#74716a;--line:#e7e3db;--main:#777369;--soft:#f4f1e9}
body{background:#f7f6f2!important}
.wrap{max-width:1180px;padding:18px 20px 90px}
.hero{background:linear-gradient(120deg,#fffefa,#efede6)!important;padding:26px 30px}
.hero h1{font-size:clamp(26px,3vw,36px)}
.hero p{font-size:16px}
.card{border-radius:20px;padding:22px;margin-top:14px}
.template-card,.style-card{transition:box-shadow .15s,transform .15s}
.template-card.active,.style-card.active{border-color:#777369!important;box-shadow:0 0 0 3px #e9e5dc!important}
input,select,.btn,.chip{min-height:48px;font-size:17px}
select.wl-pick{width:100%;padding:12px 14px;border:1px solid #ddd9cf;border-radius:12px;background:#f7f5ef;color:#514f49;margin:5px 0 8px}
.wl-hint{display:block;font-size:13px;color:#817d73;margin-bottom:6px}
.primary,.chip.active{background:#777369!important}
#menuCanvas{background:#fff}
@media(min-width:700px) and (max-width:1100px){.template-grid{grid-template-columns:repeat(3,1fr)}.styles{grid-template-columns:repeat(2,1fr)}}
@media(max-width:680px){.wrap{padding:12px 12px 85px}.hero,.card{padding:17px}.hero h1{font-size:27px}.template-grid{grid-template-columns:repeat(2,1fr)}}
</style><script>
(function(){
const options={
industry:['教育／講師','親子／家庭','美容／身心','餐飲／食品','專業服務','個人品牌','零售／購物','健康／生活'],
audience:['家長','女性','上班族','學生','親子家庭','一般大眾','創業者','熟齡族群'],
colors:['米白＋奶茶','奶油白＋灰褐','粉膚＋米白','墨綠＋暖白','藍灰＋白','黑金','柔和紫＋白','自訂色系'],
brandStyle:['日系簡約','溫柔療癒','專業知性','高級精品','清新自然','活潑可愛','現代時尚'],
feeling:['簡約有質感','溫暖親切','專業可信賴','清新舒適','精緻優雅','活潑有趣']
};
for(const [id,values] of Object.entries(options)){
const input=document.getElementById(id);if(!input)continue;
const select=document.createElement('select');select.className='wl-pick';select.setAttribute('aria-label',id+' 快速選擇');
select.append(new Option('快速選擇（也可以在下方自行輸入）',''));
values.forEach(v=>select.append(new Option(v,v)));
select.addEventListener('change',()=>{if(select.value){input.value=select.value;input.dispatchEvent(new Event('input',{bubbles:true}))}});
input.parentNode.insertBefore(select,input);
}
const menuBox=document.getElementById('menus');
const menuOptions=['品牌介紹','課程介紹','立即預約','聯絡我們','最新消息','服務項目','加入官方 LINE','優惠活動','商品介紹','常見問題','門市資訊','學員專區','作品展示','線上報名','免費諮詢','會員專區'];
function enhanceMenus(){
if(!menuBox)return;
menuBox.querySelectorAll('input[id^="menu"]').forEach(input=>{
if(input.previousElementSibling?.classList.contains('wl-pick'))return;
const select=document.createElement('select');select.className='wl-pick';
select.append(new Option('選擇常用功能，或自行輸入',''));
menuOptions.forEach(v=>select.append(new Option(v,v)));
select.onchange=()=>{if(select.value){input.value=select.value;input.dispatchEvent(new Event('input',{bubbles:true}))}};
input.parentNode.insertBefore(select,input);
});
}
new MutationObserver(enhanceMenus).observe(menuBox||document.body,{childList:true,subtree:true});enhanceMenus();
const save=document.getElementById('saveMenu'),canvas=document.getElementById('menuCanvas');
if(save&&canvas){save.onclick=async()=>{
const msg=document.getElementById('drawMessage');
if(save.disabled)return;
try{
const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('圖片產生失敗')),'image/png'));
const file=new File([blob],'旺林_LINE圖文選單_2500x1686.png',{type:'image/png'});
if(navigator.canShare&&navigator.canShare({files:[file]})&&navigator.share){
try{await navigator.share({files:[file],title:'旺林 LINE 圖文選單'});msg.textContent='已開啟分享選單，請選擇「儲存影像」或「儲存到檔案」。';return}catch(e){if(e.name==='AbortError')return}
}
const url=URL.createObjectURL(blob);
const a=document.createElement('a');a.href=url;a.download=file.name;document.body.appendChild(a);a.click();a.remove();
msg.textContent='PNG 已產生。iPad 若沒有直接下載，請長按圖片選「儲存到照片」，或使用 Safari 的分享功能。';
const preview=document.getElementById('wlSavePreview')||document.createElement('img');
preview.id='wlSavePreview';preview.alt='長按可儲存 PNG';preview.style.cssText='width:100%;margin-top:12px;border-radius:12px;display:block';
preview.src=url;canvas.insertAdjacentElement('afterend',preview);
}catch(e){msg.textContent='儲存 PNG 失敗：'+e.message}
};}
})();
</script>`;
html=html.replace('</body>',ipadEnhancement+'</body>');

// Mobile-first workflow: keep student edits when switching to AI apps.
const mobileFlow=`<style>
@media(max-width:680px){
html{scroll-padding-top:12px}
button,.btn,a[role="button"]{touch-action:manipulation}
.actions{gap:10px}
.actions .btn{min-height:50px;white-space:normal;line-height:1.35}
.copybox{max-height:220px;overflow:auto;font-size:12px}
#wlMobileGuide{padding:13px 15px;border:1px solid #dedbd1;background:#faf8f2;border-radius:14px;margin:12px 0;font-size:14px;line-height:1.7;color:#5b6259}
#wlMobileGuide strong{display:block;font-size:15px}
}
#wlDraftStatus{font-size:13px;color:#697a6f;margin-top:6px}
</style>
<script>
(function(){
const key='wl-studio-draft-v1';
function fields(){return [...document.querySelectorAll('#app input,#app textarea,#app select')].filter(el=>el.id&&el.type!=='file'&&el.type!=='password'&&el.type!=='hidden'&&el.type!=='submit')}
function save(){
try{const data={};fields().forEach(el=>{data[el.id]=el.type==='checkbox'?el.checked:el.value});localStorage.setItem(key,JSON.stringify(data));const status=document.getElementById('wlDraftStatus');if(status)status.textContent='✓ 設計資料已儲存在這台裝置';}catch(e){}
}
function restore(){
try{const data=JSON.parse(localStorage.getItem(key)||'null');if(!data)return;fields().forEach(el=>{if(!(el.id in data))return;if(el.type==='checkbox')el.checked=!!data[el.id];else el.value=data[el.id];el.dispatchEvent(new Event('change',{bubbles:false}));});const status=document.getElementById('wlDraftStatus');if(status)status.textContent='✓ 已還原上次填寫的資料';}catch(e){}
}
function setup(){
const app=document.getElementById('app');if(!app)return;
const guide=document.createElement('div');guide.id='wlMobileGuide';guide.innerHTML='<strong>📱 手機操作小提醒</strong>先在旺林完成設計 → 複製 AI 指令 → 切換到已登入的 ChatGPT／Canva App 貼上。回到網站時，已填寫的文字設定會保留。<div id="wlDraftStatus">設計文字將自動儲存在這台裝置</div>';
const result=document.getElementById('result');if(result)result.insertAdjacentElement('afterbegin',guide);
restore();
let timer;app.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(save,350)});app.addEventListener('change',()=>{clearTimeout(timer);timer=setTimeout(save,350)});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')save()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();
</script>`;
html=html.replace('</body>',mobileFlow+'</body>');
const adminPanel=u.role==='admin'?`<div id="wlAdminOverlay" style="display:none;position:fixed;inset:0;background:#f0f6f3;z-index:99999;flex-direction:column"><div style="background:#fff;padding:12px 18px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 2px 12px #0001;font-family:system-ui"><strong>🌿 旺林｜學員管理</strong><button type="button" onclick="wlCloseAdmin()" style="background:#2f625c;color:white;border:0;border-radius:10px;padding:10px 18px;cursor:pointer">← 返回圖文選單設計</button></div><iframe id="wlAdminFrame" title="學員管理" style="width:100%;flex:1;border:0" loading="lazy"></iframe></div><script>function wlOpenAdmin(){document.getElementById('wlAdminOverlay').style.display='flex';document.getElementById('wlAdminFrame').src='/admin'}function wlCloseAdmin(){document.getElementById('wlAdminOverlay').style.display='none';document.getElementById('wlAdminFrame').src='about:blank'}</script>`:'';
html=html.replace('</body>',adminPanel+'<div style="position:fixed;right:16px;bottom:14px;background:#fff;padding:8px 12px;border-radius:12px;box-shadow:0 3px 20px #0002;z-index:999"><button type="button" id="adminLink" onclick="wlOpenAdmin()" style="border:0;background:#2f625c;color:white;padding:8px 14px;border-radius:9px;cursor:pointer">⚙ 學員管理</button>　<a href="#" onclick="fetch(\'/api/session\',{method:\'POST\'}).then(()=>location.href=\'/\');return false">登出</a></div><script>if('+JSON.stringify(u.role)+'!=="admin")document.getElementById("adminLink").remove();</script></body>');
res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','private, no-store');return res.end(html);
}catch(e){res.status(500).end('系統暫時無法開啟')}};