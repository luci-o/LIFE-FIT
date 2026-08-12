const getUsuario = async (req, res) => {
    const result = await query(
      "SELECT id, email, nombre FROM usuarios WHERE id = $1",
      [req.params.id]
    );
    res.json(result.rows[0]);
  };


  const createUsuario = async (req, res) => {
    const { email, nombre, peso, edad } = req.body;
    const result = await query(
      "INSERT INTO usuarios (email, nombre, peso, edad) VALUES ($1, $2, $3, $4) RETURNING id",
      [email, nombre, peso, edad]
    );
    res.status(201).json({ id: result.rows[0].id, email, nombre, peso, edad });
  };

  const updateUsuario = async (req, res) => {
    const { peso } = req.body;
    await query("UPDATE usuarios SET peso = $1 WHERE id = $2", [
      peso,
      req.params.id,
    ]);
    res.json({ peso });
  };