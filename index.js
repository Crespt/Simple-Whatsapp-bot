
const { create, Client, mediaTypes, decryptMedia } = require('@open-wa/wa-automate');
const googletts = require('google-tts-api');
const mime = require('mime-types');


const start = async (client = new Client()) => {
        console.log('Bot iniciado, keskara né') 

        client.onMessage(async msg =>{
          
          //text to speech 
          if(msg.body.toLocaleLowerCase().startsWith('!!tts')){
            let split = msg.body.split('!!tts ');
            
            if(split[0] + split[1] === '!!ttsundefined'){
                client.sendText(msg.from,'manda a mensagem, pô');
                return;
            }
            let som = String(split[0] + split[1]);
            googletts(som, 'pt-BR', 1)
            .then((url) => {
                console.log(url);
                client.sendText(msg.from,url);
            })
            .catch((err) =>{
                console.log(err);
                client.sendText(msg.from,`a mensagem que você mandou tem mais de 200 caracteres, ela tem ${String(som).length} caracteres`);
            });
          }

          if(msg.body.toLocaleLowerCase().startsWith('!!stickerurl')){
              let split = msg.body.split('!!stickerurl ');
              let url = split[1];
              client.sendStickerfromUrl(msg.from, url);
          }

          if(msg.isMedia && msg.caption.toLocaleLowerCase() === '!!sticker'){
              const mediaData = await decryptMedia(msg);
              await client.sendImageAsSticker(msg.from, `data:${msg.mimetype};base64,${mediaData.toString('base64')}`)            
          }

          if(msg.body.toLocaleLowerCase() === '!!ajuda'){
              client.sendText(msg.from,"Comandos:\n *[!!tts]* envia um áudio com sua mensagem(ainda incompleto, enviando link)\n sintaxe: !!tts mensagem\n \n *[!!stickerurl]* transforma uma imagem em um sticker\n sintaxe: !!stickerurl urldaimagem\n \n *[!!sticker]* mande uma imagem e ele converte para um sticker\n sintaxe: !!sticker arquivo da imagem")
          }
          
        });
      }

        create()
    .then(client => start(client))