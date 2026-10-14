import jwt from "jsonwebtoken";
export const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error("Falta JWT_SECRET en el archivo .env");
}
export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Falta el token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    req.usuario = jwt.verify(token, SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o vencido" });
  }
}
export const verificarUsuario = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ message: "Falta el token" });
  }
  if (Number(req.params.id) !== req.usuario.idPerfil) {
    return res.status(403).json({ message: "No podés acceder a datos de otro usuario" });
  }
  next();
}