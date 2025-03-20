import { useEffect, useState } from "react";

interface filterElement {
  id: string
  name: string
}

interface TableFilterProps<T> {
  label: string
  items: Array<T>
  onFilterChange: (filter: Array<any>) => void
}

const MultipleSelect = <T extends filterElement,>({label, items, onFilterChange}: TableFilterProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Array<T>>([])

  const onElementChecked = (element:T) => {
    setCheckedItems((prevState) => {
      const elements = [...prevState]

      if (isItemChecked(element)) {
        return elements.filter((item) => item.id !== element.id);
      }
      elements.push(element)
      return elements
    })

  }

  const isItemChecked = (element:T) => {
    const isChecked = checkedItems.some(s => s.id === element.id);

    return isChecked
  }

  useEffect(() => {
    onFilterChange(checkedItems);
  }, [checkedItems]);
  

  const toggleDropdown = () => setIsOpen(!isOpen);
  return (
    <div className="">
      <div className="flex">
        <button 
          id="dropdownBgHoverButton" 
          className="text-white  focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center hover:bg-gray-800 focus:ring-blue-800" 
          type="button"
          onClick={toggleDropdown}
        >
          {label} 

          <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
          </svg>
        </button>

        <div className="flex items-center justify-center">
          {checkedItems.map((item:filterElement) => (
            <span className="px-2" key={item.id}>{item.name}</span>
          ))}
        </div>

      </div>

      <div className="relative">
        {isOpen && (
          <div className="absolute z-10 mt-2 w-48 bg-white rounded-lg shadow-sm dark:bg-gray-700">
            <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200">
              {items.map((filterElement: any) => (
                <li key={filterElement.id}>
                  <div className="flex items-center p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                      <input 
                        onChange={() => onElementChecked(filterElement)} 
                        id={filterElement.id} 
                        type="checkbox"
                        checked={isItemChecked(filterElement)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" 
                      />
                      <label 
                        htmlFor={filterElement.id} 
                        className="w-full ms-2 text-sm font-medium text-gray-900 rounded-sm dark:text-gray-300">

                        {filterElement.name}
                      </label>
                    </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

    </div>
  )
}

export default MultipleSelect