process.env.NTBA_FIX_319 = 1

// 
// Requires
// 
const TelegramBot = require('node-telegram-bot-api')
const mysql = require('mysql')
const dotenv = require('dotenv')
dotenv.config()

const token = process.env.APIKEY
const mysql_hostname = process.env.MYSQLHOSTNAME
const mysql_username = process.env.MYSQLUSERNAME
const mysql_password = process.env.MYSQLPASSWORD
const mysql_database = process.env.MYSQLDATABASE
const debug = 0


const bot = new TelegramBot(token, {
    polling: true
})

/*
--------------------------------
----- CONSTS EN FUNCTIONS  -----
--------------------------------
*/

// 
// Menu's
// 

// Authorized
const opts_authorized = {
  reply_markup:{
    keyboard: [
      ['/voorraad'],
      ['/bestel'],
      ['/status'],
      ['/contact']
    ]
  },
  parse_mode: 'Markdown'
}
// Unauthorized
const opts_unauthorized = {
  reply_markup:{
    keyboard: [
      ['/registreer']
    ]
  },
  parse_mode: 'Markdown'
}
// Registration pending
const opts_pending = {
  reply_markup:{
    keyboard: [
      ['/registreer status']
    ]
  },
  parse_mode: 'Markdown'
}
// Registration declined
const opts_declined = {
  reply_markup:{
    keyboard: [
      ['/registreer status'],
      ['/chatid']
    ]
  },
  parse_mode: 'Markdown'
}
// Help section
const opts_help = {
  reply_markup:{
    keyboard: [
      ['/gebruikersnaam android'],
      ['/gebruikersnaam iphone'],
      ['/gebruikersnaam pc']
    ]
  },
  parse_mode: 'Markdown'
}
// End of help section
const opts_helpdone = {
  reply_markup:{
    keyboard: [
      ['/start'],
    ]
  },
  parse_mode: 'Markdown'
}
// Random number for order number
function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}
// Check if user is authorized
function isAuthorized(id, callback) {
  var mysql = require('mysql')
  var con = mysql.createConnection({
      host: mysql_hostname,
      user: mysql_username,
      password: mysql_password,
      database: mysql_database
  })
  con.connect(function(err) {
    if (err) throw err
    con.query(`SELECT telegram_chatid, authorized FROM authorized_users WHERE telegram_chatid=${id}`, function (err, rows, fields) {
      if (err) throw err
      if (rows.length > 0) {
         callback(rows[0].authorized)
      } else {
        callback(5)
      }
    })        
  }) 
}
/*
--------------------------
----- START COMMANDO -----
--------------------------
*/

bot.onText(/\/start/i, function(msg, match) {
  const username = msg.chat.username
  const chatId = msg.chat.id

  isAuthorized(chatId, function(result){
    console.log("Recieved start command with result " + result)
    
    if (result == 0) return bot.sendMessage(msg.from.id, "*Je registratiestatus:*\nJe registratie is nog niet geaccepteerd.", opts_pending)
    if (result == 1) return bot.sendMessage(msg.from.id, "*Welkom! Kies een van de opties:*", opts_authorized)
    if (result == 2) return bot.sendMessage(msg.from.id, "*Je registratiestatus:*\nJe registratie is geweigerd. \n*Je chatID is:* " + chatId, opts_pending)
    
    bot.sendMessage(msg.from.id, "*Je hebt nog geen machtiging om deze bot te gebruiken.\nKlik op de registreer knop om je te registreren:*", opts_unauthorized)
  })
})


