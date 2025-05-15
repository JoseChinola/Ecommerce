import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'
import { useCallback, useEffect, useState } from 'react'
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

  const fetchUser = useCallback(async () => {
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData?.data))
  }, [dispatch])

  const fetchCategory = useCallback(async () => {
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
  }, [dispatch])

  const fetchSubCategory = useCallback(async () => {
    try {
      const res = await Axios({ ...SummaryApi.getSubCategory })
      const { data: resData } = res
      if (resData.success) {
        dispatch(setAllSubCategory(resData.data))
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }, [dispatch])

  useEffect(() => {
    fetchUser()
    fetchCategory()
    fetchSubCategory()
  }, [fetchUser, fetchCategory, fetchSubCategory]);

  const isUserLoggedIn = Boolean(user && user._id)

  return (
    <GlobalProvider>
      <div className="flex min-h-screen">
        {isUserLoggedIn && (
          <Asidebar isOpen={isAsideOpen} closeAside={() => setIsAsideOpen(false)} />
        )}

        <main className={`flex-1 min-h-screen overflow-x-hidden overflow-y-hidden transition-all duration-300 ${isUserLoggedIn ? 'md:ml-56' : ''}`}>
          <Header toggleAside={() => setIsAsideOpen(!isAsideOpen)} />
          <div className="p-3">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>

      <Toaster
        position="top-right"
        containerStyle={{
          right: '30px',
          top: '20px',
        }}
        toastOptions={{
          className: 'custom-toast',
          duration: 4000,
          style: {
            padding: '8px',
            borderRadius: '8px',
            fontSize: '16px',
          },
          success: {
            style: {
              background: '#f0fdf4', // bg-green-50
              color: '#15803d',      // text-green-700
              borderLeft: '4px solid #16a34a',
            },
          },
          error: {
            style: {
              background: '#fef2f2',
              color: '#b91c1c',
              borderLeft: '4px solid #dc2626',
            },
          },
        }}
      />



      {location.pathname !== '/checkout' && <CartMobileLink />}
    </GlobalProvider>
  )
}

export default App
