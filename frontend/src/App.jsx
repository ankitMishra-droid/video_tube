import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import { ThemeProvider } from './components/theme-provider'
import AppLayout from './components/layout/AppLayout'

function App() {

  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <Home />
        }
      ]
    }
  ])

  return (
    <>
    <ThemeProvider >
      <RouterProvider router={router}/>
    </ThemeProvider>
    </>
  )
}

export default App
