import { AuthProvider, useAuth } from '../features/auth/context/AuthContext';
import Greeting from '../features/auth/ui/Greeting';
import LoginForm from '../features/auth/ui/LoginForm';

// Внутренний компонент, который использует AuthContext
function Inner() {
  const { username: user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white gap-6">
        <LoginForm />
      </div>
    );
  }

  return <Greeting user={user} logout={logout} />;
}

// Оборачиваем приложение в AuthProvider
export default function App() {

  return (
    <AuthProvider>
      <Inner />
    </AuthProvider>
  );
}
