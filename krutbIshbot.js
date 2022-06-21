const tmi = require('tmi.js');
const commandsJSON = require("./commandsJSON.json");
const banwordJSON = require("./banwordJSON.json");
const { escapeRegExp } = require('./escapeRegExp'); 

let session_messages = {};


const client = new tmi.Client({
  options: { debug: true },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: 'leynov192',
    password: 'oauth:hy6g3vgzcdhvjtgunzoxhwec59kmn1'
  },
  channels: ["plst1q"] 
});
client.connect();

process.title = `STB: <${client.opts.identity.username}> ${client.opts.channels}`;


client.on("chat", (channel, user, message, self) => {
  if (self) return;

  // добавление названия канала и сообщения в объект
  user.channel = channel
  user.message = message

  // логирование сообщений текущей сессии для massban функции
  if (!session_messages[`${channel}`]) {
    session_messages[`${channel}`] = [];
  }
  session_messages[`${channel}`].push(user);

  // команды модератора
 if (user.username == "leynov192" || user.username == "konanykhin" || user.username == "gagagagauze")
    {




    if (message == "!showmsg") {
      console.log(session_messages);
    }  
    
    

    if (message == "test") {
      // установка таймаута для цикла
      for (let i = 1; i < 2; i++) {
        setTimeout(function() {
          client.say(user.channel, "test"+' '+i);
        }, 300*i);
      }
    }
    if (message == "ping") {
      setTimeout(function() {
        client.say(user.channel, "pong");
      }, 500);
    }
    // включение сабмода и очистка чата отключение сабмода
    if (message.toLowerCase() == "!cl") {
      client.say(user.channel, "/subscribers");
      setTimeout(function() {
        client.say(user.channel, "/clear");
      }, 1000);
      setTimeout(function() {
        client.say(user.channel, "/subscribersoff");
      }, 2000);
    }
    
    mass_ban(user);
    moderator_spam_commands(user);
    moderator_spam(user);
  }
  if (user.username == "hh", "1h"){
  bans(user);
  }
});

    


function mass_ban(user) {
  // console.log("Massban command - ok")
  let parse_message = user.message.split(" ");
  let parsed_command = parse_message.shift();
  let parsed_fullmsg = escapeRegExp(parse_message.join(" "));

  // console.log(parse_message);
  // console.log(parsed_command);
  // console.log(parsed_fullmsg);

  if (parsed_command.toLowerCase() == "!mb") {
    let channel_msgs = session_messages[user.channel];
    // список пользователей
    // сообщения которых будут удалены
    let collect_user_names = [];

    // ищем совпадения во всех сообщениях текущей сессии
    for (let key in channel_msgs) {
      if (channel_msgs[key].isban) { continue }
      if (channel_msgs[key].mod) { continue }
      // пропускаем если сообщение равно сообщению модератора
      // необходимо для пропуска своего же сообщения
      if (channel_msgs[key].message == user.message) { continue }

      // поиск совпадений в сообщениях текущей сессии бота
      if (channel_msgs[key].message.search(parsed_fullmsg) != -1) {
        // добавление имени пользователя в массив
        collect_user_names.push(channel_msgs[key].username);
        // выводим в консоль совпавшее сообщение
        console.log("Matched message:", channel_msgs[key].username, ":", channel_msgs[key].message);
        channel_msgs[key].isban = true;
      }
    }

    // получение количества пользователей
    // сообщения которых будут удалены
    let count = [...new Set(collect_user_names)];
    console.log("Count chatters:", count.length);
    client.say(user.channel, `Забанено`);

    // бан спамеров
    for (let key in count) {
      setTimeout(function() {
        client.ban(user.channel, count[key], "масс бан :)")
        .then((data) => {
          // data returns [channel, username, seconds, reason]
          console.log(data);
        }).catch((err) => {
          //
          console.log(err);
        });
        console.log("ban user -", count[key]);
      }, 300*key);
    }

  }
}
function bans(user){
//бан за слова
let parse_message = user.message.split(" ");
let mssgban = parse_message.slice(0, 1)
let parsed_command = parse_message.shift();
let parsed_fullmsg = escapeRegExp(parse_message.join(" "));
for(let banss in banwordJSON.banwords)
if (mssgban == banss) {
    let channel_msgs = session_messages[user.channel];
    let collect_user_names = [];
for (let key in channel_msgs) {
      if (channel_msgs[key].isban) { continue }
      if (channel_msgs[key].mod) { continue }
      if (channel_msgs[key].message.search(parsed_fullmsg) != -1) {
        collect_user_names.push(channel_msgs[key].username);
        console.log("Matched message:", channel_msgs[key].username, ":", channel_msgs[key].message);
        channel_msgs[key].isban = true;
        
      }
    }
    let names = [...new Set(collect_user_names)];
    console.log("Count chatters:", names.length);
    client.say(user.channel, `Забанен`);
    for (let key in names) {
      setTimeout(function() {
        client.ban(user.channel, names[key], "banw")
        .then((data) => {
          // data returns [channel, username, seconds, reason]
          console.log(data);
        }).catch((err) => {
          //
          console.log(err);
        });
        console.log("ban user -", names[key]);
      }, 300*key);
    }
    
  }
}

function moderator_spam_commands(user) {
// спам рекламой
    for (let key in commandsJSON.commands){
      let keys = user.message.split(' ');
      let keyl = keys.slice(0, 1);
      let key = keyl.join('');
      let ms = keys.slice(1,2);
      let mss = ms.join(' ');
      if (mss < 15) {
        if(key == "!дс") {
          for (let y = 0; y < mss; y++) {
          client.say(user.channel, commandsJSON.commands[key]);
        }
        break
      
      }
     if(key == "!инст") {
          for (let y = 0; y < mss; y++) {
          client.say(user.channel, commandsJSON.commands[key]);
        }
        break
        
      }
     if(key == "!тг") {
          for (let y = 0; y < mss; y++) {
          client.say(user.channel, commandsJSON.commands[key]);
        }
        break
      
      }
      if(key == "!донат") {
          for (let y = 0; y < mss; y++) {
          client.say(user.channel, commandsJSON.commands[key]);
        }
        break
      
      }
      if(key == "!чат") {
          for (let y = 0; y < mss; y++) {
          client.say(user.channel, commandsJSON.commands[key]);
        }
        break
      }
     }
    // изображения текстом
    for (let key in commandsJSON.textPuctures) {
      if (user.message == key) {
        client.say(user.channel, commandsJSON.textPuctures[key]);
        break
      }
    }

  }

}
function moderator_spam (user) {
  for(let lolk in user.message) {
    let m = user.message.split(" ");
    let sm = m.slice(2);
    let smm = sm.join(' ');
    let ms = m.slice(1,2);
    let mss = ms.join(' ');
    if (mss < 15){
      if ( m[0] == "!spam") {
        for (let y = 0; y < mss; y++) {
            client.say(user.channel, smm );
          }
          break
      }    
    }
  }
}
