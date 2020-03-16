//criando servidor http na porta 3000
var app = require('http').createServer(resposta);
var fs = require('fs');

  
app.listen(3000);
console.log("Aplicação está em execução...");
  //function respsta com dois parametros: requisicao e resposta.
function resposta (req, res) {
     var arquivo = "";
     if(req.url == "/"){
         arquivo = __dirname + '/index.html';
     }else{
         arquivo = __dirname + req.url;
     }
     fs.readFile(arquivo,
         function (err, data) {
              if (err) {
                   res.writeHead(404);
                   return res.end('Página ou arquivo não encontrados');
              }
              //cod. 200 de sucesso.
              res.writeHead(200);
              //resposta do servidor.
              res.end(data);
         }
     );
}