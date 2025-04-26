import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import fetchUserDetails from './utils/fetchUserDetails'
import { setUserDetails } from './store/userSlice'
import { setAllCategory, setAllSubCategory, setLoadingCategory } from './store/ProductSlice'
import { useDispatch, useSelector } from 'react-redux'
import AxiosToastError from './utils/AxiosToastError'
import SummaryApi from './cammon/SummaryApi'
import Axios from './utils/Axios'
import GlobalProvider from './provider/GlobalProvider'
import CartMobileLink from './components/CartMobile'
import Asidebar from './pages/Asidebar'

function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const user = useSelector((state) => state?.user)
  const [isAsideOpen, setIsAsideOpen] = useState(false)

  const fetchUser = async () => {
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData?.data))
  }

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true))
      const res = await Axios({ ...SummaryApi.getcategory })
      const { data: resData } = res
      if (resData.success) {
        dispatch(setAllCategory(resData.data))
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      dispatch(setLoadingCategory(false))
    }
  }

  const fetchSubCategory = async () => {
    try {
      const res = await Axios({ ...SummaryApi.getSubCategory })
      const { data: resData } = res
      if (resData.success) {
        dispatch(setAllSubCategory(resData.data))
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  useEffect(() => {
    fetchUser()
    fetchCategory()
    fetchSubCategory()
  }, [])

  const isUserLoggedIn = !!user?._id

  return (
    <GlobalProvider>
      <div className="flex min-h-screen">
        {isUserLoggedIn && (
          <Asidebar isOpen={isAsideOpen} closeAside={() => setIsAsideOpen(false)} />
        )}

        <main className={`flex-1 min-h-screen overflow-x-hidden overflow-y-hidden transition-all duration-300 ${isUserLoggedIn ? 'md:ml-56' : ''}`}>
          <Header toggleAside={() => setIsAsideOpen(!isAsideOpen)} />
          <div className="p-4">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>

      <Toaster />
      {location.pathname !== '/checkout' && <CartMobileLink />}
    </GlobalProvider>
  )
}

export default App
