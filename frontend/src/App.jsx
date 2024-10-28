import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Context from "./context";

function App() {
  return (
    <>
      <Context.Provider>
        <Header />
        <main>
          <Outlet />
        </main>
      </Context.Provider>
    </>
  );
}

export default App;
