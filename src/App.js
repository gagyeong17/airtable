import './App.css';

function App() {
  const baseURL = "https://api.airtable.com/v0/appZpl45YC9WO43Ll/Table%201 "
  const options = {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_KEY}`,
      "Content-Type": "application/json",
    },
  };
  return (
    <div className="App">
     에어테이블해볼꼬야
    </div>
  );
}

export default App;