/* Registreer */
bot.onText(/\/registreer$/i, function(msg, match) {
  const username = msg.chat.username
  const chatId = msg.chat.id
  if (username != undefined) { 
    isAuthorized(chatId, function(result){
      console.log("Recieved register command with result " + result)

      if (result == 0) return bot.sendMessage(msg.from.id, "*Je registratiestatus:*\nJe registratie is nog niet geaccepteerd.", opts_pending)
      if (result == 1) return bot.sendMessage(msg.from.id, "*Welkom! Kies een van de opties:*", opts_authorized)
      if (result == 2) return bot.sendMessage(msg.from.id, "*Je registratiestatus:*\nJe registratie is geweigerd. \n*Je chatID is:* " + chatId, opts_pending)
      
      var mysql = require('mysql')
      var con = mysql.createConnection({
        host: mysql_hostname,
        user: mysql_username,
        password: mysql_password,
        database: mysql_database
      })
      con.connect(function(err) {
        if (err) throw err
        var sql = `INSERT INTO authorized_users (telegram_chatid, telegram_username) VALUES ('${chatId}', '${username}')`
        con.query(sql, function (err, result) {
            if (err) throw err
            console.log("1 new user inserted")
            bot.sendMessage(chatId, "Je registratie word in behandeling genomen.", opts_pending)
            bot.sendMessage(5229693748, "Nieuwe gebruiker met gebruikersnaam *" + username + "* heeft toestemming nodig om de bot te gebruiken, id:")
            bot.sendMessage(5229693748, chatId)
        })
      })
    })
  } else {
    bot.sendMessage(chatId, "Voeg eerst een gebruikersnaam toe aan uw telegram account, anders kunnen we geen contact met je opnemen. (/help gebruikersnaam)", opts_unauthorized)
  }
})

bot.onText(/\/registreer (.+)/i, function(msg, match) { 
  const data = match[1]
  const chatId = msg.chat.id
  if (data != 'status') return
  
  isAuthorized(chatId, function(result){
    console.log("Recieved register command with result " + result)

    if (result == 0) return bot.sendMessage(msg.from.id, "*Je registratiestatus:*\nJe registratie is nog niet geaccepteerd.", opts_pending)
    if (result == 1) return bot.sendMessage(msg.from.id, "*Welkom! Kies een van de opties:*", opts_authorized)
    if (result == 2) return bot.sendMessage(msg.from.id, "*Je registratiestatus:*\nJe registratie is geweigerd. \n*Je chatID is:* " + chatId, opts_pending)
    bot.sendMessage(msg.from.id, "*Je hebt je nog niet geregistreerd:*", opts_unauthorized)
  })
})
/*
-----------------------------
----- VOORRAAD COMMANDO -----
-----------------------------
*/
bot.onText(/\/voorraad/i, function(msg, match) {
  const username = msg.chat.username
  const chatId = msg.chat.id

  isAuthorized(chatId, function(result){
    console.log("Recieved supply command with result " + result)

    if (result == 0) return bot.sendMessage(msg.from.id, "*Je registratiestatus:*\nJe registratie is nog niet geaccepteerd.", opts_pending)
    if (result == 2) return bot.sendMessage(msg.from.id, "*Je registratiestatus:*\nJe registratie is geweigerd. \n*Je chatID is:* " + chatId, opts_pending)
    if (result == 5) return bot.sendMessage(msg.from.id, "*Je hebt nog geen machtiging om deze bot te gebruiken.\nKlik op de registreer knop om je te registreren:*", opts_unauthorized)
    if (result == 1) {
      (async () => {
        await bot.sendMessage(msg.from.id, "*Onze voorraad:*", opts_authorized)
    
        var mysql = require('mysql')
        var con = mysql.createConnection({
            host: mysql_hostname,
            user: mysql_username,
            password: mysql_password,
            database: mysql_database
          })
    
          con.connect(function(err) {
            if (err) throw err
            con.query('SELECT product, quantity FROM products WHERE quantity > 0', function (err, rows, fields) {
              if (err) throw err
              rows.forEach(function(row) {
                  const result = row.product + " \n"
                  bot.sendMessage(msg.chat.id, result)
                })
            })        
          }) 
      })()
    }
  })
})

/*
-----------------------------
----- BESTEL COMMANDO'S -----
-----------------------------
*/

