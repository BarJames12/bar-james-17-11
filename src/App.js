import "./App.css";
import Header from "./Components/header/Header";
import Main from "./Components/main/Main";
import { Provider } from "react-redux";
import Store from "./Redux/store";

function App() {
  return (
    <Provider store={Store}>
      <div className="App">
        <Header />
        <Main />
      </div>
    </Provider>
  );
}

export default App;
