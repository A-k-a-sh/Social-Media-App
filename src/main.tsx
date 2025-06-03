// import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './globals.css'
import { QueryProvider } from './lib/react-query/QueryProvider.tsx'
import AuthContextProvider from './Context/AuthContext.tsx'
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <BrowserRouter>
      <QueryProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </QueryProvider>
    </BrowserRouter>
  </>
);
