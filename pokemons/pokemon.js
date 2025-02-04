const mongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

const DB_URL = 'mongodb+srv://59160834:59160834@pokemon-cluster-b880k.gcp.mongodb.net/admin?retryWrites=true&w=majority'
const DB_NAME = 'example'
const options = {useNewUrlParser: true, useUnifiedTopology: true }

var collection, database, client
let pokemons = []
mockPokemon()

function Pokemon(name, type) {
    this.name = name
    this.type = type
    this.id = null
    this.type2 = null
}
/*------------------------------------------------------------------------------------------------------- */

/*------------------------------------------------------------------------------------------------------- */
async function connectDatabase(){
    if(client !== undefined && client !== null && client.isConnected){
        return client
    }
    client = await mongoClient.connect(DB_URL, options).catch(err => console.error(err))
    return client
}
/*------------------------------------------------------------------------------------------------------- */
async function getCollection(name){
    client = await connectDatabase().catch(err => console.error(err))
    database = client.db(DB_NAME)
    collection = database.collection(name)
    return collection
}
/*------------------------------------------------------------------------------------------------------- */
async function getPokemons(){
    var collection = await getCollection('pokemons')
    // var client = await mongoClient.connect(DB_URL, options).catch( err => console.log(err)) 
    // var collection, database
    // database = client.db(DB_NAME)
    // collection = database.collection('pokemons')
    try{
        var result = await collection.find({}).toArray() 
        return result
    } catch(err) {
        console.error(err)
        return false
    } finally {
        client.close()
    }
}
/*--------------------------------------------------------------------------------------------------------*/
async function savePokemon(name, type) { //fn ที่เป็น sync ถือเป็น promise
    //pokemons.push(p)

    //callback --> m.connect(url, options, callback_fn) รับทั้งหมด 3 params
    //function conectMongo (err,client) {   } --> callbackfn
    
    /*promise -- > m.connect().then((err, client) => { //มีแค่สำเร็วจกับไม่สำเร็จ
        //สำเร็จทำตรงนี้ --> Resolved
        collection.insert().then((result) => {  
        })
    }).catch((err) => {
        //ไม่สำเร็จทำตรงนี้ --> Rejected
    })*/
    
    //ไม่ค่อยใช้ promise ใช้ async await แทน
    let p = createPokemon(name, type)
    // var collection, database
    // var client = await mongoClient.connect(DB_URL, options).catch( err => console.log(err)) //wait return result 
    // database = client.db(DB_NAME)
    // collection = database.collection('pokemons')
    var collection = await getCollection('pokemons')
    try{
        var result = await collection.insert(p) //การทำงานแบบ async --> ใช้ await เพื่อรอรีเทิน
        return true
    } catch(err) {
        console.error(err)
        return false
    } finally {
        client.close()
    }
}
/*------------------------------------------------------------------------------------------------------- */
function createPokemon(name, type) {
    let p = new Pokemon(name, type)
    p.id = generateNewId(pokemons.length)
    return p
}
/*------------------------------------------------------------------------------------------------------- */
function mockPokemon() {
    pokemons.push(createPokemon('Pikachu', 'Electric'))
    pokemons.push(createPokemon('Paras', 'Bug'))
}
/*------------------------------------------------------------------------------------------------------- */
function generateNewId(num) {
    return num + 1
}
/*------------------------------------------------------------------------------------------------------- */
function isPokemonExisted(id) {
    return pokemons[id-1] !== undefined && pokemons[id-1] !== null
}
/*------------------------------------------------------------------------------------------------------- */
async function getPokemon(id) {
    var collection = await getCollection('pokemons')
try{
    var result = await collection.findOne({_id: ObjectID(id)})
    return result 
} catch(err){
    console.err(err)
    return err
} finally{
    client.close()
    }
}
/*------------------------------------------------------------------------------------------------------- */
async function update(pokemon) {
    var collection = await getCollection('pokemons')
    try{
        var result = await collection.updateOne({_id : ObjectID(id)},{$set:{"type2":type}})
        return true
        
    } catch(err){
        console.err(err)
        return err
    } finally{
        client.close()
    }

    // pokemons[pokemon.id - 1] = pokemon
    // return true
}
/*------------------------------------------------------------------------------------------------------- */

module.exports.getPokemons = getPokemons
module.exports.isPokemonExisted = isPokemonExisted
module.exports.savePokemon = savePokemon
module.exports.getPokemon = getPokemon
module.exports.update = update