import React from 'react'
interface Props {
    title:string;
    icon?:any;
}
const SelectNoData = ({title, icon}:Props) => {
  return (
    <div className='select-no-data'>
        
        {title}
        
        </div>
  )
}

export default SelectNoData