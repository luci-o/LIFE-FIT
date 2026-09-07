import jwt from "jsonwebtoken";

export const SECRET = "life_fit_clave_secreta_cambiar";
const verificarToken = (req, res, next) => {
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
const verificarUsuario = (req, res, next) => {
  if (Number(req.params.id) !== req.usuario.idPerfil) {
    return res.status(403).json({ message: "No podés acceder a datos de otro usuario" });
  }
  next();
}
const Auth = { verificarToken, verificarUsuario}
export default Auth;