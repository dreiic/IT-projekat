const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Niste autorizovani" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const user = jwt.verify(token, "tajna");
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Nevažeći token" });
  }
}

module.exports = authMiddleware;