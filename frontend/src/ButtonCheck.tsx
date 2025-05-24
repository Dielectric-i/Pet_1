import { useState } from "react";

export default function ButtonCheck() {

  const [status, setStatus] = useState<string | null>(null);
  
  const checkBackend = async () => {
    try {
      const res = await fetch('/check');
      
      // Проверим что реально backend ответил
      const contentType = res.headers.get('Content-Type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error('Некорректный ответ от backend');
      }
  
      const data = await res.json();
      if (data?.status) {
        setStatus(`✅ ${data.status}`);
      } else {
        setStatus('⚠️ Некорректный ответ от backend');
      }
    } catch (err) {
      setStatus('❌ Ошибка соединения с backend');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-6">Добро пожаловать!</h1>
      <button
        onClick={checkBackend}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
      >
        Проверить
      </button>
      {status /* && (
        <p className="mt-4 text-sm text-gray-300">{status}</p>
      )*/}
    </div>
  );
}