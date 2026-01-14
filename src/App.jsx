import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home';
import CoinDetail from './pages/CoinDetail'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element= {<Home/>}/>
        <Route path='/coin/:id' element={<CoinDetail/>}/>
      </Routes>
    </div>
  )
}

export default App