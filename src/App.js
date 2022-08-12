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
  // const [edit, setEdit] = useState(false)

  const create = (e) => {
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
      e.target.value =""
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
      // nextTodo.fields.Name = !todo.fields.Name;
      // nextTodo.fields.Label = !todo.fields.Label;
      nextTodo.fields.Done = !todo.fields.Done;
      // console.log(Done)
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

  // const updateMoment = (todo) => {
  //   produce(todo, (nextTodo) => {
  //     // nextTodo.fields.Name = !todo.fields.Name;
  //     // nextTodo.fields.Label = !todo.fields.Label;
  //     nextTodo.fields.Done = !todo.fields.Done;
  //   });
  //   // setEdit(true)
  // }

  const remove = async (todo)  => {
    await axios.delete(`${baseURL}/${todo.id}`, options);
    const newTodos = todos.filter((item) => todo.id !== item.id);
    setTodos(newTodos);
  };
 
console.log(todos)
  return (
  <>
      {loading ? (
        <div>Loading</div>
      ) : (
          <div className="App" style={{border: '1px solid blue', width: '500px', height:'300px', margin: '50px auto',  }}>
          {/* <button onClick={get}>불러오기</button> */}
      {todos?.map((item,idx)=>{
        return (
          <div key={idx} style={{display:'flex', flexDirection:'row', justifyContent: 'center'}}>                 
            {item.fields.Done ? (<>
            <div style={{border: '1px solid green', width: '150px', backgroundColor: 'red'}}>{item.fields.Name}</div>
            <div style={{border: '1px solid blue', width: '150px',backgroundColor: 'red'}}>{item.fields.Label}</div>
            <button onClick={()=>{remove(item)}}>삭제</button> 
            <button onClick={()=>{update(item)}}>아직</button>
            </>) : (<>
              <div style={{border: '1px solid green', width: '150px',}}>{item.fields.Name}</div>
            <div style={{border: '1px solid blue', width: '150px',}}>{item.fields.Label}</div>
            <button onClick={()=>{remove(item)}}>삭제</button> 
            <button onClick={()=>{update(item)}}>완료</button>
            </>)}
            
          
            
          </div>
          
        )
      })}
      <hr/>
      <div style={{display: 'flex', flexDirection:'column',  width: '400px', margin: 'auto', }}>
        <input placeholder='Name' onChange={(e) => {setName(e.target.value)}} />
        <input placeholder='Label' onChange={(e) => {setLabel(e.target.value)}} />
        <button onClick={create}>입력하기</button>
      </div>
      
    </div>
      )}
    </>  
  );
}

export default App;