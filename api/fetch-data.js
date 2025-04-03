const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { fechaInicio, fechaFin } = req.query;

  const urlBase = "https://www.comprasestatales.gub.uy/consultas/buscar/tipo-pub/VIG/inciso/3/ue/4/tipo-doc/C/tipo-fecha/ROF/rango-fecha/";
  const targetUrl = `${urlBase}${fechaInicio}_${fechaFin}/filtro-cat/CAT/orden/ORD_ROF/tipo-orden/ASC`;

  try {
    const response = await fetch(targetUrl);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.text();
    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los datos de compras', detalle: error.message });
  }
};
