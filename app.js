// TES BOT COVID19
const {Telegraf} = require('telegraf')
const axios = require('axios')

const bot = new Telegraf('1541757201:AAF0ai1PgFaG7T5kL_Xc6leqxTZLPPNMkJY')

bot.start((ctx) => {
    nama = ctx.from.first_name

    ctx.telegram.sendMessage(ctx.chat.id, ` \u{203C} Selamat Datang ${nama} di Bot COVID19 \u{203C} \n Berikut adalah beberapa hal yang dapat kamu akses di sini \n \u{1F4E2} Info Kasus Covid19 di Indonesia Berdasar Provinsi \n \u{1F3E5} Rumah Sakit Penanganan Covid19 Berdasar Provinsi \n \u{25AA} Kebijakan Pemerintah Penanganan Covid19 \n \u{2705} Berita Tentang Covid19 \n \u{26D4} Berita Hoax Seputar Covid19 \n Silahkan memilih fitur untuk mengakses`, 
    {
        reply_markup: {
            inline_keyboard: [
                [{text: `Info \u{1F4E2}`, callback_data:"INFO"}, {text: `Rumah Sakit \u{1F3E5}`, callback_data:"RS"}],
                [{text: `\u{203C} Kebijakan Pemerintah \u{203C}`, callback_data:"KBJ"}],
                [{text: `Berita Covid19 \u{2705}`, callback_data:"BC"}, {text: `Berita Hoax Covid19 \u{26D4}`, callback_data:"BHC"}]
                
            ]
        }
    })
})

bot.help((ctx) => {
    ctx.reply("Tekan /menu untuk menampilkan menu")
})

bot.action('INFO', (ctx) => {
    // ctx.deleteMessage()
    ctx.reply('Gunakan perintah /info provinsi untuk mengakses')
    bot.command('info', (ctx) => {
        msg = ctx.message.text.toUpperCase()
        msgArray = msg.split(' ')
        msgArray.shift()
        newMsg = msgArray.join(' ')

        getData(newMsg)
        .then((result) => {
            ctx.telegram.sendMessage(ctx.chat.id, result, 
            {
                reply_markup: {
                    inline_keyboard: [
                        [{text: "GO TO MENU", callback_data:"go-back"}]
                    ]
                }
            })
        })
    })
})

bot.action('RS', (ctx) => {
    ctx.reply('Gunakan perintah /rs nama_provinsi untuk mengakses')
    bot.command('rs', (ctx) => {
        msg = ctx.message.text.toUpperCase()
        msgArray = msg.split(' ')
        msgArray.shift()
        newMsg = msgArray.join(' ')

        getHospital(newMsg)
        .then((result) => {
                ctx.telegram.sendMessage(ctx.chat.id, result, 
            {
                reply_markup: {
                    inline_keyboard: [
                        [{text: "GO TO MENU", callback_data:"go-back"}]
                    ]
                }
            })
        })
    })
})

bot.action('KBJ', (ctx) => {
    ctx.reply('Fitur Belum Tersedia')
})

bot.action('BC', (ctx) =>{
    ctx.deleteMessage()
    getNews()
    .then((result) => {
        ctx.telegram.sendMessage(ctx.chat.id, result,
        {
            reply_markup: {
                inline_keyboard: [
                    [{text: "GO TO MENU", callback_data:"go-back"}]
                ]
            }
        })
    })
})

bot.action('BHC', (ctx) =>{
    ctx.deleteMessage()
    getHoax()
    .then((result) => {
        ctx.telegram.sendMessage(ctx.chat.id, result,
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
                [{text: `Info \u{1F4E2}`, callback_data:"INFO"}, {text: `Rumah Sakit \u{1F3E5}`, callback_data:"RS"}],
                [{text: `\u{203C} Kebijakan Pemerintah \u{203C}`, callback_data:"KBJ"}],
                [{text: `Berita Covid19 \u{2705}`, callback_data:"BC"}, {text: `Berita Hoax Covid19 \u{26D4}`, callback_data:"BHC"}]
                
            ]
        }
    })
})

async function getHoax(){
    url = 'https://dekontaminasi.com/api/id/covid19/hoaxes'
    let res = await axios.get(url)
    dataArray = res.data
    getArray = dataArray.slice(0,11)
    
    result = []
    for(i=1;i<getArray.length;i++){
        res = `\n \n${i}. ${getArray[i].title} \n \n ${getArray[i].url}`
        result.push(res)
    }
    return `Berikut berita yang dapat saya sajikan ${result} \n \n`
}

async function getNews(){
    url = 'https://dekontaminasi.com/api/id/covid19/news'
    let res = await axios.get(url)
    dataArray = res.data
    getArray = dataArray.slice(0,11)
    
    result = []
    for(i=1;i<getArray.length;i++){
        res = `\n \n${i}. ${getArray[i].title} \n \n ${getArray[i].url}`
        result.push(res)
    }
    return `Berikut berita yang dapat saya sajikan ${result} \n \n`
}

async function getHospital(msg){
    url = 'https://dekontaminasi.com/api/id/covid19/hospitals'
    let res = await axios.get(url)
    dataArray = res.data
    lst = []
    for(i=0;i<dataArray.length;i++){
        covidHosp = dataArray[i].province.toUpperCase()
        if(covidHosp == msg.toUpperCase()){
            lst.push(dataArray[i])
            // console.log(dataArray[i])
        }
    }

    result = []
    for(i=0;i<lst.length ;i++){
        res = `${lst[i].name} \n Alamat : ${lst[i].address} \n Kota : ${lst[i].region} \n \n`
        result.push(res)
    }

    console.log(lst.length)
    return `Saya menemukan ${lst.length} rumah sakit penanganan covid berdasar pencarian anda \n \n ${result}`
    // return result


}

async function getData(msg){
    url = 'https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/COVID19_Indonesia_per_Provinsi/FeatureServer/0/query?where=1%3D1&outFields=Provinsi,Kasus_Posi,Kasus_Semb,Kasus_Meni&outSR=4326&f=json'
    let res = await axios.get(url)
    dataArray = res.data.features
    for(i=0;i<dataArray.length;i++){
        dataProvinsi = dataArray[i].attributes.Provinsi.toUpperCase()
        if (dataProvinsi == msg){
            result = `Kasus COVID19 di Provinsi ${dataArray[i].attributes.Provinsi} \nKasus Positif Akibat COVID19 ${dataArray[i].attributes.Kasus_Posi} \nKasus Sembuh Akibat COVID19 ${dataArray[i].attributes.Kasus_Semb} \nKasus Meninggal Akibat COVID19 ${dataArray[i].attributes.Kasus_Meni}`
            
            console.log(result)
            return result
            }
    }

}

console.log('Bot is Running!!')
bot.launch()





