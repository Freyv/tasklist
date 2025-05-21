const jwt = require('jsonwebtoken');


const SECRET = process.env.JWT_SECRET;
// console.log(SECRET)


function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization; 

  if (!authHeader) return res.status(401).send("Token não fornecido");

  const token = authHeader.split(' ')[1]; 

  if (!token) return res.status(401).send("Token inválido");

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Token inválido ou expirado");
  }
}

module.exports = authMiddleware;