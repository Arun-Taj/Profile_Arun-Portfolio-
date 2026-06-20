// import React from 'react'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
// import { AuthProvider } from './hooks/useAuth.jsx'
// import Navbar from './components/Navbar.jsx'
// import Footer from './components/Footer.jsx'
// import Home from './pages/Home.jsx'
// import ProjectDetail from './pages/ProjectDetail.jsx'
// import AdminLogin from './pages/AdminLogin.jsx'
// import AdminDashboard from './pages/AdminDashboard.jsx'

// export default function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={
//             <>
//               <Navbar />
//               <main><Home /></main>
//               <Footer />
//             </>
//           } />
//           <Route path="/project/:id" element={
//             <>
//               <Navbar />
//               <main><ProjectDetail /></main>
//               <Footer />
//             </>
//           } />
//           <Route path="/admin" element={<AdminLogin />} />
//           <Route path="/admin/dashboard" element={<AdminDashboard />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   )
// }



import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth.jsx'

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

import Home from './pages/Home.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

function PortfolioLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Home />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* Portfolio Routes */}
          <Route path="/" element={<PortfolioLayout />} />
          <Route path="/about" element={<PortfolioLayout />} />
          <Route path="/skills" element={<PortfolioLayout />} />
          <Route path="/experience" element={<PortfolioLayout />} />
          <Route path="/projects" element={<PortfolioLayout />} />
          <Route path="/education" element={<PortfolioLayout />} />
          <Route path="/testimonials" element={<PortfolioLayout />} />
          <Route path="/contact" element={<PortfolioLayout />} />

          {/* Project Details */}
          <Route
            path="/project/:id"
            element={
              <>
                <Navbar />
                <main>
                  <ProjectDetail />
                </main>
                <Footer />
              </>
            }
          />

          {/* Admin */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

        </Routes>
      </Router>
    </AuthProvider>
  )
}