import { AccountList } from "./components/AccountList";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Transactions from "./components/transaction";

function App() {
  return (
    // <div className="app">
    //   <header className="header">
    //     <h1>Banking Dashboard</h1>
    //   </header>
    //   <main className="main">
    //     <AccountList />
    //   </main>
    // </div>
    <Router>
      <div className="app">
        <header className="header">
          <h1>Banking Dashboard</h1>
        </header>
        <main className="main">
          <Routes>
            <Route path="/" element={<AccountList />} />
            <Route path="/accounts/:id" element={<Transactions />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
