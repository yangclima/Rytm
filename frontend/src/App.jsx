import Clock from "./components/clock";
import Tasks from "./components/tasks";
import AppContextProvider from "./contexts/AppContext";

function App(){
  return <>
    <AppContextProvider>
      <Clock></Clock>
      <Tasks></Tasks>
    </AppContextProvider>
  </>
}

export default App;