import React, { useState } from 'react'
import {useAsyncDebounce} from 'react-table';

function ExamTableGlobalSearch({filter,setFilter}) {
    const [value,setValue] = useState(filter);
     
    // debounce
    const onChange = useAsyncDebounce(value=>{
      setFilter(value||undefined);
    },1000);
  return (
     <div style={{marginBottom:"10px"}}>
         <span>
        <input value={value || ""}
         style={{width:"250px",height:"36px"}}
         placeholder="search here"
         onChange={e=>{
          setValue(e.target.value);
          onChange(e.target.value);
         }}
        />
    </span>
     </div>
  )
}

export default ExamTableGlobalSearch