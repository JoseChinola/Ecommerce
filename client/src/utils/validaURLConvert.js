export const validaURLConvert = (name) => {
    const url = name
        .toString()
        .replace(/\s+/g, "-")  // Reemplaza espacios por "-"
        .replace(/&+/g, "-")   // Reemplaza "&" por "-"
        .replace(/-+/g, "-")   // Elimina guiones duplicados
        .toLowerCase();
    return url
}