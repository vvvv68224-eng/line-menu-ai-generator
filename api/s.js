const {sql,init}=require('./_auth');
module.exports=async(req,res)=>{
res.setHeader('Cache-Control','no-store');res.setHeader('Referrer-Policy','no-referrer');
if(req.method!=='GET')return res.status(405).end('Method not allowed');
const code=String(req.query?.c||'').toLowerCase();
if(!/^[a-f0-9]{16}$/.test(code))return res.status(403).send('連結無效，請向老師索取新連結');
try{await init();const rows=await sql`SELECT access_key FROM wanglin_users WHERE LEFT(access_key,16)=${code} LIMIT 2`;
if(rows.length!==1)return res.status(403).send('連結無效，請向老師索取新連結');
res.writeHead(303,{Location:'/api/access?key='+rows[0].access_key});return res.end();
}catch(e){return res.status(500).send('暫時無法開啟，請稍後再試')}
};
