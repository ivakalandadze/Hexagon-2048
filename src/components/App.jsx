import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
// import { GameDataContext } from '../../context/GameDataContext'
import { GameDataContext } from '../context/GameDataContext'
import { HexContext } from '../context/HexContext'
import Game from './Game'
import StartPage from './StartPage'
import "../StartPage.css"
import "../Game.css"


export const App  = () => {
  const [gameData, setGameData] = useState({
    port: 80,
    hostName: "hex2048-lambda.octa.wtf",
    radius: JSON.parse(localStorage.getItem("radius")) || 2,
    status: ""
  })
  const [hexes, setHexes] = useState([])
  return (
    <div>
      <GameDataContext.Provider value={{gameData, setGameData}}>
        <HexContext.Provider value={{hexes, setHexes}}>
          <Routes>
              <Route path='/' element={<StartPage />} />
              <Route path='/game' element={<Game />} />
          </Routes>
        </HexContext.Provider>
      </GameDataContext.Provider>
    </div>
  )
}
