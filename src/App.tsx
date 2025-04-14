import './App.css'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
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
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/auth/Login'
import ErrorMessage from './components/ErrorMessage'

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {

  return (
    <div className='antialiased bg-black text-white pb-[400px]'>
      <Router>
        <AuthProvider>
          <PlayerProvider>
            <SiteMenu />
            <ErrorMessage />
            <div className='p-4'>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<PrivateRoute><Home/></PrivateRoute>} />
                <Route path="/search" element={<PrivateRoute><SearchPage/></PrivateRoute>} />
                <Route path="/search/artists" element={<PrivateRoute><Artists/></PrivateRoute>} />
                <Route path="/search/artists/:id" element={<PrivateRoute><ArtistSongs/></PrivateRoute>} />
                <Route path="/clusters" element={<PrivateRoute><Clusters/></PrivateRoute>} />
                <Route path="/clusters/create" element={<PrivateRoute><CreateCluster/></PrivateRoute>} />
                <Route path="/clusters/:id" element={<PrivateRoute><ClusterSingle/></PrivateRoute>} />
                <Route path="/clusters/:cluster_id/specifications" element={<PrivateRoute><ClusterSpecifications/></PrivateRoute>} />
                <Route path="/clusters/:cluster_id/specifications/create" element={<PrivateRoute><CreateSpecification/></PrivateRoute>} />
                <Route path="/specifications/:id" element={<PrivateRoute><EditSpecification/></PrivateRoute>} />
                <Route path="/songs/:id" element={<PrivateRoute><SongSingle/></PrivateRoute>} />
                <Route path="/playlists" element={<PrivateRoute><Playlists/></PrivateRoute>} />
                <Route path="/playlist/create" element={<PrivateRoute><PlaylistCreate/></PrivateRoute>} />
                <Route path="/classifications" element={<PrivateRoute><Classifications/></PrivateRoute>} />
                <Route path="/classification/create" element={<PrivateRoute><ClassificationCreate/></PrivateRoute>} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
            <Player></Player>
          </PlayerProvider>
        </AuthProvider>
      </Router>
    </div>
  )
}

export default App
