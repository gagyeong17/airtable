import './App.css';
import {useState, useEffect, useCallback} from 'react'
import axios from 'axios'
import produce from "immer";

function App() {
  const baseURL = "https://api.airtable.com/v0/appo0I3hXXwj0fgUX/Projects"
  const options = {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_KEY}`,
      "Content-Type": "application/json",
    },
  };
  // console.log(process.env.REACT_APP_AIRTABLE_KEY)

  const [name, setName] = useState('')
  const [label, setLabel] = useState('')
  const [todos, setTodos] = useState('')
  const [loading, setLoading] = useState(true);

  const create = () => {
    const newTodo = {
      fields: {
        Name: name,
        Label: label,
      },
    };
  axios.post(
        baseURL,
        {
          records: [newTodo],
        },
        options
      );
      get()
  };

  const onKeyDown = (e)=> {
    if (e.key === "Enter") create();
  };

  const get = useCallback(async () => {
    const response = await axios.get(baseURL, options);
    console.log(response)
    const records = response.data.records;
    console.log(records)
    setTodos(records); // 읽어온 데이터를 todos에 저장
    setLoading(false);
  },[]);

  useEffect(() => {
    get();
  }, [get]);

  const update = async (todo) => {
    const updatedTodo = produce(todo, (nextTodo) => {
      nextTodo.fields.Done = !todo.fields.Done;
    });

    await axios.patch(
      `${baseURL}/${todo.id}`,
      {
        fields: updatedTodo.fields,
      },
      options
    );
    get();
  };


  const remove = async (todo)  => {
    // todos.map((item, idx) => {
    //   return(
    //     console.log(item.id)
    //   )
    //  })
    console.log(todos.id)
    await axios.delete(`${baseURL}/${todos.id}`, options);
    const newTodos = todos.filter((item) => todos.id !== item.id);
    setTodos(newTodos);
  };
 

  return (
  <>
      {loading ? (
        <div>Loading</div>
      ) : (
          <div className="App" style={{border: '1px solid blue', width: '300px', height:'300px', margin: 'auto', }}>
          <button onClick={get}>불러오기</button>
      {todos?.map((item,idx)=>{
        return (
          <div key={idx} style={{display:'flex', flexDirection:'row', justifyContent: 'center'}}>
            <div style={{border: '1px solid red', width: '100px',}}>{item.fields.Name}</div>
            <div style={{border: '1px solid blue', width: '100px',}}>{item.fields.Label}</div>
            <button onClick={remove}>삭제</button> 
            <button onClick={update}>수정</button>
          </div>
          
        )
      })}
      <hr/>
      <div style={{display: 'flex', flexDirection:'column', }}>
        <input placeholder='Name' onChange={(e) => {setName(e.target.value)}} onKeyDown={onKeyDown}/>
        <input placeholder='Label' onChange={(e) => {setLabel(e.target.value)}} onKeyDown={onKeyDown}/>
        <button onClick={create}>입력하기</button>
      </div>
      
    </div>
      )}
    </>  
  );
}

export default App;
