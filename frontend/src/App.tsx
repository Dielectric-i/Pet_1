import { Store, useStore } from './store';

function Counter() {
  const [{ count }, dispatch] = useStore();
  return (
    <>
      <button onClick={() => dispatch({ type: 'dec' })}>-</button>
      <span style={{ margin: '0 1rem' }}>{count}</span>
      <button onClick={() => dispatch({ type: 'inc' })}>+</button>
    </>
  );
}

export default function App() {
  return (
    <Store>
      <h1>Hello !👋</h1>
      <Counter />
    </Store>
  );
}
