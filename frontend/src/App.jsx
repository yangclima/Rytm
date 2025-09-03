import Clock from "./components/clock";
import Tasks from "./components/tasks";
import { AppContextProvider } from "./contexts/appContext.jsx";

function App() {
  return <>
    <AppContextProvider>
      <Clock></Clock>
      <Tasks></Tasks>
    </AppContextProvider>
  </>
}

export default App;