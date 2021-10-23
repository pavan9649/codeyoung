
const express =require(`express`);
const { translate } = require('bing-translate-api');
const dotenv=require("dotenv")
const con =require("./config/db")
const path =require('path')
const app=express();
const bodyParser= require('body-parser');
const LanguageDetect = require('languagedetect');
const lngDetector = new LanguageDetect();
dotenv.config({ path: './config.env'})
const port=process.env.PORT||4000;
app.use(bodyParser.urlencoded({
    extended:true
}))
app.use(bodyParser.json());


app.post("/",async(req,res)=>{
   
    let text =req.body.text;
    let language=req.body.language;
    let check=lngDetector.detect(text) // check source language type 
    let value;
    con.query(`SELECT result_text FROM languageconvert WHERE text ='${text}'`, function (err, result) { // fetch data from database
      if (err)
      {
        console.log()
      }
     
      if(result.length)
      {
        
          data={
            text:text,
            sourcelanguage:check[0][0],
            targetlanuage:language,
            result:result[0].result_text,
            
            
        }
       res.send(data);
      }
      else{

        translate(`${text}`, null, `${language}`, true).then(  (data) => { // translation API bing

          value=   data.translation;
          data={
            text:text,
            sourcelanguage:check[0][0],
            targetlanuage:language,
            result:value
            
        }
        var sql = `INSERT INTO languageconvert  VALUES (null,'${text}','${language}', '${value}')`;  // insert value in databse
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
        res.send(data)
        }).catch(err => {
          console.error(err);
        })   
        
     
      }
    })
  

})


app.listen(port,()=>{
    console.log(`server is running at port no ${port}`);
})