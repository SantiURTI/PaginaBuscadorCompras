async function obtenerDatosCompras() {
    const mesAnio = prompt("Por favor, ingresa el mes y año en formato MM AAAA (por ejemplo, 04 2025):");
    if (!mesAnio || !/^\d{2} \d{4}$/.test(mesAnio)) {
        console.error("Formato de fecha inválido. Debe ser MM AAAA.");
        return;
    }

    const mes = mesAnio.substring(0, 2);
    const anio = mesAnio.substring(3, 7);

    const fechaInicio = `${anio}-${mes}-01`;
    const fechaFin = `${anio}-${mes}-${new Date(anio, mes, 0).getDate()}`;

    const url = `https://<tu-nombre-de-usuario>.vercel.app/api/fetch-data?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`;

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
    }
}
