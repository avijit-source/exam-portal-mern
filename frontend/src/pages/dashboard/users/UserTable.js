import React, { useState } from 'react'
import { useMemo } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AiFillDelete, AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';
import './userTable.css';
import ExamTableGlobalSearch from '../exams/ExamTableGlobalSearch';
import Modal from 'react-modal';
import UserCreateForm from './UserCreateForm';


Modal.setAppElement("#root");

function UserTable(props) {
  const { users, fetchUsers, count } = props;

  const [modalIsOpen, setModalIsOpen] = useState(false)
  async function handleChange(e, id) {
    try {
      let res = await axios.put(`/api/v1/user/${id}`, { role: e.target.value });
      if (res.data.success === true) {
        toast.success("user role updated");
        fetchUsers()
      } else {
        toast.error(`error occured`);
        return false;
      }
    } catch (e) {
      toast.error(`${e.response.data.message}`);
      return false;
    }
  }
  async function handleDelete(id) {
    const isDelete = window.confirm(`do you really want  to delete this user with id: ${id}`);
    if (isDelete === true) {
      try {
        let res = await axios.delete(`/api/v1/deleteuser/${id}`);
        if (res.data.success === true) {
          toast.success("user deleted successfully");
          fetchUsers()
        } else {
          toast.error(`error occured`);
          return false;
        }
      } catch (e) {
        toast.error(`${e.response.data.message}`);
        return false;
      }
    } else {
      return false;
    }

  }

  const columns = useMemo(() =>
    [
      {
        Header: 'UserId',
        accessor: 'userId'
      },
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ value }) => {
          if (value) {
            return value
          } else {
            return "N/A"
          }
        }

      },
      {
        Header: 'Email',
        accessor: 'email',
        Cell: ({ value }) => {
          if (value) {
            return value
          } else {
            return "N/A"
          }
        }
      },
      {
        Header: 'Phone',
        accessor: 'mobile',
        Cell: ({ value }) => {
          if (value) {
            return value
          } else {
            return "N/A"
          }
        }
      },
      {
        Header: 'Role',
        accessor: 'role',
        disableSortBy: true,
        Cell: ({ row }) => <div className="role-select">
          <select onChange={(e) => handleChange(e, row.original._id)} defaultValue={row.original.role}>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

        </div>
        // selected={row.original.role === 'admin'}

      },
      {
        Header: "Action",
        accessor: "action",
        disableSortBy: true,
        Cell: ({ row }) => <div className="action-btn">
          <button onClick={() => handleDelete(row.original._id)}><AiFillDelete /> Delete
          </button>

        </div>
      }
    ]
    , [])
  const data = useMemo(() => users, [users])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter
  } = useTable({
    columns,
    data,
    initialState: { pageSize: 7 }
  }, useGlobalFilter, useSortBy, usePagination)

  const { globalFilter, pageIndex, pageSize } = state;


  return (

    <div style={{ marginTop: "30px" }}>
      <span className="spangroup"><h2>Total users: {count}</h2>
        {" "}
        <button onClick={() => setModalIsOpen(true)}
          className="createbtn">Create New User</button>
      </span>
      <Modal isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(255, 255, 255, 0.75)'
          },
          content: {
            width: "400px",
            height: "400px",
            border: '1px solid #ccc',
            background: '#fcffff',
            overflow: 'auto',
            left: "40%",
            WebkitOverflowScrolling: 'touch',
            borderRadius: '4px',
            outline: 'none',
            padding: '20px'
          }
        }}
      >
        <UserCreateForm setModalIsOpen={setModalIsOpen} fetchUsers={fetchUsers} />
      </Modal>
      <ExamTableGlobalSearch filter={globalFilter} setFilter={setGlobalFilter} />
      <table {...getTableProps()} className="tableuser">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ?
                      <AiOutlineArrowDown /> : <AiOutlineArrowUp />) : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </td>
                })}
              </tr>
            )
          })}
          <tr>
            <td>

            </td>
          </tr>
        </tbody>
      </table>
      <span style={{ marginRight: "5px" }}>
        Page{" "}
        <strong>
          {pageIndex + 1} of {pageOptions.length}
        </strong>
      </span>
      <span>
        | Go to page: {' '}
        <input type="number"
          defaultValue={pageIndex + 1}
          onChange={e => {
            const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
            gotoPage(pageNumber)
          }}
          style={{ width: "50px" }}
        />
      </span>
      <select value={pageSize}
        onChange={e => setPageSize(Number(e.target.value))}
        style={{ margin: "0 5px 0 5px" }}
      >
        {[7, 10, 20, 30, 40, 50, 100].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>

      <button onClick={() => gotoPage(0)}
        disabled={!canPreviousPage}
      >{"<<"}</button>
      <button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</button>
      <button onClick={() => nextPage()} disabled={!canNextPage}>Next</button>
      <button onClick={() => gotoPage(pageCount - 1)}
        disabled={!canNextPage}
      >{">>"}</button>
    </div>
  )
}

export default UserTable