/* 
    Standaard
*/
bot.onText(/^\/bestel$/i, function(msg, match) {
  const username = msg.chat.username
  const chatId = msg.chat.id

  isAuthorized(chatId, function(result){
    console.log("Recieved standard order command with result " + result)

    const response = "*Producten bestellen:* \n/bestel [product] [hoeveelheid] \n\n*Voorbeeld:* \n /bestel iets 3"
    const chatId = msg.chat.id

    if (result == 0) 
      return bot.sendMessage(msg.from.id, "*Je registratiestatus:*\nJe registratie is nog niet geaccepteerd.", opts_pending)
    if (result == 1)
      return bot.sendMessage(chatId, response, opts_authorized)
    if (result == 2) 
      return bot.sendMessage(msg.from.id, "*Je registratiestatus:*\nJe registratie is geweigerd. \n*Je chatID is:* " + chatId, opts_pending)
    if (result == 5) 
      return bot.sendMessage(msg.from.id, "*Je hebt nog geen machtiging om deze bot te gebruiken.\nKlik op de registreer knop om je te registreren:*", opts_unauthorized)
  }) 
})

/*
    Met data
*/
bot.onText(/\/bestel (.+) (\d+)/i, function(msg, match) {
  const chatId = msg.chat.id

  isAuthorized(chatId, function(result){
    console.log("Recieved order command with result " + result)

    if (result == 0) 
      return bot.sendMessage(msg.from.id, "*Je registratiestatus:*\nJe registratie is nog niet geaccepteerd.", opts_pending)
    if (result == 2) 
      return bot.sendMessage(msg.from.id, "*Je registratiestatus:*\nJe registratie is geweigerd. \n*Je chatID is:* " + msg.from.id, opts_pending)
    if (result == 5) 
      return bot.sendMessage(msg.from.id, "*Je hebt nog geen machtiging om deze bot te gebruiken.\nKlik op de registreer knop om je te registreren:*", opts_unauthorized)
    
    const product = match[1]
    const amount = match[2]
    const chatId = msg.chat.id
    const username = msg.chat.username
    const orderid = getRandomInt(999999999)
    var con1 = mysql.createConnection({
      host: mysql_hostname,
      user: mysql_username,
      password: mysql_password,
      database: mysql_database
    })
    con1.connect(function(err) {
      if (err) throw err  
      con1.query(`SELECT * FROM products WHERE product ='${product}' AND quantity >= ${amount}` , function (err, rows, fields) {
        if (err) throw err
        if (rows.length > 0) { 
          var mysql = require('mysql')
          var con2 = mysql.createConnection({
            host: mysql_hostname,
            user: mysql_username,
            password: mysql_password,
            database: mysql_database
          })
        con2.connect(function(err) {
            if (err) throw err
            var sql = `UPDATE products SET quantity = quantity - ${amount} WHERE product = '${product}'`
            con2.query(sql, function (err, result) {
              if (err) throw err
              console.log(result.affectedRows + " record(s) updated")
            })
          })
          const response = `*Bestelling geplaatst* \n \n*Gebruikersnaam:*  \n${username} \n*Product:* \n${product} \n*Hoeveelheid:* \n${amount}\n\n*Order nummer:* \n${orderid} \n \n*Voor vragen, gebruik de het /contact commando.*`
          var mysql = require('mysql')
          var con = mysql.createConnection({
            host: mysql_hostname,
            user: mysql_username,
            password: mysql_password,
            database: mysql_database
          })
          con.connect(function(err) {
            if (err) throw err
            var sql = `INSERT INTO orders (username, orderinfo, amount, ordernumber) VALUES ('${username}', '${product}', ${amount}, ${orderid})`
            con.query(sql, function (err, result) {
                if (err) throw err
                console.log("1 order inserted")
                bot.sendMessage(chatId, response, opts_authorized)
                bot.sendMessage(5229693748, "Nieuwe bestelling met bestelnummer " + orderid + " geplaatst.")
            })
          })
        } else {
          bot.sendMessage(msg.chat.id, `*Het product "${product}" bestaat niet of er is niet genoeg voorraad. Controleer je bestelling.*`, opts_authorized)
        }
      })        
    }) 
  })
})

