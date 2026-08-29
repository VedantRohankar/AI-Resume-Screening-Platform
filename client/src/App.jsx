import {BrowserRouter, Router, Route, Routes} from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<h1>HireAI Home</h1>}/>
       <Route path='/login' element={<h1>Login</h1>}/>
        <Route path='/register' element={<h1>Register</h1>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
