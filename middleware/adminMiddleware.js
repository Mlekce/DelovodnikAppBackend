function samoAdmin(req, res, next) {
  if (req.user.rola !== "admin") {
    return res
      .status(403)
      .json({ poruka: "Samo administrator ima prava pristupa ovoj ruti!" });
  }
  next();
}
