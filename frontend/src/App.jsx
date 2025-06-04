import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import Navbar from './components/Navbar'

const App = () => {

  return (
		<div className='relative min-h-screen bg-gray-800 text-[#e3e3e3] overflow-hidden'>
			<div className='absolute inset-0 top-0 left-1/2 -translate-x-1/2 w-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_5%,rgba(10,80,60,0.2)_65%,rgba(0,0,0,0.1)_100%)]' />
      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/login' element={<LoginPage />} />
        </Routes>
      </div>
		</div>
  )
}

export default App
