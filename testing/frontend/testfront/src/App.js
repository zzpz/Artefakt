import logo from './logo.svg';
import './App.css';

function App() {
  const pool_client = process.env.REACT_APP_USER_POOL_CLIENT_ID;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <h2>pool_client : {pool_client}  works</h2>
        <h2>domain: {process.env.REACT_APP_DOMAIN} work</h2>
        <h3>test: {process.env.REACT_APP_TEST} works</h3>
        <h3>api_url: {process.env.REACT_APP_API_URL} API URL</h3>
        <br></br>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >



          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
