import {
  BrowserRouter,
  Routes, //replaces "Switch" used till v5
  Route,
} from "react-router-dom";
import SignIn from "./Login";
import RegisterUserPage from "./RegisterUser";

function App() {
  //const role = sessionStorage.getItem("role");
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes: */}
        <Route path="" element={<SignIn />} />
        <Route path="register-user" element={<RegisterUserPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
