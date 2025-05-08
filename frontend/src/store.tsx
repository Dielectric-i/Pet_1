import React, { createContext, useReducer, useContext, ReactNode } from 'react';

type State = { count: number };
type Action = { type: 'inc' | 'dec' };

function reducer(state: State, action: Action): State {
  return action.type === 'inc' ? { count: state.count + 1 } : { count: state.count - 1 };
}

const Ctx = createContext<[State, React.Dispatch<Action>] | undefined>(undefined);

export const Store = ({ children }: { children: ReactNode }) => (
  <Ctx.Provider value={useReducer(reducer, { count: 0 })}>{children}</Ctx.Provider>
);

export const useStore = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be inside <Store>');
  return ctx;
};
