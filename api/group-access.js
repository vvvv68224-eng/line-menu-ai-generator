const {sql,init,token}=require('./_auth');
module.exports=async(req,res)=>{
res.setHeader('Cache-Control','no-store');res.setHeader('Referrer-Policy','no-referrer');
const key=String(req.query?.key||req.body?.key||'');
if(!/^[a-f0-9]{64}$/.test(key))return res.status(403).send('課程連結無效');
try{
await init();
const groups=await sql`SELECT id,name FROM wanglin_groups WHERE access_key=${key}`;
if(!groups.length)return res.status(403).send('課程連結無效，請聯絡管理員');
if(req.method==='GET'){
const safe=groups[0].name.replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
return res.status(200).setHeader('Content-Type','text/html; charset=utf-8').send(`<!doctype html><html lang="zh-Hant"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>旺林｜課程學員入口</title><style>body{font-family:system-ui,"Microsoft JhengHei";background:#f6f4ed;color:#555047;min-height:100vh;display:grid;place-items:center;margin:0;padding:20px}.card{background:#fffefa;padding:35px;border-radius:22px;max-width:420px;width:100%;box-sizing:border-box;box-shadow:0 12px 35px #4d473315}input,button{width:100%;box-sizing:border-box;border-radius:12px;padding:14px;margin-top:12px;font:inherit}input{border:1px solid #ddd7c9}button{background:#817d70;color:white;border:0;cursor:pointer}p{line-height:1.7;color:#827c70}</style><div class="card"><h2>🌿 旺林｜${safe}</h2><p>請輸入老師事先登記的 Email，即可開始設計。<br>使用期限從第一次進入開始計算。</p><form method="POST"><input name="email" type="email" placeholder="學員 Email" required autocomplete="email"><button>開始我的設計</button></form></div></html>`);
}
if(req.method!=='POST')return res.status(405).end();
const email=String(req.body?.email||'').trim().toLowerCase();
if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).send('請輸入正確 Email');
const rows=await sql`SELECT * FROM wanglin_users WHERE group_id=${groups[0].id} AND email=${email} AND role='student'`;
const u=rows[0];
if(!u)return res.status(403).send('此 Email 不在本期課程名單內，請聯絡老師');
if(u.disabled)return res.status(403).send('此學員已停用');
if(u.expires_at&&new Date(u.expires_at).getTime()<=Date.now())return res.status(403).send('使用期限已到期');
if(!u.first_login_at){const updated=await sql`UPDATE wanglin_users SET first_login_at=NOW(),expires_at=NOW()+duration_days*INTERVAL '1 day' WHERE id=${u.id} AND first_login_at IS NULL RETURNING *`;if(updated.length)Object.assign(u,updated[0])}
res.setHeader('Set-Cookie','wl_session='+token(u)+'; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200');
res.writeHead(303,{Location:'/tool'});return res.end();
}catch(e){return res.status(500).send('服務暫時無法使用，請稍後重試')}
};
