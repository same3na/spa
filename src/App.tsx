import './App.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { PlayerProvider } from './context/PlayerContext'
import Home from '@/pages/Home'
import Player from '@/components/PlayerComponent'
import SiteMenu from './components/MenuComponent'
import SearchPage from './pages/search/Search'
import Artists from './pages/search/Artists'
import ArtistSongs from './pages/search/ArtistSongs'
import Clusters from './pages/cluster/Cluster'
import ClusterSingle from './pages/cluster/ClusterSingle'
import ClusterSpecifications from './pages/specification/ClusterSpecifications'
import CreateSpecification from './pages/specification/CreateSpecification'
import EditSpecification from './pages/specification/EditSpecification'
import CreateCluster from './pages/cluster/CreateCluster'
import SongSingle from './pages/songs/Single'
import PlaylistCreate from './pages/playlists/PlaylistCreate'
import Playlists from './pages/playlists/Playlists'
import Classifications from './pages/classifications/Classifications'
import ClassificationCreate from './pages/classifications/ClassificationCreate'

function App() {

  return (
    <div className='antialiased bg-black text-white pb-[400px]'>
      <Router>
        <PlayerProvider>
          <SiteMenu />
          <div className='p-4'>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchPage/>} />
              <Route path="/search/artists" element={<Artists/>} />
              <Route path="/search/artists/:id" element={<ArtistSongs/>} />
              <Route path="/clusters" element={<Clusters/>} />
              <Route path="/clusters/create" element={<CreateCluster/>} />
              <Route path="/clusters/:id" element={<ClusterSingle/>} />
              <Route path="/clusters/:cluster_id/specifications" element={<ClusterSpecifications/>} />
              <Route path="/clusters/:cluster_id/specifications/create" element={<CreateSpecification/>} />
              <Route path="/specifications/:id" element={<EditSpecification/>} />
              <Route path="/songs/:id" element={<SongSingle/>} />
              <Route path="/playlists" element={<Playlists/>} />
              <Route path="/playlist/create" element={<PlaylistCreate/>} />
              <Route path="/classifications" element={<Classifications/>} />
              <Route path="/classification/create" element={<ClassificationCreate/>} />
            </Routes>
          </div>
          <Player></Player>
        </PlayerProvider>
      </Router>
    </div>
  )
}

export default App
