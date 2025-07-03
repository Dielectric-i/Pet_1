import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const MIN_LEN = 4;

export default function LoginForm() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isValid = username.length >= MIN_LEN && password.length >= MIN_LEN;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setError(`Минимум ${MIN_LEN} символа`);
      return;
    }
    setLoading(true);
    setError(null);

    const ok =
      mode === "login"
        ? await login(username, password)
        : await register(username, password);

    if (!ok) {
      setError(
        mode === 'login'
          ? 'Неверный логин или пароль'
          : 'Не удалось зарегистрировать'
      );
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col gap-4"
    >
      <h2 className="text-xl font-semibold text-center">
        {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
      </h2>

      <input
        className="px-3 py-2 rounded bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
        value={username}
        placeholder="Логин"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="px-3 py-2 rounded bg-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <p className="text-sm text-red-500 text-center whitespace-pre-line">
          {error}
        </p>
      )}

      <button
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded shadow"
        type="submit"
        disabled={!isValid || loading}
      >
        {loading
          ? '...'
          : mode === 'login'
          ? 'Войти'
          : 'Зарегистрироваться'}
      </button>

      <p className="text-sm text-center">
        {mode === 'login' ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
        <button
          type="button"
          className="text-blue-400 underline"
          onClick={() =>
            setMode(mode === 'login' ? 'register' : 'login')
          }
        >
          {mode === 'login' ? 'Создать' : 'Войти'}
        </button>
      </p>
    </form>
  );
}