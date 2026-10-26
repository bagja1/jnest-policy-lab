'use strict';
module.exports=function status(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json; charset=utf-8');
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).json({error:'GET only'});}
 return res.status(200).json({backend:true,configured:Boolean(process.env.OPENAI_API_KEY),note:'Configured does not verify validity of the key.'});
};
