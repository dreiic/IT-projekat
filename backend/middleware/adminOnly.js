function adminOnly(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Niste prijavljeni" });
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Nemate dozvolu" });
  }
  next();
}

module.exports = adminOnly;