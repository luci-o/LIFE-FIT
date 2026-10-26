import { query } from "../DB/db.js"

const verProgreso = async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM "PROGRESO" WHERE "ID PERFIL" = $1 ORDER BY "PROGRESO ID"`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const registrarProgreso = async (req, res) => {
  const { peso, historialDietas, historialEjercicios } = req.body;

  if (peso === undefined || peso === null || isNaN(Number(peso))) {
    return res.status(400).json({ message: "El peso es obligatorio y debe ser un número" });
  }
  if (Number(peso) <= 0 || Number(peso) > 500) {
    return res.status(400).json({ message: "El peso debe estar entre 1 y 500 kg" });
  }

  try {
    const result = await query(
      `INSERT INTO "PROGRESO"
         ("EVOLUCION DEL PESO","HISTORIAL DE DIETAS","HISTORIAL DE EJERCICIOS","ID PERFIL")
       VALUES ($1,$2,$3,$4)
       RETURNING "PROGRESO ID","EVOLUCION DEL PESO","FECHA"`,
      [peso, historialDietas ?? null, historialEjercicios ?? null, req.params.id]
    );
    res.status(201).json({ message: "Progreso registrado", progreso: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const verResumen = async (req, res) => {
  const CORTES = `
      COUNT(*) FILTER (WHERE %C AND "FECHA" >= date_trunc('week', CURRENT_DATE)::date) AS hechos_semana,
      COUNT(*) FILTER (WHERE          "FECHA" >= date_trunc('week', CURRENT_DATE)::date) AS total_semana,
      COUNT(*) FILTER (WHERE %C) AS hechos_mes,
      COUNT(*)                   AS total_mes`;

  try {
    const perfil = await query(
      `SELECT "NOMBRE" FROM "PERFIL USUARIO" WHERE "ID PERFIL" = $1`,
      [req.params.id]
    );
    if (perfil.rows.length === 0) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    const rutina = await query(
      `SELECT ${CORTES.replaceAll("%C", `"REALIZADO"`)}
       FROM "EJERCICIOS"
       WHERE "ID_PERFIL" = $1
         AND "FECHA" >= date_trunc('month', CURRENT_DATE)::date
         AND "FECHA" <= CURRENT_DATE`,
      [req.params.id]
    );

    const dieta = await query(
      `SELECT ${CORTES.replaceAll("%C", `"REALIZADA"`)}
       FROM "COMIDA"
       WHERE "ID_PERFIL" = $1
         AND "FECHA" >= date_trunc('month', CURRENT_DATE)::date
         AND "FECHA" <= CURRENT_DATE`,
      [req.params.id]
    )
    const pct = (hechos, total) => {
      const t = Number(total);
      return t === 0 ? null : Math.round((Number(hechos) * 100) / t);
    }
    const promedio = (...valores) => {
      const hay = valores.filter((n) => n !== null);
      return hay.length ? Math.round(hay.reduce((a, b) => a + b, 0) / hay.length) : null;
    }
    const r = rutina.rows[0];
    const d = dieta.rows[0];
    const rutinaSemana = pct(r.hechos_semana, r.total_semana)
    const dietaSemana  = pct(d.hechos_semana, d.total_semana)
    const rutinaMes    = pct(r.hechos_mes,    r.total_mes)
    const dietaMes     = pct(d.hechos_mes,    d.total_mes)
    res.json({
      nombreUsuario: perfil.rows[0]["NOMBRE"],
      rutinaSemana,
      dietaSemana,
      rutinaMes,
      dietaMes,
      porcentajeSemanaTotal: promedio(rutinaSemana, dietaSemana),
      porcentajeMesTotal:    promedio(rutinaMes, dietaMes),
    })
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const Progreso = { verProgreso, registrarProgreso, verResumen };
export default Progreso;