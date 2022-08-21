import React, { useMemo } from 'react'
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table";
import { format } from "date-fns";
import { toast } from 'react-toastify';
import '../exams/examTable.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiFillDelete, AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineFileAdd } from 'react-icons/ai';
import { FaFileExport } from 'react-icons/fa'
import ExamTableGlobalSearch from '../exams/ExamTableGlobalSearch';
import './resultTable.css';
import * as XLSX from 'xlsx';


function ResultTable({ resultData, getTableDataAsync, resCount }) {
    const navigate = useNavigate()
    async function handleDelete(id) {
        const value = window.confirm("Are you sure you want to delete this exam with id " + id);
        if (value === true) {
            try {
                const res = await axios.post("/api/v1/result/delete", { id });
                if (res.data.success === true) {
                    toast.success("result deleted successfully");
                    getTableDataAsync()
                } else {
                    toast.error(`an error occured`);
                }
            } catch (err) {
                toast.error(`${err.response.data.message}`)
            }
        }
    }

    function handleClick(e) {
        if (resultData.length > 0) {
            let newArr = [];
            for (let i = 0; i < resultData.length; i++) {
                let resultObj = resultData[i];
                let keys = Object.keys(resultData[i]).filter(k => k !== "id");
                let newObj = {}
                for (let item of keys) {
                    if (item === "Createdat") {
                        newObj[item] = format(new Date(resultObj[item]), "dd/MM/yyyy")
                    } else {
                        newObj[item] = resultObj[item]
                    }
                }
                newArr.push(newObj)
            }
            let wb = XLSX.utils.book_new();
            let ws = XLSX.utils.json_to_sheet(newArr);
            XLSX.utils.book_append_sheet(wb, ws, "ResultSheet");
            // let buf = XLSX.write(wb,{bookType:"xlsx",type:"buffer"});
            XLSX.write(wb, { bookType: "xlsx", type: "binary" });
            XLSX.writeFile(wb, "MyResult.xlsx");
        } else {
            console.log("export boi");
            toast.error("No result to export")
        }
    }


    const columns = useMemo(() => [
        // {
        //     Header:"Id",
        //     accessor:"_id"
        // },
        {
            Header: "Exam Name",
            accessor: "Examname"
        },
        {
            Header: "Student Name",
            accessor: "Studentname"
        },
        {
            Header: "Total Questions",
            accessor: "Totalquestions"
        },
        {
            Header: "Attended",
            accessor: "Attended"
        },
        {
            Header: "Correct",
            accessor: "Correct",
        },
        {
            Header: "Created At",
            accessor: "Createdat",
            Cell: ({ value }) => { return format(new Date(value), "dd/MM/yyyy") }
        },
        {
            Header: "Action",
            accessor: "action",
            disableSortBy: true,
            Cell: ({ row }) => <div className="action-btn">
                <button onClick={() => navigate(`/admin/resultadmin/${row.original.id}`)}><FaFileExport /> View</button>
                <button onClick={() => handleDelete(row.original.id)}><AiFillDelete /> Delete
                </button>

            </div>
        }

    ], [])

    const data = useMemo(() => resultData, [resultData]);

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
        } = useTable({
            columns,
            data
        },
            useGlobalFilter, useSortBy, usePagination)

    const { globalFilter, pageIndex, pageSize } = state

    return (
        <div className="examtable" id='resultTable'>
            <div className="sticky">
                <button className="addBtn" id='btnExport' onClick={handleClick}><AiOutlineFileAdd /> Export Result</button>
                <span>
                    <h4 className="rescount">Total Exams: {resCount}</h4>
                </span>
                <ExamTableGlobalSearch id="searchgbl" filter={globalFilter} setFilter={setGlobalFilter} />
            </div>
            <div className="table">
                <table {...getTableProps()}>
                    <thead>
                        {
                            headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {
                                        headerGroup.headers.map(column => (
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
                            page.map(row => {
                                prepareRow(row)
                                return (
                                    <tr {...row.getRowProps()}>
                                        {
                                            row.cells.map(cell => {
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
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{" "}
                </span>
                <span>
                    Go to Page:{" "}
                    <input type="number"
                        min="1"
                        defaultValue={pageIndex + 1}
                        onChange={(e) => {
                            const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                            gotoPage(pageNumber)
                        }}
                        style={{ width: "50px" }}
                    />
                </span>
                <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                >
                    {[5, 10, 15, 20, 30].map((ps) => (
                        <option key={ps} value={ps}>
                            Show {ps}
                        </option>
                    ))}
                </select>
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {"<<"}
                </button>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>Prev</button>
                <button onClick={() => nextPage()} disabled={!canNextPage}>Next</button>
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{">>"}</button>
            </div>
        </div>
    )
}

export default ResultTable