import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const user = true
  const isAdmin = true
  const cart = ['Headphones', 'Laptop', 'Fish']

  return (
		<header className='fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 styleSet2 border-b border-emerald-800'>
			<div className='container mx-auto px-4 py-3'>
				<div className='styleSet1 flex-wrap justify-between'>
					<Link
						to='/'
						className='styleSet1 text-2xl font-bold text-emerald-400 space-x-2'>
						E-Commerce
					</Link>
					<nav className='styleSet1 flex-wrap gap-4'>
						<Link to={'/'} className=' mx-4 text-gray-300 hover:text-emerald-400 styleSet2'>Home
						</Link>
						{user && (
							<Link
								to={'/cart'}
								className='relative group text-gray-300 hover:text-emerald-400 styleSet2'>
								<ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
								<span className='hidden sm:inline'></span>
								{cart.length > 0 && (
									<span className='absolute -top-2 -right-2 bg-emerald-500 text-[#e3e3e3] rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 styleSet2'>
										{cart.length}
									</span>
								)}
							</Link>
						)}
						{isAdmin && (
							<Link to={'/dashboard'} className='bg-emerald-700 hover:bg-emerald-600 text-[#e3e3e3] mx-4 px-3 py-1 rounded-md font-medium styleSet1 styleSet2'>
								<Lock className='inline-block mr-1' size={18} />
								<span className='hidden sm:inline'>Dashboard</span>
							</Link>
						)}
						{user ? (
							<button className='bg-gray-700 hover:bg-gray-600 text-[#e3e3e3] px-4 py-2 rounded-md styleSet1 styleSet2'>
								<LogOut size={18} />
								<span className='hidden sm:inline ml-2'>Log-out</span>
							</button>
						) : (
							<>
								<Link to={'/signup'} className='bg-emerald-600 hover:bg-emerald-700 text-[#e3e3e3] px-4 py-2 rounded-md styleSet1 styleSet2'>
									<UserPlus className='mr-2' size={18} />Sign-up
								</Link>
								<Link	to={'/login'}	className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md styleSet1 styleSet2'>
									<LogIn className='mr-2' size={18} />Login
								</Link>
							</>
						)}
					</nav>
				</div>
			</div>
		</header>
  )
}

export default Navbar