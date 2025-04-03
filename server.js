const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 8080;

app.get('/fetch-data', async (req, res) => {
  try {
    const response = await fetch('https://www.comprasestatales.gub.uy/consultas/buscar/tipo-pub/VIG/inciso/3/ue/4/tipo-doc/C/tipo-fecha/ROF/rango-fecha/2025-04-01_2025-04-30/filtro-cat/CAT/orden/ORD_ROF/tipo-orden/ASC');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los datos de compras' });
  }
});

app.listen(port, () => {
  console.log(`Servidor proxy escuchando en el puerto ${port}`);
});
