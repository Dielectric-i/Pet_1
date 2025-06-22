import { AuthProvider, useAuth } from './AuthContext';
import ButtonCheck from './ButtonCheck';
import LoginForm from './LoginForm';

// Компонент для приветствия и выхода пользователя
function Greeting({ user, logout }: { user: string; logout: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white gap-6">
      <h1 className="text-3xl font-bold">Привет, {user}!</h1>
      <button
        onClick={logout}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded shadow"
      >
        Выйти
      </button>
    </div>
  );
}

// Внутренний компонент, который использует AuthContext
function Inner() {
  const { user, logout } = useAuth(); // Хук должен вызываться только внутри компонента

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white gap-6">
        <LoginForm />
        <ButtonCheck />
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