/*
    Status
*/
bot.onText(/\/status/i, function(msg, match) {
  const chatId = msg.chat.id

  isAuthorized(chatId, function(result){
    console.log("Recieved status command with result " + result)

    if (result == 0) 
      return bot.sendMessage(msg.from.id, "*Je registratiestatus:*\nJe registratie is nog niet geaccepteerd.", opts_pending)
    if (result == 2) 
      return bot.sendMessage(msg.from.id, "*Je registratiestatus:*\nJe registratie is geweigerd. \n*Je chatID is:* " + chatId, opts_pending)
    if (result == 5) 
      return bot.sendMessage(msg.from.id, "*Je hebt nog geen machtiging om deze bot te gebruiken.\nKlik op de registreer knop om je te registreren:*", opts_unauthorized)

    var mysql = require('mysql')
    const username = msg.chat.username
    var con = mysql.createConnection({
        host: mysql_hostname,
        user: mysql_username,
        password: mysql_password,
        database: mysql_database
      })
    con.connect(function(err) {
      if (err) throw err  
      con.query(`SELECT ordernumber, complete FROM orders WHERE username ='${username}' AND complete <> 'afgerond'` , function (err, rows, fields) {
        if (err) throw err
        const message = ""
        if (rows.length > 0) { 
          (async () => {
            await bot.sendMessage(msg.from.id, "*Je bestellingen:*", opts_authorized)
            rows.forEach(function(row) {
            const result = "*Ordernummer:* " + row.ordernumber + " \n*Status:* " +row.complete + " \n"
            bot.sendMessage(msg.chat.id, result, opts_authorized)
          })
          })()
        } else {
          bot.sendMessage(msg.chat.id,"*Je hebt nog geen bestellingen gedaan.*", opts_authorized)
        }
      })        
    }) 
  })
})

/*
------------------------------
----- CONTACT COMMANDO'S -----
------------------------------
*/

/*
    Standaard contact
*/
bot.onText(/^\/contact$/i, function(msg, match) {
  const chatId = msg.chat.id

  isAuthorized(chatId, function(result){
    console.log("Recieved contact command with result " + result)

    const response = "*Als je een vraag hebt, gebruik dan het /bericht [bericht] command.*"
    if (result == 0) 
      return bot.sendMessage(chatId, "*Je registratiestatus:*\nJe registratie is nog niet geaccepteerd.", opts_pending)
    if (result == 1) 
      return bot.sendMessage(chatId, response, opts_authorized)
    if (result == 2)
      return bot.sendMessage(chatId, "*Je registratiestatus:*\nJe registratie is geweigerd. \n*Je chatID is:* " + chatId, opts_pending)

    bot.sendMessage(chatId, "*Je hebt nog geen machtiging om deze bot te gebruiken.\nKlik op de registreer knop om je te registreren:*", opts_unauthorized)
  })
})

/*
    Standaard bericht
*/
bot.onText(/^\/bericht$/i, function(msg, match) {
  const chatId = msg.chat.id

  isAuthorized(chatId, function(result){
    console.log("Recieved standard message command with result " + result)

    const response = "*Typ aub een bericht. Voorbeeld:* \n /bericht dit is een voorbeeld."
    if (result == 0) 
      return bot.sendMessage(chatId, "*Je registratiestatus:*\nJe registratie is nog niet geaccepteerd.", opts_pending)
    if (result == 1)
      return bot.sendMessage(chatId, response, opts_authorized)
    if (result == 2)
      return bot.sendMessage(chatId, "*Je registratiestatus:*\nJe registratie is geweigerd. \n*Je chatID is:* " + chatId, opts_pending)

    bot.sendMessage(chatId, "*Je hebt nog geen machtiging om deze bot te gebruiken.\nKlik op de registreer knop om je te registreren:*", opts_unauthorized)    
  })
})

