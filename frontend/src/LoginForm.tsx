import React, { useState } from "react";
import { useAuth } from "./AuthContext";

const MIN_LEN = 4;

export default function LoginForm() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
        mode === "login" ? "Неверный логин или пароль" : "Не удалось зарегистрировать"
      );
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xs bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col gap-4"
    >
      <h2 className="text-2xl font-bold text-center">
        {mode === "login" ? "Авторизация" : "Регистрация"}
      </h2>

      {error && <p className="text-red-400 text-center">{error}</p>}

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Логин"
        className="p-2 rounded text-black"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
        className="p-2 rounded text-black"
      />

      <button
        type="submit"
        disabled={!isValid || loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded shadow"
      >
        {loading ? "…" : mode === "login" ? "Войти" : "Создать аккаунт"}
      </button>

      <p className="text-sm text-center">
        {mode === "login" ? "Нет аккаунта? " : "Уже есть аккаунт? "}
        <button
          type="button"
          className="text-blue-400 underline"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Создать" : "Войти"}
        </button>
      </p>
    </form>
  );
}

