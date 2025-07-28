import { RefreshCw } from "lucide-react";
import React, { useEffect, useState } from "react";
import MyInputComponent from "../form/MyInputComponent";

export interface Column<T> {
  key: keyof T | "custom"; // Field in row data or a custom column
  label: string; // Column header
  render?: (row: T) => React.ReactNode; // Custom render logic for "custom" columns
}

export interface TableComponentProps<T> {
  columns: Column<T>[];
  fetchData: (
    page: number, 
    search: string, 
    limit: number, additionalData?: any, 
    filters?: Record<string, Array<string>>
  ) => Promise<{ data: T[]; total: number }>;
  additionalData?: any
  tableFilters?: Array<React.ReactNode>
  tableBtns?: Array<React.ReactNode>
}

const Table = <T,>({ columns, fetchData, additionalData, tableFilters, tableBtns}: TableComponentProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10)
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("")
  

  // Fetch data whenever the page changes
  const loadData = async () => {
    setLoading(true);
    const result = await fetchData(currentPage, search, limit, {...additionalData});
    setData(result.data);
    setTotalItems(result.total);
    setLoading(false);
  };


  useEffect(() => {
    loadData();
  }, [currentPage, fetchData, limit]);

  useEffect(() => {
    setCurrentPage(1)
    loadData();
  }, [search]);

  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="table-container min-w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 py-2">
        <div>
          <MyInputComponent 
            label={""} 
            name="description"
            value={search}
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center">
          {tableBtns && tableBtns.map((Button, index) => (
            <div className="px-1" key={index}>
              {Button}
            </div>
          ))}

          {tableFilters && tableFilters.map((Filter, index) => (
            <div className="px-1" key={index}>
              {Filter}
            </div>
          ))}

          <button className="flex items-center cursor-pointer gap-2 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition mx-2">
            {/* <RefreshCw className="w-5 h-5 animate-spin" /> */}
            <RefreshCw onClick={loadData} className="w-5 h-5" />
          </button>
        </div>
      </div>


      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-4 py-2 text-left text-gray-300">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="border-t border-gray-700 hover:bg-gray-800">
                <td colSpan={columns.length} className="px-4 py-2 text-gray-300">
                  Loading...
                </td>
              </tr>
            ) : data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-gray-700 hover:bg-gray-800">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-4 py-2 text-gray-300">
                      {col.key === "custom" && col.render
                        ? col.render(row) // Use custom render for "custom" columns
                        : String(row[col.key as keyof T])} {/* Default column */}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-4">
        <span className="mx-2">
          Page {currentPage} of {totalPages}
        </span>

        <input
          type="number"
          id="per_page"
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value))}
          className="bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        />

        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`mx-2 rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`mx-2 rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Table;