import { useEffect, useState } from 'react'
import Select, { StylesConfig } from 'react-select'


export interface MySelectOption {
  value: string
  label: string
}

interface MySelectProps {
  selectedValue?: any
  options: MySelectOption[]
  isMulti?: boolean
  hasAll?: boolean
  onSelectChange: (option: MySelectOption[] | MySelectOption) => void
}

export default function MySelectComponent({selectedValue, options, isMulti = false, hasAll = false, onSelectChange}: MySelectProps) {
  const allOption: MySelectOption = { value: 'all', label: 'All' };
  const fullOptions = hasAll ? [allOption, ...options] : options;

  const [selectValue, setSelectValue] = useState<MySelectOption[] | MySelectOption | null>(null)

  useEffect(() => {
    setSelectValue(selectedValue || null);
  }, [selectedValue]);
  
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


  useEffect(() => {
    if (!selectValue) return;

    if (isMulti && hasAll) {
      const values = selectValue as MySelectOption[];
      const isAllSelected = values.some((v) => v.value === 'all');
  
      if (isAllSelected) {
        const allRealOptions = [...options]; // exclude 'All'
        setSelectValue([allOption, ...allRealOptions]);
        onSelectChange(allRealOptions); // 🔥 send only real artists to parent
        return;
      }
  
      const filtered = values.filter((v) => v.value !== 'all');
      setSelectValue(filtered);
      onSelectChange(filtered);
      return;
    }
    onSelectChange(selectValue);
  }, [selectValue])

  return(
    <div>
      <Select
        // @ts-ignore
        isMulti={isMulti}
        value={selectValue}
        onChange={(ele) => setSelectValue(ele)}
        options={fullOptions}
        styles={darkModeStyles}
      />    
    </div>
  )

}