import {BrowserRouter, Navigate} from "react-router-dom";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Test from "./pages/Test";


function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path={'/'} element={<Landing />}/>
            <Route path={'/test'} element={<Test />}/>
            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    </BrowserRouter>
  )
}

export default App
