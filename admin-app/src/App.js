import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login.js";
import { RequireToken } from './components/Auth.js'
import Dashboard from "./components/Dashboard.js";
import Home from "./components/Home.js";
import AddEmployee from "./components/AddEmployee.js";
import EditEmployee from './components/EditEmployee.js';
import AbsentEmployee from './components/AbsentEmployee.js';

function App() {
  return (
    <div className="app">
        <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path='/' element={
                  <RequireToken>
                    <Dashboard />
                  </RequireToken>
                  }>
                  <Route path='' element={<Home />}></Route>
                  <Route path='edit/:id' element={<EditEmployee />}></Route>
                  <Route path='create' element={<AddEmployee />}></Route>
                  <Route path='absents' element={<AbsentEmployee />}></Route>
              </Route>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
