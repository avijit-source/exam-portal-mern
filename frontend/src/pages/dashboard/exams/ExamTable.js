import React, { useMemo } from 'react'
import {useTable,useSortBy,useGlobalFilter,usePagination} from "react-table";
import { format } from "date-fns";
import { toast } from 'react-toastify';
import './examTable.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiFillDelete, AiOutlineArrowDown,AiOutlineArrowUp, AiOutlineFileAdd } from 'react-icons/ai';
import {FaEdit, FaFileExport} from 'react-icons/fa'
import ExamTableGlobalSearch from './ExamTableGlobalSearch';

function ExamTable({exams,examCountRef,fetchAllExams}) {
   const navigate = useNavigate()
   async function handleDelete(id) {
    const value = window.confirm("Are you sure you want to delete this exam with id "+id);
    console.log(value);
    if(value===true){
        try{
            const res = await axios.delete(`/api/v1/exam/${id}`);
              toast.success(res.data.sucessMessage);
              fetchAllExams();
           }catch(err){
               toast.error(`${err.response.data.message}`)
           }
    }
} 

function handleClick(e){
    navigate("newexam")
}


const columns  = useMemo(()=>[
    // {
    //     Header:"Id",
    //     accessor:"_id"
    // },
    {
        Header:"Exam code",
        accessor:"examcode"
    },
    {
        Header:"Durations(min)",
        accessor:"durations"
    },
    {
        Header:"Exam password",
        accessor:"exampass"
    },
    {
        Header:"Questions",
        accessor:"count"
    },
    {
        Header:"Created At",
        accessor:"createdAt",
        Cell: ({value})=> {return format(new Date(value),"dd/MM/yyyy")}
    },
    {
        Header:"Action",
        accessor:"action",
       disableSortBy:true,
        Cell: ({row}) => <div className="action-btn">
            <button onClick={()=>navigate(`examedit/${row.original._id}`)}><FaEdit /> Edit
            </button>
            <button onClick={()=>navigate(`examadmin/${row.original._id}`)}><FaFileExport /> View</button>
            <button onClick={()=>handleDelete(row.original._id)}><AiFillDelete /> Delete
            </button>

        </div>
    }

    ],[]) 

    const data = useMemo(()=>exams,[exams]);

    const
    {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    state,
    setGlobalFilter,
    prepareRow
    }  = useTable({
        columns,
        data
    },
    useGlobalFilter,useSortBy,usePagination)

 const {globalFilter,pageIndex,pageSize} = state

  return (
    <div className="examtable">
      <div className="sticky">
      <h3>Total Exams: {examCountRef.current}</h3>
      <button className="addBtn" onClick={handleClick}><AiOutlineFileAdd /> Add new exam</button>
      </div>
      <ExamTableGlobalSearch filter={globalFilter} setFilter={setGlobalFilter} />
      <div className="table">
      <table {...getTableProps()}>
      <thead>
        {
            headerGroups.map((headerGroup)=>(
                <tr {...headerGroup.getHeaderGroupProps()}>
                     {
                        headerGroup.headers.map(column=>(
                            <th {...column.getHeaderProps(
                                column.getSortByToggleProps()
                            )}>
                                 {column.render("Header")}
                                 <span>
                                    {column.isSorted ? (column.isSortedDesc ? 
                                      <AiOutlineArrowDown /> : <AiOutlineArrowUp />) : ""
                                    }
                                 </span>
                            </th>
                        ))
                     }
                </tr>
            ))
        }
         
      </thead>
      <tbody {...getTableBodyProps()}>
        {
            page.map(row=>{
                prepareRow(row)
                return(
                    <tr {...row.getRowProps()}>
                       {
                        row.cells.map(cell=>{
                            return <td {...cell.getCellProps()}>
                                 {cell.render("Cell")}
                            </td>
                        })
                       }
                    </tr>
                )
            })
        }
          
      </tbody>
      </table>
      </div>
      <br />
      <div className="paginateBtn">
        <span>
            Page:{" "}
            <strong>
                {pageIndex+1} of {pageOptions.length}
            </strong>{" "}
        </span>
        <span>
            Go to Page:{" "}
            <input type="number"
            min="1"
            defaultValue={pageIndex+1}
            onChange={(e) =>{
                const pageNumber = e.target.value ? Number(e.target.value) -1 : 0;
                gotoPage(pageNumber)
            }}
            style={{width:"50px"}}
            />
        </span>
        <select
        value={pageSize}
        onChange={(e) =>setPageSize(Number(e.target.value))}
        >
          {[5,10,15,20,30].map((ps)=>(
            <option key={ps} value={ps}>
                Show {ps}
            </option>
          ))}
        </select>
        <button onClick={() =>gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
        </button>
         <button onClick={() =>previousPage()} disabled={!canPreviousPage}>Prev</button>
         <button onClick={() =>nextPage()} disabled={!canNextPage}>Next</button>
        <button onClick={()=>gotoPage(pageCount-1)} disabled={!canNextPage}>{">>"}</button>
      </div>
    </div>
  )
}

export default ExamTable