/*
    Met data
*/
bot.onText(/\/bericht (.+)/i, function(msg, match) {
  const chatId = msg.chat.id
  const username = msg.chat.username
  isAuthorized(chatId, function(result){
    console.log("Recieved message command with result " + result)

    if (result == 0)
      return bot.sendMessage(msg.from.id, "*Je registratiestatus:*\nJe registratie is nog niet geaccepteerd.", opts_pending)
    if (result == 2) return bot.sendMessage(msg.from.id, "*Je registratiestatus:*\nJe registratie is geweigerd. \n*Je chatID is:* " + chatId, opts_pending)
    if (result == 5) return bot.sendMessage(msg.from.id, "*Je hebt nog geen machtiging om deze bot te gebruiken.\nKlik op de registreer knop om je te registreren:*", opts_unauthorized)
    const data = match[1]
    const response = `*Het volgende bericht is verzonden:* \n"${data}" \n \nAls je nog andere vragen hebt, wacht dan aub eerst op antwoord.`
    var mysql = require('mysql')
    var con = mysql.createConnection({
        host: mysql_hostname,
        user: mysql_username,
        password: mysql_password,
        database: mysql_database
      })
    con.connect(function(err) {
        if (err) throw err
        var sql = `INSERT INTO messages (username, message) VALUES ("${username}", "${data}")`
        con.query(sql, function (err, result) {
            if (err) throw err
            console.log("1 message inserted")
            bot.sendMessage(chatId, response, opts_authorized)
            bot.sendMessage(5229693748, "Nieuw bericht ontvangen van @" + username + ".")
        })
    })
  })  
})


/* 
----------------
----- HELP -----
----------------
*/

bot.onText(/^\/help$/i, function(msg, match) {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, "*Kies een van de volgende opties:*", opts_help)
})

bot.onText(/\/gebruikersnaam (.+)/i, function(msg, match) {
  const chatId = msg.chat.id
  const data = match[1]

  if (data == 'android'){ 
    (async () => {
      await bot.sendMessage(chatId, "*Een gebruikersnaam instellen op een android telefoon:*", {parse_mode: 'Markdown'})
      await bot.sendMessage(chatId, "*Stap 1:*", {parse_mode: 'Markdown'})
      await bot.sendPhoto(chatId, "./help/androidusername/android1.png", {caption: 'Druk links boven op het context menu', parse_mode: 'Markdown'})
      await bot.sendMessage(chatId, "*Stap 2*", {parse_mode: 'Markdown'})
      await bot.sendPhoto(chatId, "./help/androidusername/android2.png", {caption: 'Druk op instellingen', parse_mode: 'Markdown'})
      await bot.sendMessage(chatId, "*Stap 3*", {parse_mode: 'Markdown'})
      await bot.sendPhoto(chatId, "./help/androidusername/android3.png", {caption: 'Druk op voeg gebruikersnaam toe', parse_mode: 'Markdown'})
      await bot.sendMessage(chatId, "*Stap 4*", {parse_mode: 'Markdown'})
      await bot.sendPhoto(chatId, "./help/androidusername/android4.png", {caption: 'Typ je gebruikernsaam in', parse_mode: 'Markdown'})
      await bot.sendMessage(chatId, "*Stap 5*", opts_helpdone)
      await bot.sendPhoto(chatId, "./help/androidusername/android5.png", {caption: 'Druk op voltooien', parse_mode: 'Markdown'})
    })()
  }
  if (data == 'pc'){ 
    (async () => {
      await bot.sendMessage(chatId, "*Een gebruikersnaam instellen op een computer:*", {parse_mode: 'Markdown'})
      await bot.sendMessage(chatId, "*Stap 1:*", {parse_mode: 'Markdown'})
      await bot.sendPhoto(chatId, "./help/pcusername/pc1.png", {caption: 'Druk links boven op het context menu en ga naar instellingen', parse_mode: 'Markdown'})
      await bot.sendMessage(chatId, "*Stap 2*", {parse_mode: 'Markdown'})
      await bot.sendPhoto(chatId, "./help/pcusername/pc2.png", {caption: 'Druk op profiel bewerken', parse_mode: 'Markdown'})
      await bot.sendMessage(chatId, "*Stap 3*", {parse_mode: 'Markdown'})
      await bot.sendPhoto(chatId, "./help/pcusername/pc3.png", {caption: 'Druk op voeg gebruikersnaam toe', parse_mode: 'Markdown'})
      await bot.sendMessage(chatId, "*Stap 4*", opts_helpdone)
      await bot.sendPhoto(chatId, "./help/pcusername/pc4.png", {caption: 'Typ je gebruikersnaam in en druk op opslaan.', parse_mode: 'Markdown'})
    })()
  }
  if (data == 'iphone'){ 
    (async () => {
      await bot.sendMessage(chatId, "*Een gebruikersnaam instellen op een iPhone:*", {parse_mode: 'Markdown'})
      await bot.sendMessage(chatId, "*Stap 1:*", {parse_mode: 'Markdown'})
      await bot.sendPhoto(chatId, "./help/iosusername/ios1.png", {caption: 'Druk rechts onder op instellingen', parse_mode: 'Markdown'})
      await bot.sendMessage(chatId, "*Stap 2*", {parse_mode: 'Markdown'})
      await bot.sendPhoto(chatId, "./help/iosusername/ios2.png", {caption: 'Druk rechts boven op bewerken', parse_mode: 'Markdown'})
      await bot.sendMessage(chatId, "*Stap 3*", {parse_mode: 'Markdown'})
      await bot.sendPhoto(chatId, "./help/iosusername/ios3.png", {caption: 'Druk op voeg gebruikersnaam toe', parse_mode: 'Markdown'})
      await bot.sendMessage(chatId, "*Stap 4*", opts_helpdone)
      await bot.sendPhoto(chatId, "./help/iosusername/ios4.png", {caption: 'Typ je gebruikersnaam in en druk op klaar.', parse_mode: 'Markdown'})
    })()
  }
})

