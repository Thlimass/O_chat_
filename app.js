//criando servidor http na porta 3000
var app = require('http').createServer(resposta);
var fs = require('fs');
//incluindo na aplicação o Socket.IO
var io = require('socket.io')(app);
var usuarios = [];
var ultimas_mensagens = [];

app.listen(3000);
console.log("Aplicação está em execução...");

//function respsta com dois parametros: requisicao e resposta.
function resposta(req, res) {
    var arquivo = "";
    if (req.url == "/") {
        arquivo = __dirname + '/index.html';
    } else {
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

//resposta a conexao do cliente ao servidor.
io.on("connection", function(socket){
	// Método de resposta ao evento de entrar
	socket.on("entrar", function(apelido, callback){
		if(!(apelido in usuarios)){
			socket.apelido = apelido;
			usuarios[apelido] = socket; // Adicionadno o nome de usuário a lista armazenada no servidor

			// Enviar para o usuário ingressante as ultimas mensagens armazenadas.
			for(indice in ultimas_mensagens){
				socket.emit("atualizar mensagens", ultimas_mensagens[indice]);
			}


			var mensagem = "[ " + pegarDataAtual() + " ] " + apelido + " acabou de entrar na sala";
			var obj_mensagem = {msg: mensagem, tipo: 'sistema'};

			io.sockets.emit("atualizar usuarios", Object.keys(usuarios)); // Enviando a nova lista de usuários
			io.sockets.emit("atualizar mensagens", obj_mensagem); // Enviando mensagem anunciando entrada do novo usuário

			armazenaMensagem(obj_mensagem); // Guardando a mensagem na lista de histórico

			callback(true);
		}else{
			callback(false);
		}
	});



//quando o cliente acessar a pagina, ela aciona o servidor. com os paramentros abaixo.
socket.on("enviar mensagem", function (dados, callback) {
    var mensagem_enviada = dados.msg;
    var usuario = dados.usu;
    if (usuario == null)
        usuario = '';

    mensagem_enviada = "[ " + pegarDataAtual() + " ] " + socket.apelido + " diz: " + mensagem_enviada;
    var obj_mensagem = { msg: mensagem_enviada, tipo: '' };

    if (usuario == '') {
        io.sockets.emit("atualizar mensagens", obj_mensagem);
        armazenaMensagem(obj_mensagem);
    } else {
        obj_mensagem.tipo = 'privada';
        socket.emit("atualizar mensagens", obj_mensagem);
        usuarios[usuario].emit("atualizar mensagens", obj_mensagem);
    }
    callback();
});

        socket.on("disconnect", function () {
        delete usuarios[socket.apelido];
        var mensagem = "[ " + pegarDataAtual() + " ] " + socket.apelido + " saiu da sala";
         var obj_mensagem = { msg: mensagem, tipo: 'sistema' };

        io.sockets.emit("atualizar usuarios", Object.keys(usuarios));
         io.sockets.emit("atualizar mensagens", obj_mensagem);

         armazenaMensagem(obj_mensagem);
        });

});

// Função para apresentar uma String com a data e hora em formato DD/MM/AAAA HH:MM:SS
function pegarDataAtual() {
    var dataAtual = new Date();
    var dia = (dataAtual.getDate() < 10 ? '0' : '') + dataAtual.getDate();
    var mes = ((dataAtual.getMonth() + 1) < 10 ? '0' : '') + (dataAtual.getMonth() + 1);
    var ano = dataAtual.getFullYear();
    var hora = (dataAtual.getHours() < 10 ? '0' : '') + dataAtual.getHours();
    var minuto = (dataAtual.getMinutes() < 10 ? '0' : '') + dataAtual.getMinutes();
    var segundo = (dataAtual.getSeconds() < 10 ? '0' : '') + dataAtual.getSeconds();

    var dataFormatada = dia + "/" + mes + "/" + ano + " " + hora + ":" + minuto + ":" + segundo;
    return dataFormatada;
}
//function para guardar as mensagens e seu tipo na variavel de ultimas msg.
function armazenaMensagem(mensagem) {
    if (ultimas_mensagens.length > 5) {
        ultimas_mensagens.shift();
    }

    ultimas_mensagens.push(mensagem);
}



