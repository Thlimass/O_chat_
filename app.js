//criando servidor http na porta 3000
var app = require('http').createServer(resposta);
var fs = require('fs');

app.listen(3000);
console.log("Aplicação está em execução...");
//function resposta com dois parametros: requisicao e resposta.
function resposta (req, res) {
    fs.readFile(__dirname + '/index.html',
    function (err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Erro ao carregar o arquivo index.html');
        }
        //cod. 200 de sucesso.
     res.writeHead(200);
     //resposta do servidor.
     res.end(data);
    });
    
}