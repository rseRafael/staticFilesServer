const express = require("express");
const app = express();
const http = require("http");


app.use((req, res, next)=>{
    console.log("Method: " + req.method);
    if(req.headers.referer !== undefined){
        console.log("Setting a header to " + req.headers.referer);
        res.setHeader("Access-Control-Allow-Origin", req.headers.referer);
        res.header("Access-Control-Allow-Origin", req.headers.referer);
    }
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8083/test");
    next();
});
app.use(function(req, res, next) {
    console.log("done")
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
function SetStatic(res, next){
    console.log("setting static files");
    var options = {
        protocol: 'http:', 
        host: "localhost",
        port: 8000,
        path: "/books/get/", 
        method: "GET",
    };
    http.get(options, (response)=>{

        response.on('data',(chunk)=>{
            json = JSON.parse(chunk.toString());
            for(var prop in json){
               var path  = json[prop]['imgsPATH'];
               var virtualPath = `/book${json[prop]['id']}`;
               app.use(virtualPath, express.static(path));
               console.log(path, virtualPath);            
            }
        });

        response.on('end', ()=>{
            if(res){
                res.send("success");
            }
            if(next){
                next();
            }
        });

        response.on('error', (err)=>{
            if(res){
                res.send("fail");
            }
            if(next){
                next();
            }
        });
    });
}
app.use((req, res, next)=>{
    console.log("runnig middleware");
    SetStatic(undefined, next);
});

app.get("/", (req, res)=>{
    res.send("<h4>Welcome</h4>")
});

app.get("/test", (req, res)=>{
    var myJson = { "content": true};
    res.send(JSON.stringify(myJson));
})
app.listen(8080, ()=>{
    console.log("http://localhost:8080/");
});