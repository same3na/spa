import { useEffect, useState } from 'react'
import Select, { StylesConfig } from 'react-select'


export interface MySelectOption {
  value: string
  label: string
}

interface MySelectProps {
  values?: MySelectOption[] | MySelectOption
  options: MySelectOption[]
  isMulti?: boolean
  hasAll?: boolean
  onSelectChange: (option: MySelectOption[] | MySelectOption) => void
}

export default function MySelectComponent({values, options, isMulti = false, hasAll = false, onSelectChange}: MySelectProps) {
  const allOption: MySelectOption = { value: 'all', label: 'All' };
  const fullOptions = hasAll ? [allOption, ...options] : options;

  const [selectValue, setSelectValue] = useState<MySelectOption[] | MySelectOption | null>(null)

  useEffect(() => {
    setSelectValue(values || null);
  }, [values]);
  
  // Define custom styles for Dark Mode
  const darkModeStyles: StylesConfig<{ value: string; label: string }, false> = {
    control: (base) => ({
      ...base,
      backgroundColor: "#1f2937", // Gray-800
      borderColor: "#374151", // Gray-700
      color: "#fff",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#4b5563", // Gray-600
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1f2937", // Gray-800
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected
        ? "#374151" // Gray-700
        : isFocused
        ? "#4b5563" // Gray-600 on hover
        : "transparent",
      color: "#fff",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#fff",
    }),
    input: (base) => ({
      ...base,
      color: "#fff", // Ensures search text is white
    }),
  };

  const onOptionsChange = (ele:any) => {

    if (!ele) return;

    if (isMulti && hasAll) {
      const values = ele as MySelectOption[];
      const isAllSelected = values.some((v) => v.value === 'all');
  
      if (isAllSelected) {
        const allRealOptions = [...options]; // exclude 'All'
        onSelectChange(allRealOptions); // 🔥 send only real artists to parent
        return;
      }
  
      const filtered = values.filter((v) => v.value !== 'all');
      onSelectChange(filtered);
      return;
    }
    console.log("changing the option", ele)
    onSelectChange(ele);
  }

  return(
    <div>
      <Select
        // @ts-ignore
        isMulti={isMulti}
        value={selectValue}
        onChange={onOptionsChange}
        options={fullOptions}
        styles={darkModeStyles}
      />    
    </div>
  )

}