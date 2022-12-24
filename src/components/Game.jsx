import axios from 'axios';
import { useContext, useEffect, useState } from 'react'
import { HexGrid, Layout, Hexagon, Text} from 'react-hexgrid';
import { GameDataContext } from '../context/GameDataContext';
import { HexContext } from '../context/HexContext';
import { useInitMatrix } from '../hooks/useInitMatrix';



export default function Game() {
  const {hexes, setHexes} = useContext(HexContext)
  const {gameData, setGameData} = useContext(GameDataContext)
  const [click, setClick] = useState({
    count: 0,
    dir: {}
  })
  const initHexes = useInitMatrix(gameData.radius)

  const directions = [
    { x: -1, y: 1, z: 0 },
    { x: 0, y: 1, z: -1 },
    { x: 1, y: 0, z: -1 },
    { x: -1, y: 0, z: 1 },
    { x: 0, y: -1, z: 1 },
    { x: 1, y: -1, z: 0 }
  ]

  
  const QPress = (e) => {
    if(e.code==='KeyQ'){
      setClick(prevState=>({
        count: prevState.count + 1,
        dir: directions[0]
      }))
    }
  }
  const WPress = (e) => {
    if(e.code==='KeyW'){
      setClick(prevState=>({
        count: prevState.count + 1,
        dir: directions[1]
      }))
    }
  }
  const EPress = (e) => {
    if(e.code==='KeyE'){
      setClick(prevState=>({
        count: prevState.count + 1,
        dir: directions[2]
      }))
      
    }
  }
  const APress = (e) => {
    if(e.code==='KeyA'){
      setClick(prevState=>({
        count: prevState.count + 1,
        dir: directions[3]
      })) 
    }
  }
  const SPress = (e) => {
    if(e.code==='KeyS'){
      setClick(prevState=>({
        count: prevState.count + 1,
        dir: directions[4]
      }))
    }
  }
  const DPress = (e) => {
    if(e.code==='KeyD'){
      setClick(prevState=>({
        count: prevState.count + 1,
        dir: directions[5]
      }))
    }
  }
  
  const initializeKeyBoardEvents = () => {
    document.addEventListener("keypress", QPress)
    document.addEventListener("keypress", WPress)
    document.addEventListener("keypress", EPress)
    document.addEventListener("keypress", APress)
    document.addEventListener("keypress", SPress)
    document.addEventListener("keypress", DPress)
  }
  const removeKeyBoardEvents = () => {
    document.removeEventListener("keypress", QPress)
    document.removeEventListener("keypress", WPress)
    document.removeEventListener("keypress", EPress)
    document.removeEventListener("keypress", APress)
    document.removeEventListener("keypress", SPress)
    document.removeEventListener("keypress", DPress)
  }
  
  const hexesInitialization = () => {
    setHexes(initHexes)
  }

  const valueInitialization = async (initHexes) => {
    const newArray = [...initHexes]
    const res = await axios.post(`https://${gameData.hostName}/${gameData.radius}`, [])
    res.data.forEach(cordinates=>{
      const index = initHexes.findIndex(element=>element.x===cordinates.x && element.y===cordinates.y && element.z===cordinates.z)
      newArray[index]={...cordinates, key: index}
    })
    return new Promise ((resolve, reject)=>{
      resolve (newArray)
    })
  }

  const arraysEqual = (arr1, arr2) =>{
    for(let i = 0; i < arr1.length; i++){
      if(arr1[i].value!==arr2[i].value){
        return false
      }
    }
    return true
  }
  
  const addNewTile = (fullHexes, newHexes) => {
    axios.post(`https://${gameData.hostName}/${gameData.radius}`, fullHexes)
    .then(res=>{
      const newArray = [...newHexes]
      res.data.forEach(cordinates=>{
        const index = hexes.findIndex(element=>element.x===cordinates.x && element.y===cordinates.y && element.z===cordinates.z)
        newArray[index]={...cordinates, key:index}
      })
      setHexes(newArray)
    })
  }

  const moveHexes = (dir) => {
    let nextHexes = []
    for (let i = 0; i<hexes.length; i++){
      nextHexes.push({...(hexes[i])})
    }
    const addedHexes = [];
    for(let j = 0; j<gameData.radius*2; j++){
      nextHexes.forEach((hex,i)=>{
        if(Math.abs(hex.x+dir.x)<gameData.radius
        && Math.abs(hex.y+dir.y)<gameData.radius
        && Math.abs(hex.z+dir.z)<gameData.radius){
          const nextIndex = hexes.findIndex(nextHex=>nextHex.x===hex.x+dir.x && nextHex.y===hex.y+dir.y && nextHex.z===hex.z+dir.z)
          if (nextHexes[nextIndex].value===0){
            nextHexes[nextIndex].value = hex.value
            nextHexes[i].value = 0;
          }else if(nextHexes[nextIndex].value===hex.value && !addedHexes.includes(hex.key)){
            nextHexes[nextIndex].value = nextHexes[nextIndex].value + hex.value
            addedHexes.push(nextHexes[nextIndex].key)
            nextHexes[i].value = 0
          }
        }
      })
    }
    return new Promise ((resolve,reject)=> {
      resolve (nextHexes)
    })
  }

  const isInitialRender = hexes.every(hex=>hex.value===0)

  const checkGameStatus = () => {
    if(!isInitialRender && hexes.every(hex=>hex.value>0)){
      return hexes.some(hex=>{
         return directions.some(dir=>{
          const neighbourIndex = hexes.findIndex(element=>(element.x===hex.x+dir.x && element.y===hex.y+dir.y && element.z===hex.z+dir.z))
            if(hexes[neighbourIndex]&&hexes[neighbourIndex].value===hex.value){
              return true
            }
        })
      })
    }
    return true
  }
  
  // Game initialization
  useEffect(()=>{
    setGameData(prevState=>({...prevState, status:"playing"}))
    hexesInitialization()
    valueInitialization(initHexes)
    .then(valuedResponse=>{
      return setHexes(valuedResponse)
    })
    return () => {
      removeKeyBoardEvents()
      setHexes([])
    }
  },[])
  
  
  // Initial API call
  useEffect(()=>{
    initializeKeyBoardEvents()
    if(!checkGameStatus()){
      setGameData(prevState=>({
        ...prevState,
        status: "game-over"
      }))
      return ()=>{
        removeKeyBoardEvents()
      }
    }
    return ()=>{
      removeKeyBoardEvents()
    }
  },[hexes])

// API call on movement
  useEffect(()=>{
    if(click.count > 0){
      moveHexes(click.dir)
      .then(nextHexes=>{
        if(!arraysEqual(nextHexes,hexes)){
          addNewTile(nextHexes.filter(hex=>hex.value>0), nextHexes)
        }else{
          setHexes(nextHexes)
        }
      })
    }
  },[click])


  const cellStyle = (value) =>{
    switch (value) {
      case 0:
        return ({
        fill: "white",
        ...staticStyle
        })
        break;

      case 2: 
        return ({
          fill: "#eee4db",
          ...staticStyle
        })
        break;
      
      case 4:
        return ({
          fill: "#ebe0ca",
          ...staticStyle
        })
        break;
      case 8:
        return ({
          fill: "#ebb381",
          ...staticStyle
        })
        break;
      case 16:
        return ({
          fill: "#e8996d",
          ...staticStyle
        })
        break;
      case 32:
        return ({
          fill: "#e68367",
          ...staticStyle
        })
        break;
      case 64:
        return ({
          fill: "#e46747",
          ...staticStyle
        })
        break;
      case 128:
        return ({
          fill: "#e8cf7e",
          ...staticStyle
        })
        break;
      case 256: 
        return ({
          fill: "#f4ca49",
          ...staticStyle
        })
        break;
      case 512:
        return ({
          fill: "#f4c62d",
          ...staticStyle
        })
        break;
      case 1024:
        return ({
          fill: "#f5c300",
          ...staticStyle
        })
        break;
      case 2048: 
      return ({
        fill: "#f5c000",
        ...staticStyle
      })
        break;
      default :
      return ({
        fill: "#3c3a31",
        ...staticStyle
      })
    }
  }
  const textStyle = (value) => {
    return {
      fontSize: "0.15rem",
      fill: value > 4 ? "white" : "#867d74"
    }
  }
  const staticStyle = {
    stroke: "#b5a89a",
    strokeWidth: 1.2,
    color:"red"
  }
  const radius = +gameData.radius
  const hexX = 800/((radius*3+1)*10)
  const hexY = 800/((radius*3+1)*10)
  const originY = hexY*1.3  
  const topY =  hexY*14*radius*2


  return (
    <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    }}
      hostname={gameData.hostName}
      port={gameData.port}
      radius={gameData.radius}
    >
    <HexGrid width={"100vw"} height={"800px"} viewBox="-50 -50 100 100">
      <Layout size={{ x: hexX, y: hexY}} flat={true} spacing={1} origin={{ x: 0, y: -originY }}>
        {hexes.map((hex,i)=>(
          <Hexagon 
              className='hex'
              key={hex.key}
              q={hex.x} 
              s={hex.y} 
              r={hex.z} 
              cellStyle={cellStyle(hex.value)}
            >
              <Text style={textStyle(hex.value)}>{hex.value!=0 && hex.value}</Text>
            </Hexagon>
        ))}
      </Layout>
    </HexGrid>
    <div style={{position:"absolute", top:topY }}>Game Status: <span data-status={gameData.status}>{gameData.status}</span></div>
  </div>
  )
}
