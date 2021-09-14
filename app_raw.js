// const {Telegraf} = require('telegraf');
// const axios = require('axios')

// const bot = new Telegraf('1541757201:AAF0ai1PgFaG7T5kL_Xc6leqxTZLPPNMkJY');

// // bot.use((ctx) => {
// //     ctx.reply('Hi, Hooman');
// // })

// bot.start((ctx) => {
//     ctx.reply('Halo, saya bot yang dibuat untuk kebutuhan belajar dari Creator!')
// })

// bot.help((ctx) => {
//     ctx.reply('This is help user command')
// })

// bot.on('sticker', (ctx) => {
//     ctx.reply('Good Sticker!')
// })

// // bot.on('message',(ctx) => {
// //     ctx.reply('Saya tidak mengerti')
// // })

// bot.hears('Hello',(ctx) => {
//     ctx.reply('Hallo dari botbotobot')
// })

// bot.command('say', (ctx) => {
//     msg = ctx.message.text
//     msgArray = msg.split(' ')
//     msgArray.shift()
//     newMsg = msgArray.join(' ')

//     ctx.reply(newMsg)
// })

// bot.command('fortune', (ctx) => {
//     url = 'http://yerkee.com/api/fortune'

//     axios.get(url)
//     .then((res) =>{
//         console.log(res.data.fortune)
//         ctx.reply(res.data.fortune)
//     })
// })

// console.log("Bot is Running!")
// bot.launch();



// TES BOT COVID19
const {Telegraf} = require('telegraf')
const axios = require('axios')

const bot = new Telegraf('1541757201:AAF0ai1PgFaG7T5kL_Xc6leqxTZLPPNMkJY')

bot.start((ctx) => {
    nama = ctx.from.first_name
    ctx.reply(`Selamat Datang ${nama} di Bot COVID19`)
})

bot.help((ctx) => {
    ctx.reply("Tekan /menu untuk menampilkan menu")
})

bot.command('menu', (ctx) => {
    ctx.telegram.sendMessage(ctx.chat.id, 'Kabar COVID19 Indonesia Hari Ini!!', 
    {
        reply_markup: {
            inline_keyboard: [
                [{text: "INFO", callback_data:"INFO"}, {text: "RUMAH SAKIT", callback_data:"RS"}],
                [{text: "OTHER", callback_data:"OTH"}],
                
            ]
        }
    })
})

// bot.command('info', (ctx) => {
//     msg = ctx.message.text.toUpperCase()
//     msgArray = msg.split(' ')
//     msgArray.shift()
//     newMsg = msgArray.join(' ')


//     // ctx.reply(newMsg)
//     ctx.deleteMessage()
//     getData(newMsg)
//     ctx.telegram.sendMessage(ctx.chat.id, 'Statistik COVID19 di Provinsi Indonesia', 
//     {
//         reply_markup: {
//             inline_keyboard: [
//                 [{text: "GO TO MENU", callback_data:"go-back"}]
//             ]
//         }
//     })
// })

bot.action('INFO', (ctx) => {
    // ctx.deleteMessage()
    ctx.reply('Gunakan perintah /info provinsi untuk menjalankan')
    bot.command('info', (ctx) => {
        msg = ctx.message.text.toUpperCase()
        msgArray = msg.split(' ')
        msgArray.shift()
        newMsg = msgArray.join(' ')


        // ctx.reply(newMsg)
        // ctx.deleteMessage()
        getData(newMsg)
        ctx.telegram.sendMessage(ctx.chat.id, 'Statistik COVID19 di Provinsi Indonesia', 
        {
            reply_markup: {
                inline_keyboard: [
                    [{text: "GO TO MENU", callback_data:"go-back"}]
                ]
            }
        })
    })
    // msg = ctx.message.text.toUpperCase()
    // msgArray = msg.split(' ')
    // msgArray.shift()
    // newMsg = msgArray.join(' ')

    // ctx.deleteMessage()
    // getData(newMsg)
    // ctx.telegram.sendMessage(ctx.chat.id, 'Statistik COVID19 di Provinsi Indonesia', 
    // {
    //     reply_markup: {
    //         inline_keyboard: [
    //             [{text: "GO TO MENU", callback_data:"go-back"}]
    //         ]
    //     }
    // })
})

bot.action('RS', (ctx) => {
    ctx.reply('Gunakan perintah /rs nama_provinsi untuk mengakses')
    bot.command('rs', (ctx) => {
        msg = ctx.message.text.toUpperCase()
        msgArray = msg.split(' ')
        msgArray.shift()
        newMsg = msgArray.join(' ')

        getHospital(newMsg)
        ctx.telegram.sendMessage(ctx.chat.id, 'Statistik COVID19 di Provinsi Indonesia', 
        {
            reply_markup: {
                inline_keyboard: [
                    [{text: "GO TO MENU", callback_data:"go-back"}]
                ]
            }
        })
    })
})

bot.action('go-back', (ctx) => {
    ctx.deleteMessage()
    ctx.telegram.sendMessage(ctx.chat.id, 'Kabar COVID19 Indonesia Hari Ini!!', 
    {
        reply_markup: {
            inline_keyboard: [
                [{text: "INFO", callback_data:"INFO"}, {text: "RUMAH SAKIT", callback_data:"RS"}],
                [{text: "OTHER", callback_data:"OTH"}],
                
            ]
        }
    })
})

function getHospital(msg){
    url = 'https://dekontaminasi.com/api/id/covid19/hospitals'
    axios.get(url)
    .then((res) => {
        dataArray = res.data
        lst = []
        for(i=0;i<dataArray.length;i++){
            covidHosp = dataArray[i].province.toUpperCase()
            if(covidHosp == msg){
                lst.push(dataArray[i])
                console.log(dataArray[i])
            }
        }
        console.log(`kami menemukan ${lst.length} rumah sakit penanganan covid berdasar pencarian anda`)
    })
}

function getData(msg){
    url = 'https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/COVID19_Indonesia_per_Provinsi/FeatureServer/0/query?where=1%3D1&outFields=Provinsi,Kasus_Posi,Kasus_Semb,Kasus_Meni&outSR=4326&f=json'
    axios.get(url)
    .then((res) => {
        dataArray = res.data.features
        for(i=0;i<dataArray.length;i++){
            dataProvinsi = dataArray[i].attributes.Provinsi.toUpperCase()
            if (dataProvinsi == msg){
                // console.log(dataArray[i].attributes)
                // result = `Kasus COVID19 di Provinsi ${dataArray[i].attributes.Provinsi}\n Kasus Positif Akibat COVID19 ${dataArray[i].attributes.Kasus_Posi}\n Kasus Sembuh Akibat COVID19 ${dataArray[i].attributes.Kasus_Semb}\n Kasus Meninggal Akibat COVID19 ${dataArray[i].attributes.Kasus_Meni}`
                
                // return result
                console.log(`Kasus COVID19 di Provinsi ${dataArray[i].attributes.Provinsi}`)
                console.log(`Kasus Positif Akibat COVID19 ${dataArray[i].attributes.Kasus_Posi}`)
                console.log(`Kasus Sembuh Akibat COVID19 ${dataArray[i].attributes.Kasus_Semb}`)
                console.log(`Kasus Meninggal Akibat COVID19 ${dataArray[i].attributes.Kasus_Meni}`)

                // break
                }
        }
    })
}

console.log('Bot is Running!!')
bot.launch()





