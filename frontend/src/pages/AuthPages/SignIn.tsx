import { Navigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { useAuth } from "../../context/AuthContext";
import { getDashboardPath } from "../../components/auth/ProtectedRoute";

export default function SignIn() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect to dashboard if already logged in
  if (!isLoading && isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return (
    <>
      <PageMeta
        title="Login | ITS (Integrated Task System)"
        description="Portal aman untuk mengelola tugas, jadwal, dan evaluasi di ITS (Integrated Task System)"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
