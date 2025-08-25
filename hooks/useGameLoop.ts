
import React from 'react';
import type { GameAction } from '../types';

export const useGameLoop = (dispatch: React.Dispatch<GameAction>, interval: number) => {
  React.useEffect(() => {
    const gameInterval = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, interval);

    return () => clearInterval(gameInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, interval]);
};
