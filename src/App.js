// import { Button } from 'antd-mobile'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/CityList'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="home/*" element={<Home/>}></Route>
          <Route path="/citylist" element={<CityList/>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
