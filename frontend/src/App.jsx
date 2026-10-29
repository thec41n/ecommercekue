import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navigation from './pages/Auth/Navigation';
import Footer from './components/Footer';
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <div className="flex min-h-screen flex-col">
     <ToastContainer/>
     <ScrollRestoration/>
     <Navigation/>
     <main className="flex-1 py-6">
      <Outlet />
     </main>
     <Footer/>
    </div>
  );
}

export default App
