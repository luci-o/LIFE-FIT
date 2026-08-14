

const getUsuario = async (req, res) => {
  const result = await query(
    `SELECT u.id_usuario, u.mail,
            p.id_perfil, p.nivel_fisico, p.peso, p.altura, p.edad, p.objetivo,
            p.tiempo_disponible, p.lugar_entrena, p.dieta_personalizada
     FROM usuarios u
       LEFT JOIN perfiles p ON p.id_usuario = u.id_usuario
     WHERE u.id_usuario = $1`,
    [req.params.id]
  );
  res.json(result.rows[0]);
};

  const createUsuario = async (req, res) => {
    const { email, contraseña, nombre, peso, edad } = req.body;
    const result = await query(
      "INSERT INTO usuarios (email, contraseña, nombre, peso, edad) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [email,contraseña, nombre, peso, edad]
    );
    res.status(201).json({ id: result.rows[0].id, email, contraseña, nombre, peso, edad });
  };


  const updateUsuario = async (req, res) => {
    const idUsuario = req.params.id;
    const { peso, objetivo,
            tiempo_disponible, lugar_entrena } = req.body;
    await query(
      `UPDATE perfiles SET
        peso = $1, objetivo = $2,
        tiempo_disponible = $3, lugar_entrena = $4,
       WHERE id_usuario = $5`,
      [ peso, objetivo,
       tiempo_disponible, lugar_entrena, idUsuario]
    );
  
    res.json({ mensaje: "Cuenta actualizada" });
};

const deleteUsuario = async (req, res) => {
    await query("DELETE FROM usuarios WHERE id_usuario = $1", [req.params.id]);
    res.sendStatus(204);
};

const usuarios = { getUsuario, createUsuario, updateUsuario, deleteUsuario };
export default usuarios;