interface TableBtnProps {
  label: any
  btnClass: string
  onButtonClick: () => any
}

const TableBtn = ({label, btnClass, onButtonClick}: TableBtnProps) => {

  return (
    <div className="relative">
      <button 
        className={"text-white focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5  mx-2 text-center inline-flex items-center cursor-pointer transition " + btnClass} 
        type="button"
        onClick={onButtonClick}
      >
        {label} 
      </button>

    </div>
  )
}

export default TableBtn