"use client"

import React, { createContext, useReducer, useContext } from "react";

export type StageData = {
  id: string;
  attrs: Record<string, any>;
  className: string;
  children?: StageData[];
};

const initialState: StageData[] = [];

type StageAction =
  | { type: "ADD_ITEM"; payload: StageData | StageData[] }
  | { type: "UPDATE_ITEM"; payload: StageData | StageData[] }
  | { type: "REMOVE_ITEM"; payload: string | string[] }
  | { type: "CLEAR_ITEMS" };

const stageReducer = (state: StageData[], action: StageAction): StageData[] => {
  switch (action.type) {
    case "ADD_ITEM":
      if (Array.isArray(action.payload)) {
        return [...state, ...action.payload];
      }
      return [...state, action.payload];
    case "UPDATE_ITEM":
      if (Array.isArray(action.payload)) {
        const payload: StageData[] = action.payload;
        return state.map((item) =>
          payload.find((update) => update.id === item.id)
            ? {
                ...item,
                ...payload.find((update) => update.id === item.id),
              }
            : item
        );
      }

      const payload: StageData = action.payload;

      return state.map((item) =>
        item.id === payload.id ? { ...item, ...action.payload } : item
      );
    case "REMOVE_ITEM":
      if (Array.isArray(action.payload)) {
        return state.filter((item) => !action.payload.includes(item.id));
      }
      return state.filter((item) => item.id !== action.payload);
    case "CLEAR_ITEMS":
      return [];
    default:
      throw new Error("Ação desconhecida");
  }
};

const StageDataContext = createContext<{
  state: StageData[];
  dispatch: React.Dispatch<StageAction>;
} | null>(null);

export const StageDataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(stageReducer, initialState);

  return (
    <StageDataContext.Provider value={{ state, dispatch }}>
      {children}
    </StageDataContext.Provider>
  );
};

export const useStageData = () => {
  const context = useContext(StageDataContext);
  if (!context) {
    throw new Error(
      "useStageData deve ser usado dentro de um StageDataProvider"
    );
  }
  return context;
};
