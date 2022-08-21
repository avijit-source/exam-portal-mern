import React from 'react'
import { FaFileExport } from 'react-icons/fa'
import jsPDF from "jspdf";
import 'jspdf-autotable';
import './resulttable2.css'
function MarksheetTable({ resultData }) {
    function handleClick(e) {
        let str = `StudentId: ${resultData.userId},
        Exam Name: ${resultData.examname},
        Attended: ${resultData.attended},
        Correct: ${resultData.correct},
        Total Questions: ${resultData.totalquestions},
        Time of submit: ${resultData.timeofsubmit}
        `
        const doc = new jsPDF({ orientation: 'landscape' });
        doc.setFontSize(10)
        doc.text(str, 20, 10);
        doc.autoTable({
            theme: "grid",
            margin: {
                top: 40,
            },
            didDrawPage: function (data) {
                // Reseting top margin. The change will be reflected only after print the first page.
                data.settings.margin.top = 10;
            },
            columns: Object.keys(resultData.answersheet[0])
            .filter(val => val !== "_id")
            .map(col => ({ header: col, dataKey: col })),
            body: resultData.answersheet.map(ans => {
                return ans;
            })
        });

        doc.save(`${resultData.userId}-result.pdf`);
    }
    const stylesObj = {
        backgroundColor: "#0744a6", /* Green */
        border: "none",
        color: "white",
        padding: "8px 16px",
        textAlign: "center",
        textDecoration: "none",
        display: "inline-block",
        fontSize: "16px",
        margin: "10px",
        cursor: "pointer"
    }

    if (resultData.answersheet) {
        return <>

            <button style={stylesObj} onClick={handleClick}>
                <FaFileExport />
                <span>Export as pdf</span>
            </button>

            <div className="questiontable2">
                <table>
                    <thead>
                        <tr>
                            {resultData?.answersheet && Object.keys(resultData?.answersheet[0]).filter(val => val !== "_id").map(val => (
                                <th key={Date.now() + val}>{val}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {resultData?.answersheet && resultData?.answersheet.map((sheet, i) => {
                            return <tr key={i}>
                                <td>{sheet.answer}</td>
                                <td>{sheet.question}</td>
                                <td>{sheet.questionCorrectAns}</td>
                                <td>{sheet.option1}</td>
                                <td>{sheet.option2}</td>
                                <td>{sheet.option3}</td>
                                <td>{sheet.option4}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </>
    } else {
        return <div className="lds-hourglass"></div>
    }
}

export default MarksheetTable