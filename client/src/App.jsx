import {BrowserRouter, Router, Route, Routes} from 'react-router-dom';
import Register from './pages/Register';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<h1>HireAI Home</h1>}/>
      <Route path='/login' element={<h1>Login</h1>}/>
      <Route path='/register' element={<Register/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
