import { addSongs, queryArtistSongs, SearchSongsByAlbums, Song } from '@/api/search';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type SongMap = {
  [key: string]: Song; // key is the song ID (string), value is a Song object
}

export default function ArtistSongs(){
  const { id } = useParams(); // Extract the dynamic route parameter

  if (!id) {
    return
  }

  const [response, setResponse] = useState<any>([]); // State to hold API response
  const [downloadTracks, setDownloadTracks] = useState<SongMap>({});

  const navigate = useNavigate();

  const onDownloadSongsBtnClick = async () => {
    await addSongs({artist_id: id, song_ids: Object.keys(downloadTracks)})
    navigate(`/`)
  }

  const addToLibrary = async (songs: Song[]) => {
    const filteredSongs = songs.filter(s => {
      return !downloadTracks[s.id]
    })

    setDownloadTracks(prevState => {
      // Create a new state object to avoid mutating the previous state
      const newState = { ...prevState };
  
      // Add each song from the filtered list to the new state
      filteredSongs.forEach((s) => {
        newState[s.id] = s;
      });
  
      // Return the new state
      return newState;
    });

  }

  const addAlbumSongs = async (album: SearchSongsByAlbums) => {
    addToLibrary(album.songs)
  }

  const queryData = async () => {
    const data = await queryArtistSongs({id})
    setResponse(data);
  };

  // Fetch data on component mount
  useEffect(() => {
    if (!id) return;

    queryData()
  }, [id]); // Dependency array ensures this runs once when `id` changes  


  useEffect(() => {
    console.log('Response updated:', response); // Debug: Log state changes
  }, [response]); // Watch state updates

  
  return(
    <div className="grid grid-cols-2 p-4 pt-10">
      <div className="">
        <div className="text-white bg-gray-800 rounded p-4">
          <b>Total Number of songs to Add: {Object.keys(downloadTracks).length}</b><br></br>

          {downloadTracks && Object.keys(downloadTracks).map(songId => (
            <div key={songId}>
              {downloadTracks[songId].artists[0].name} {downloadTracks[songId].album.name} {downloadTracks[songId].name}
            </div>
          ))}

          <div className='mt-2'>
            <button
              onClick={onDownloadSongsBtnClick}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}>
                Add To Library
            </button>
          </div>
        </div>
      </div>
      <div className='px-5 text-white'>
        {response && (
            response.map((item:SearchSongsByAlbums, index: number) => (
              <div key={index} className='grid grid-cols-3 pb-5'>
                <div className='overflow-hidden w-full pt-[100%] relative'>
                  <img 
                    className=" object-cover absolute top-0 left-0 w-100" 
                    src={item.album.image || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%23e0e0e0' /%3E%3Cpath d='M35,40 Q50,25 65,40' stroke='black' fill='transparent' stroke-width='2' /%3E%3Ccircle cx='50' cy='55' r='10' fill='black' /%3E%3C/svg%3E`} 
                  />
                </div>

                <div className="text-white gap-4 cursor-pointer">
                  <div onClick={() => {
                    addAlbumSongs(item)
                  }}><b>{item.album.name}</b></div>
                  Tracks: {item.total} 
                </div>

                <div className=''>
                  {item.songs && item.songs.length > 0 ? (
                    <ul>
                    {item.songs.map((song: Song, songIndex: number) => (
                      <li key={songIndex} className={downloadTracks[song.id] ? 'bg-green-900' : ''}>{song.name}</li>
                    ))}
                  </ul>
                  ) : (
                    <p>No songs available.</p>
                  )}
                </div>
              </div>
            ))
        )}

      </div>

    </div>
  );
}
