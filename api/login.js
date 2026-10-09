const {sql,init,hash,check,token,json,method}=require('./_auth');
module.exports=async(req,res)=>{if(!method(req,res,['POST']))return;try{
const email=String(req.body?.email||'').trim().toLowerCase(),password=String(req.body?.password||'');
if(!email||password.length<8||password.length>256)return json(res,400,{error:'請輸入正確帳號與密碼'});
await init();
if(email===String(process.env.ADMIN_EMAIL||'').toLowerCase()&&process.env.ADMIN_INITIAL_PASSWORD){
const exists=await sql`SELECT id FROM wanglin_users WHERE email=${email}`;
if(!exists.length){const h=hash(process.env.ADMIN_INITIAL_PASSWORD);await sql`INSERT INTO wanglin_users(email,password_hash,role) VALUES(${email},${h},'admin') ON CONFLICT(email) DO NOTHING`}}
const rows=await sql`SELECT * FROM wanglin_users WHERE email=${email}`,u=rows[0];
if(!u||!check(password,u.password_hash))return json(res,401,{error:'帳號或密碼錯誤'});
if(u.disabled)return json(res,403,{error:'帳號已停用'});
if(u.role!=='admin'){if(u.expires_at&&new Date(u.expires_at).getTime()<=Date.now())return json(res,403,{error:'使用期限已到期'});
if(!u.first_login_at){const updated=await sql`UPDATE wanglin_users SET first_login_at=NOW(),expires_at=NOW()+duration_days*INTERVAL '1 day' WHERE id=${u.id} AND first_login_at IS NULL RETURNING *`;if(updated.length)Object.assign(u,updated[0])}}
res.setHeader('Set-Cookie','wl_session='+token(u)+'; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200');
return json(res,200,{ok:true,role:u.role,email:u.email,expires_at:u.expires_at});
}catch(e){return json(res,500,{error:'登入服務暫時無法使用'})}};