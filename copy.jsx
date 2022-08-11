import { useEffect, useState, useCallback, useRef, KeyboardEvent } from "react";
import styled from "styled-components";
import axios from "axios";
import produce from "immer";


function App() {
  const baseURL = "https://api.airtable.com/v0/appo0I3hXXwj0fgUX/Projects"
  const options = {
    headers: {
      Authorization: `Bearer ${process.env.REACT_APP_AIRTABLE_KEY}`,
      "Content-Type": "application/json",
    },
  };
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);

  const handleRefresh = useCallback(async () => {
    const response = await axios.get(baseURL, options);
    const records = response.data.records;
    setTodos(records);
    setLoading(false);
  }, []);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const handleUpdateTodo = async (todo) => {
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
    handleRefresh();
  };

  const handleDeleteTodo = async (todo) => {
    await axios.delete(`${baseURL}/${todo.id}`, options);

    const newTodos = todos.filter((item) => todo.id !== item.id);
    setTodos(newTodos);
  };

  const handleAddTodo = async () => {
    const name = inputRef.current?.value;
    const newTodo = {
      fields: {
        Name: name,
        Done: false,
      },
    };
    name &&
      (await axios.post(
        baseURL,
        {
          records: [newTodo],
        },
        options
      ));

    if (inputRef.current) inputRef.current.value = "";
    handleRefresh();
  };

  const onKeyDown = (e)=> {
    if (e.key === "Enter") handleAddTodo();
  };

  return (
    <>
      {loading ? (
        <Loader>Loading...</Loader>
      ) : (
        <Container>
          {todos.map((todo) => (
            <TodoBox key={todo.id}>
              <h1>{todo.fields.Name}</h1>
              {todo.fields.Done ? (
                <BtnCheckDone
                  onClick={() => {
                    handleUpdateTodo(todo);
                  }}
                />
              ) : (
                <BtnCheck
                  onClick={() => {
                    handleUpdateTodo(todo);
                  }}
                />
              )}
              <BtnDelete
                onClick={() => {
                  handleDeleteTodo(todo);
                }}
              >
                <i className="fas fa-trash"></i>
              </BtnDelete>
            </TodoBox>
          ))}
          <AddForm>
            <AddBtn onClick={handleAddTodo}>
              <i className="fas fa-plus"></i>
            </AddBtn>
            <input
              ref={inputRef}
              type="text"
              placeholder="Create a new Todo"
              onKeyDown={onKeyDown}
            />
          </AddForm>
        </Container>
      )}
    </>
  );
}

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TodoBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BtnCheck = styled.div`
  margin-left: 30px;
  width: 30px;
  height: 30px;
  border: 3px solid #2096f3;
  border-radius: 50%;
`;

const BtnCheckDone = styled(BtnCheck)`
  width: 36px;
  height: 36px;
  border: none;
  background-image: url("/check.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
`;

const BtnCss = styled.button`
  background-color: transparent;
  border: 0;
`;

const BtnDelete = styled(BtnCss)`
  font-size: 22px;
  background-color: transparent;
  border: 0;
  margin-left: 10px;
`;

const AddForm = styled.div`
  height: 100px;
  background-color: white;
  display: flex;
  align-items: center;
`;
const AddBtn = styled(BtnCss)`
  color: #2096f3;
  margin-right: 20px;
  font-size: 25px;
`;

export default App;