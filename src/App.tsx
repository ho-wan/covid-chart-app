import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ChartCard from "./chart/ChartCard";
import ChartPage from "./chart/ChartPage";

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" component={ChartPage} />
        <Route exact path="/embed" component={ChartCard} />
      </Router>
    </div>
  );
}

export default App;
