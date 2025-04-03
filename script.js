async function obtenerTitulo() {
    try {
        // Obtener el primer título de la página
        const titulo = document.querySelector('h1').innerText;

        // Crear una hoja de cálculo con el título
        const ws = XLSX.utils.aoa_to_sheet([["Título"], [titulo]]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Título");

        // Descargar el archivo Excel
        XLSX.writeFile(wb, "Titulo.xlsx");
        console.log("Título extraído y guardado en Excel.");

    } catch (error) {
        console.error("Error al obtener el título:", error);
    }
}
