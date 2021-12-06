// import { Button } from 'antd-mobile'
import {BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/CityList'
import Search from './pages/Search'
import Map from './pages/Map'
import Rent from './pages/Rent'
import Detail from './pages/Detail'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="home/*" element={<Home/>}></Route>
          <Route path="/citylist" element={<CityList/>}></Route>
          <Route path="/search" element={<Search/>}></Route>
          <Route path="/map" element={<Map/>}></Route>
          <Route path="/detail/*" element={<Detail/>}></Route>
          <Route path="/rent" element={<Rent/>}></Route>
          <Route path="/" element={<Navigate replace to="/home"/>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

