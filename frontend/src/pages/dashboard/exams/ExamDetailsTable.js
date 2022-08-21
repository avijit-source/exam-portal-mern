import React, { useMemo } from 'react'
import './examDetails.css';
import {useTable} from 'react-table';
import ExportQuestion from './ExportQuestion';

function ExamDetailsTable({questions,examcode}) {
    const columns = useMemo(()=>[
        {
            Header:"Question",
            accessor:"question"
        },
        {
            Header:"Option-1",
            accessor:"option1"
        },
        {
            Header:"Option-2",
            accessor:"option2"
        },
         {
            Header:"Option-3",
            accessor:"option3"
        },
        {
            Header:"Option-4",
            accessor:"option4"
        },
        {
            Header:"Answer",
            accessor:"answer"
        }
    ],[]) 
    console.log(questions);
    const data = useMemo(()=>questions,[questions])

    const tableInstance = useTable({
        columns,
        data
    })

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = tableInstance;
  return (
    <><h2><ExportQuestion questions={questions} examcode={examcode} columns={columns} /></h2>
    <div className="questionTable">
       <table {...getTableProps()}>
        <thead>
            {headerGroups.map((headerGroup)=>(
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column)=>(
                        <th {...column.getHeaderProps()}>
                           {column.render("Header")}
                        </th>
                    ))}

                </tr>
            ))}
        </thead>
        <tbody {...getTableBodyProps}>
            {rows.map((row)=>{
                prepareRow(row)
                return (
                    <tr {...row.getRowProps()}>
                       {row.cells.map((cell)=>{
                        return <td {...cell.getCellProps()}>
                            {cell.render("Cell")}
                        </td>
                       })}
                    </tr>
                )
            })}
        </tbody>
       </table>
    </div>
    </>
  )
}

export default ExamDetailsTable