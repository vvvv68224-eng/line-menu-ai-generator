const {sql,init,token}=require('./_auth');
module.exports=async(req,res)=>{
res.setHeader('Cache-Control','no-store');res.setHeader('Referrer-Policy','no-referrer');
if(req.method!=='GET')return res.status(405).end('Method not allowed');
const key=String(req.query?.key||'');
if(!/^[a-f0-9]{64}$/.test(key))return res.status(403).send('連結無效，請向管理員索取新的專屬連結');
try{
await init();
const rows=await sql`SELECT * FROM wanglin_users WHERE access_key=${key} AND role='student'`;
const u=rows[0];
if(!u||u.disabled)return res.status(403).send('連結無效或已停用，請聯絡管理員');
if(u.expires_at&&new Date(u.expires_at).getTime()<=Date.now())return res.status(403).send('使用期限已到期，請聯絡管理員');
if(!u.first_login_at){
const updated=await sql`UPDATE wanglin_users SET first_login_at=NOW(),expires_at=NOW()+duration_days*INTERVAL '1 day' WHERE id=${u.id} AND first_login_at IS NULL RETURNING *`;
if(updated.length)Object.assign(u,updated[0]);
}
res.setHeader('Set-Cookie','wl_session='+token(u)+'; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200');
res.writeHead(303,{Location:'/tool'});return res.end();
}catch(e){return res.status(500).send('暫時無法開啟，請稍後再試')}
};
