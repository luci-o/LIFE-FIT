import jwt from "jsonwebtoken";

export const SECRET = "life_fit_clave_secreta_cambiar";
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
};