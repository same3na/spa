import ModalComponent from "../ModalComponent";
import { useCallback, useState } from "react";
import FilterSongsComponent, { SongsFilter } from "../FilterSongsComponent";
import Table, { Column } from "./TableComponent";
import { Song, getSongs } from "@/api/songs";
import TableBtn from "./TableBtnComponent";

interface SongTableComponentProps {
  songIds?: string[];
  columns: Column<Song>[];
  tableBtns?: Array<React.ReactNode>
  onFilterChange?: (filters: SongsFilter) => void;
}

export default function SongTableComponent({ songIds, columns, tableBtns, onFilterChange }: SongTableComponentProps) {
  const [songsFilter, setSongsFilter] = useState<SongsFilter | null>(null)
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false)


  const filterChange = (filters:SongsFilter) => {
    setSongsFilter(filters)
    setFilterModalOpen(false)
    onFilterChange?.(filters)
  }

  const fetchSongs = useCallback(async (page: number, search: string, limit: number) => {

    const data:any = await getSongs({page, limit, search, ids: songIds, artistIds: songsFilter?.artists, featureFilter: songsFilter?.criterias})

    return { data: data.data, total: data.total };
  }, [songsFilter, songIds]);
  
  
  return (
    <div>
      <ModalComponent 
        isOpen={filterModalOpen} 
        onClose={() => setFilterModalOpen(false)} 
        contents={
          <FilterSongsComponent 
            onSaveFilter={filterChange} 
            onCancelFilter={() => setFilterModalOpen(false)}          
          />
      } />
      
      <Table<Song>
        columns={columns} 
        fetchData={fetchSongs}
        tableBtns={[
          ...(tableBtns ?? []),
          <TableBtn 
              label={"Filter"} 
              btnClass={"bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow"} 
              onButtonClick={() => setFilterModalOpen(true)} />
          
        ]}    
      />

    </div>
  );
}