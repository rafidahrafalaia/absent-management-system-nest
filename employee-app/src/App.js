import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login.js";
import { RequireToken } from './components/Auth.js'
import Dashboard from "./components/Dashboard.js";
import Attendance from "./components/Attendance.js";
import Summary from "./components/Summary.js";
import Profile from './components/Profile.js'

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
                  <Route path='' element={<Attendance />}></Route>
                  <Route path='summary' element={<Summary />}></Route>
                  <Route path='profile' element={<Profile />}></Route>
              </Route>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
