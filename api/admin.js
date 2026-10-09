const {sql,current,init,hash,json}=require('./_auth');
module.exports=async(req,res)=>{try{const admin=await current(req);if(!admin||admin.role!=='admin')return json(res,403,{error:'僅限管理員'});await init();
if(req.method==='GET'){const rows=await sql`SELECT id,email,role,duration_days,first_login_at,expires_at,disabled,created_at FROM wanglin_users WHERE role='student' ORDER BY created_at DESC`;return json(res,200,{students:rows})}
if(req.method!=='POST')return json(res,405,{error:'不支援此操作'});
const b=req.body||{},action=String(b.action||''),id=String(b.id||''),email=String(b.email||'').trim().toLowerCase(),days=Number(b.days),password=String(b.password||'');
if(action==='create'){if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||password.length<8||password.length>256||!Number.isInteger(days)||days<1||days>365)return json(res,400,{error:'請填正確 Email、至少 8 字密碼及 1–365 天期限'});
const h=hash(password);await sql`INSERT INTO wanglin_users(email,password_hash,duration_days) VALUES(${email},${h},${days})`;return json(res,200,{ok:true})}
if(!/^\d+$/.test(id))return json(res,400,{error:'學員資料錯誤'});
if(action==='disable'){await sql`UPDATE wanglin_users SET disabled=${Boolean(b.disabled)} WHERE id=${id} AND role='student'`}
else if(action==='extend'){if(!Number.isInteger(days)||days<1||days>365)return json(res,400,{error:'天數必須為 1–365'});await sql`UPDATE wanglin_users SET duration_days=duration_days+${days},expires_at=CASE WHEN first_login_at IS NULL THEN NULL ELSE GREATEST(COALESCE(expires_at,NOW()),NOW())+${days}*INTERVAL '1 day' END WHERE id=${id} AND role='student'`}
else if(action==='password'){if(password.length<8||password.length>256)return json(res,400,{error:'密碼至少 8 字'});const h=hash(password);await sql`UPDATE wanglin_users SET password_hash=${h} WHERE id=${id} AND role='student'`}
else return json(res,400,{error:'未知操作'});
return json(res,200,{ok:true});
}catch(e){if(e.code==='23505')return json(res,409,{error:'Email 已經存在'});return json(res,500,{error:'管理操作失敗'})}};