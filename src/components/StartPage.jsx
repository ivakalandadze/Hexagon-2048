import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GameDataContext } from '../context/GameDataContext'
import { HexContext } from '../context/HexContext'
import { useInitMatrix } from '../hooks/useInitMatrix'

export default function StartPage() {

  const {gameData, setGameData} = useContext(GameDataContext)

  const handleChange = (e) => {
    const {name, value, type} = e.target
    console.log(typeof(value))
      setGameData(prevState=>({
        ...prevState,
        [name]: type==="radio" ? +value : value
      }))
  }
  useEffect(()=>{
    JSON.stringify(localStorage.setItem("radius", gameData.radius))
  },[gameData])

  return (
    <div className='form-container'>
      <div className='start-form'>
        <div className='input-box'>
          <label className="label" htmlFor="port">Port</label>
          <input className="port-input" type="text" id="port" name="port"value={gameData.port} onChange={handleChange}/>
          <label className="example" htmlFor="port">Example: 80</label>
        </div>
        <div className="input-box">
          <label className="label" htmlFor="hostname">Hostname</label>
          <input type="text" id="hostname" name="hostName" value={gameData.hostName} onChange={handleChange} />
          <label className="example" htmlFor="port">Example: hex2048-lambda.octa.wtf</label>
        </div>
        <fieldset>
            <legend>Choose Radius</legend>
          <div className='radio-input'>
            <label htmlFor="2">2</label>
            <input 
              type="radio"
              id="2"
              name="radius"
              value={2}
              checked={gameData.radius === 2}
              onChange={handleChange}
            />
          </div>
          <div className="radio-input">
            <label htmlFor="3">3</label>
            <input 
              type="radio"
              id="3"
              name="radius"
              value={3}
              checked={gameData.radius === 3}
              onChange={handleChange}
            />
          </div>
          <div className="radio-input">
            <label htmlFor="4">4</label>
            <input 
              type="radio"
              id="4"
              name="radius"
              value={4}
              checked={gameData.radius === 4}
              onChange={handleChange}
            />
          </div>
          <div className="radio-input">
            <label htmlFor="5">5</label>
            <input 
              type="radio"
              id="5 "
              name="radius"
              value={5}
              checked={gameData.radius === 5}
              onChange={handleChange}
            />
          </div>
        </fieldset>
        <div className='button-box'>
          <Link to="/game"><button className="startButton">Start</button></Link>
        </div>
      </div>
    </div>
  )
}
