import Welcome from './components/Welcome';
import TaskTable from './task/TaskTable';

// Styles
import './App.css'; //import logo from './logo.svg';

function App() {
  return (
    <div className="App">
      <Welcome></Welcome>
      <hr></hr>
      <TaskTable></TaskTable>
    </div>
  );
}

export default App;
