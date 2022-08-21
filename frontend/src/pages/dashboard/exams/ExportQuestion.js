import React from 'react'
import { FaFileExport } from 'react-icons/fa'
import jsPDF from "jspdf";
import 'jspdf-autotable';
function ExportQuestion({questions,examcode,columns}) {
    function handleClick(e){
        const doc = new jsPDF({ orientation: 'landscape' });
        doc.text(`Examcode: ${examcode}`,20,10);
        doc.autoTable({
            theme: "grid",
            columns: columns.map(col => ({ header:col.Header, dataKey: col.accessor })),
            body: questions
        })
        doc.save(`${examcode}-questions.pdf`)
    }
    const stylesObj = {
        backgroundColor:"#0744a6", /* Green */
        border: "none",
        color: "white",
        padding: "8px 16px",
        textAlign: "center",
        textDecoration: "none",
        display: "inline-block",
        fontSize: "16px",
        margin: "4px 2px",
        cursor: "pointer"
    }
  return (
    <div>
        <button style={stylesObj} onClick={handleClick}>
        <FaFileExport />
        <span>Export as pdf</span>              
        </button>
    </div>
  )
}

export default ExportQuestion