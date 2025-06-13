import { useState } from "react";
import { Artist, createArtistSearch, getArtists } from '@/api/search';
import { useNavigate } from "react-router-dom";

export default function Artists() {
  const navigate = useNavigate();

  const [name, setName] = useState<string>(''); // State to hold input value
  const [response, setResponse] = useState<any>(null); // State to hold API response
  
  const handleSearchArtistClick = async () => {
    if (!name) {
      alert('Please enter a name');
      return;
    }
    const data = await getArtists({name})
    setResponse(data);
  }

  const handleSearchForArtistSongs = async (artist_id:string, artist_name:string) => {
    await createArtistSearch({artist_id, artist_name})
    navigate(`/search`)
  }

  return (
    <div>
      <div className="flex justify-center p-3">
        <div className="relative max-w-sm">
          <input 
            type="email" 
            className="w-full bg-transparent placeholder:text-slate-400 font-bold text-white text-sm border border-slate-200 rounded-md pr-3 pl-20 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" 
            placeholder="Enter your text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button 
            className="absolute left-1 top-1 rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" 
            type="button"
            onClick={handleSearchArtistClick}
          >
            Search
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1">
        {/* <div className="">
          <div className="text-white font-bold bg-gray-800 rounded p-4">
            List of downloaded sheets
          </div>
        </div> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 col-span-4 col-span-4 px-5">
          {response && (
            response.map((item:Artist, index:number) => (
              <div 
                className="p-3 text-white text-center font-bold cursor-pointer"
                key={index}
              >
                <div
                  className="rounded-full overflow-hidden w-full pt-[100%] relative"
                >
                  <img 
                    className=" object-cover absolute top-0 left-0 w-100" 
                    src={item.image || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23e0e0e0' /%3E%3Cpath d='M35,40 Q50,25 65,40' stroke='black' fill='transparent' stroke-width='2' /%3E%3Ccircle cx='50' cy='55' r='10' fill='black' /%3E%3C/svg%3E`} 
                  />
                </div>
                {item.name}
                <button 
                  className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-auto"
                  onClick={() => handleSearchForArtistSongs(item.id, item.name)}>Search Library
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
