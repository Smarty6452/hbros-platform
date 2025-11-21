
import { Navigate } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuth = useAuthStore((s) => s.isAuthenticated())

  if (!isAuth) return <Navigate to="/login" replace />

  return children
}

export default ProtectedRoute