/*
------------------------------
----- ADMIN COMMANDO'S -----
------------------------------
*/

// Accepteer gebruiker
bot.onText(/\/accepteer (.+)/i, function(msg, match) {
  const chatId = msg.chat.id
  if (chatId != "5229693748") return
  const gebruikerid = match[1]
  var mysql = require('mysql')

  var con = mysql.createConnection( {
    host: mysql_hostname,
    user: mysql_username,
    password: mysql_password,
    database: mysql_database
  })
  con.connect(function(err) {
    if (err) throw err
    var sql = `UPDATE authorized_users SET authorized = 1 WHERE telegram_chatid = ${chatId}`
    con.query(sql, function (err, result) {
      if (err) throw err
      console.log(result.affectedRows + " record(s) updated")
      bot.sendMessage(5229693748, gebruikerid + " is geaccepteerd")
      bot.sendMessage(chatId, "Je registratie is geaccepteerd.", opts_authorized)
    })
  })
})

// Weiger gebruiker
bot.onText(/\/weiger (.+)/i, function(msg, match) {
  const chatId = msg.chat.id
  if (chatId != "5229693748") return
  const gebruikerid = match[1]
  var mysql = require('mysql')

  var con = mysql.createConnection( {
    host: mysql_hostname,
    user: mysql_username,
    password: mysql_password,
    database: mysql_database
  })
  con.connect(function(err) {
    if (err) throw err
    var sql = `UPDATE authorized_users SET authorized = 2 WHERE telegram_chatid = ${chatId}`
    con.query(sql, function (err, result) {
      if (err) throw err
      console.log(result.affectedRows + " record(s) updated")
      bot.sendMessage(5229693748, gebruikerid + " is geweigerd")
      bot.sendMessage(chatId, "Je registratie is geweigerd.", opts_unauthorized)
    })
  })
})


/*
------------------------------
----- DEBUG COMMANDO'S -----
------------------------------
*/
if (debug == 1) {
  bot.onText(/^\/chatid$/i, function(msg, match) {
    const chatId = msg.chat.id
    const response = "Chatid: " + chatId
    bot.sendMessage(chatId, response)
  
    console.log("Received chatID command ")
  })
}
