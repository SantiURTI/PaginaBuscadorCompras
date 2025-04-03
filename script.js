document.addEventListener('DOMContentLoaded', (event) => {
    obtenerDatosCompras();
});

// Example of an event listener to prevent multiple calls
let isFetchingData = false;

async function obtenerDatosCompras() {
    if (isFetchingData) return; // Prevents multiple calls
    isFetchingData = true;

    const urlBase = "https://www.comprasestatales.gub.uy/consultas/buscar/tipo-pub/VIG/inciso/3/ue/4/tipo-doc/C/tipo-fecha/ROF/rango-fecha/";
    const mesAnio = "04 2025"; // Puedes modificar esto para que sea variable si lo deseas

    const mes = mesAnio.substring(0, 2);
    const anio = mesAnio.substring(3, 7);

    const fechaInicio = `${anio}-${mes}-01`;
    const fechaFin = `${anio}-${mes}-${new Date(anio, mes, 0).getDate()}`;

    const url = `${urlBase}${fechaInicio}_${fechaFin}/filtro-cat/CAT/orden/ORD_ROF/tipo-orden/ASC`;

    try {
        console.log(`Fetching data from URL: ${url}`);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        let comprasData = [];
        const compras = doc.querySelectorAll('.row.item');

        console.log(`Found ${compras.length} items`);

        if (compras.length === 0) {
            console.log("No se encontraron compras publicadas.");
            isFetchingData = false;
            return;
        }

        compras.forEach(compra => {
            let titulo = compra.querySelector('.col-md-5 h3') ? compra.querySelector('.col-md-5 h3').innerText : "No disponible";
            titulo = titulo.replace(compra.querySelector('.col-md-5 span') ? compra.querySelector('.col-md-5 span').innerText : "", "");
            titulo = titulo.replace("Licitación Abreviada", "L.A. N°").replace("Compra Directa", "C.D. N°");

            let descripcion = compra.querySelector('.desc-sniped .buy-object') ? compra.querySelector('.desc-sniped .buy-object').innerText : "No disponible";
            let fechaHora = compra.querySelector('.desc-sniped strong') ? compra.querySelector('.desc-sniped strong').innerText : "No disponible";

            let fechaPublicacion = "No disponible";
            let fechaUltimaModificacion = "Sin Modificaciones";
            const textMutedElements = compra.querySelectorAll('.v-middle .text-muted');

            if (textMutedElements.length > 0) {
                const matchPublicado = textMutedElements[0].innerText.match(/Publicado: (.*)/);
                fechaPublicacion = matchPublicado ? matchPublicado[1] : "No disponible";
                const matchModificado = textMutedElements[0].innerText.match(/Última Modificación: (.*)/);
                fechaUltimaModificacion = matchModificado ? matchModificado[1] : "Sin Modificaciones";
            }

            comprasData.push([titulo, descripcion, fechaHora, fechaPublicacion, fechaUltimaModificacion]);
        });

        console.log('Data extracted:', comprasData);

        const ws = XLSX.utils.aoa_to_sheet([["Título", "Descripción", "Fecha y Hora", "Fecha de Publicación", "Fecha de Última Modificación"], ...comprasData]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Compras");

        XLSX.writeFile(wb, "Compras.xlsx");
        console.log("Se han extraído todas las compras.");

    } catch (error) {
        console.error("Error al obtener los datos de compras:", error);
    } finally {
        isFetchingData = false;
    }
}
