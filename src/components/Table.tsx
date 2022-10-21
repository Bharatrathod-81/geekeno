import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid'


export default function DataTable() {

  type Data = {
    task: string,
    completed: boolean,
    id: string
  }

  const [openForm, setOpenForm] = useState<boolean>(false);
  const [input, setInput] = useState<Data>({ task: '', completed: false, id: '' });
  const [editData, setEditData] = useState<boolean>(false);
  const [data, setData] = useState<Data[]>([]);
  const [updateData, setUpdateData] = useState<boolean>(false);
  const [pageNo, setPageNo] = useState<number>(10);

  useEffect(() => {
    let todoList = JSON.parse(localStorage.getItem("todoList") || '[]') || [];
    todoList = todoList.slice(pageNo - 10, pageNo);
    setData(todoList);
  }, [updateData, pageNo])

  const submitFunc = () => {
    if (editData) {
      let todoList: Data[] = JSON.parse(localStorage.getItem("todoList") || '[]');
      todoList = todoList?.map((e: Data) => input.id === e.id ? { ...e, task: input?.task } : e);
      localStorage.removeItem("todoList");
      localStorage.setItem("todoList", JSON.stringify(todoList));
      setInput({ task: '', completed: false, id:''});
      setOpenForm(false);
      setUpdateData(!updateData);
      setEditData(false)
    } else {
      let todoList: Data[] = JSON.parse(localStorage.getItem("todoList") || '[]');
      todoList = [...todoList, { task: input.task, completed: input.completed, id: uuidv4() }];
      localStorage.removeItem("todoList");
      localStorage.setItem("todoList", JSON.stringify(todoList));
      setInput({ task: '', completed: false, id: '' });
      setOpenForm(false);
      setUpdateData(!updateData);
    };
  };

  const taskCompleteHandler = (a: string) => {
    let todoList: Data[] = JSON.parse(localStorage.getItem("todoList") || '[]');
    todoList = todoList?.map((e: Data) => e.id === a ? { ...e, completed: !e.completed } : e);
    localStorage.removeItem("todoList");
    localStorage.setItem("todoList", JSON.stringify(todoList))
    setUpdateData(!updateData);
  };

  const editHandler = (e: Data) => {
    setEditData(true);
    setInput({ task: e?.task, completed: e?.completed,id:e.id})
    setOpenForm(true);
  };

  const deleteHandler = (a: string) => {
    let todoList: Data[] = JSON.parse(localStorage.getItem("todoList") || '[]');
    todoList = todoList?.filter((e: Data) => e.id !== a);
    localStorage.removeItem("todoList");
    localStorage.setItem("todoList", JSON.stringify(todoList));
    setUpdateData(!updateData);
  }

  return (
    <div className='position-relative d-flex justify-content-center'>

      <div className='position-absolute'>
        {openForm && <form className='bg-info text-dark p-3 rounded mt-5'>
          <div className="mb-3">
            <label className="form-label">Enter Task</label>
            <input type="text"
              onChange={e => setInput({ ...input, task: e.target.value })}
              value={input?.task}
              className="form-control" aria-describedby="emailHelp" />
          </div>
          <button
            onClick={submitFunc}
            type="submit"
            className="btn btn-primary">Submit</button>
        </form>}
      </div>

      <div style={{ height: 631, width: '100%' }}>
        <button
          onClick={() => setOpenForm(true)}
          type="button" className="btn btn-primary mb-2">Create New</button>
        <table className="table ">
          <thead>
            <tr className='table-dark'>
              <th scope="col">No</th>
              <th scope="col">Tasks</th>
              <th scope="col">Completed?</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody className='table-warning '>
            {data?.map((e,i) =>
              <tr className={`${e?.completed && "table-success"}`} key={i}>
                <th scope="row">{i + 1}</th>
                <td>{e?.task}</td>
                <td>
                  <small
                    onClick={() => taskCompleteHandler(e.id)}
                    style={{ cursor: "pointer", border: "1px solid", width: "8rem" }}
                    className={`text-dark p-2 rounded ${e?.completed ? "bg-success" : "bg-warning"}`}
                  >{e?.completed ? "Completed" : "Not Completed"}</small>
                </td>
                <td>
                  <i
                    onClick={() => editHandler(e)}
                    className="fa fa-edit btn btn-light m-1"></i>

                  <i
                    onClick={() => deleteHandler(e.id)}
                    className="fa fa-trash btn btn-light m-1"></i>
                </td>
              </tr>
            )}
            <tr className='table-light'>
              <td></td>
              <td></td>
              <td>
                {pageNo >= 11 && <i
                  onClick={() => setPageNo(pageNo - 10)}
                  className="fa fa-mail-reply btn btn-light m-1"></i>}
                {pageNo / 10}
                {JSON.parse(localStorage.getItem("todoList") || '[]').length > pageNo &&
                  <i
                    onClick={() => setPageNo(pageNo + 10)}
                    className="fa fa-mail-forward btn btn-light m-1"></i>}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
