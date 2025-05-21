const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const salts = 12;
const {PrismaClient} = require('../generated/prisma')
const prisma = new PrismaClient()
const SECRET = process.env.JWT_SECRET;



console.log('nununununu')
console.log(SECRET)

async function  hash(content){
   const hash = await bcrypt.hash(content,salts)
    return hash
}

module.exports.get = async (req,res) =>{
    try{
    res.json(await prisma.User.findMany())
    } catch(e){
        console.log(e)
    }

}

module.exports.create = async (req,res) => {
   const data =  req.body
    data.hashpass = await hash(data.pass) 
        delete data.pass;
    
   try {
   await prisma.User.create({data:data})
    res.status(200).json(data);
   } catch (error) {
     res.status(500)
    console.log(error)
   }

}


module.exports.login = async (req,res) => {
   let data = req.body
   let user = await prisma.User.findUnique({
    where: { email: data.email }
   })
   

    if(!user){
        return res.status(500).send("usuario ou email incorretos")
    }

    const validpass  =  await bcrypt.compare(data.pass, user.hashpass)
    if(!validpass)return res.status(500).send('invalid pass')
        const token = jwt.sign( {userId: user.id, email: user.email},SECRET,{expiresIn: '2d'})
 
    return res.status(202).json(token)


} 
