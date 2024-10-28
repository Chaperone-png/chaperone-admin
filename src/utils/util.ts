export const capitalizeFirstLetter = (str:string) =>{
    return str.charAt(0).toUpperCase() + str.slice(1);
}
export const addMargin = (originalPrice:number, marginPercentage:number|string) => {
    return Math.round(originalPrice + ((Number(marginPercentage)/100)*originalPrice))

};