export const DisplayPriceDOP = (price) => {
    return new Intl.NumberFormat('es-DO', {
        style: 'currency',
        currency: 'DOP'
    }).format(price)
}