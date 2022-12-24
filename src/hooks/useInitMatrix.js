export const useInitMatrix = (radius) => {
    const cordinates = []
    let k = 0
    for(var i = 0; i < radius; i++){
        for(var x = -i; x <= i; x++) {
            for(var y = -i; y <= i; y++){
                for(var z = -i; z <= i; z++){
                    if(Math.abs(x) + Math.abs(y) + Math.abs(z) === i*2 && x + y + z === 0){
                        cordinates[k]={x, y, z, value:0}
                    }
                    k++
                }
                k++
            }
            k++
        }
    }
    const cordMatrix = cordinates.filter(item=>item).map((hex,index)=>({...hex, key:index}))
    
    return cordMatrix
}