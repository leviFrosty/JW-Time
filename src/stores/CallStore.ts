import AsyncStorage from "@react-native-async-storage/async-storage";
import { LatLng } from "react-native-maps";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import Asset from "./assets";
import moment from "moment";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export type InterestLevel =
  | "not-interested"
  | "little-interested"
  | "interested"
  | "hungry"
  | string;

export const interestLevels: InterestLevel[] = [
  "not-interested",
  "little-interested",
  "interested",
  "hungry",
];

export const newCallBase = (): Call => ({
  id: uuidv4(),
  name: "",
});

export interface Call extends Asset {
  name: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    coordinates?: LatLng;
  };
  note?: string;
  interestLevel?: InterestLevel;
  preferredVisitTime?: string;
  isStudy: boolean; // a call must have at least 4 visits to become a study
  isReturnVisit: boolean; // a call must have at least 2 visits to become a return visit
  // DO NOT SAVE VISITS DIRECTLY TO CALL.
  // Filter visits by call.id to get call's visits.
}

type CallsStore = {
  calls: Call[];
  deleteCall: (callId: string) => void;
  setCall: (updatedCall: Call) => void;
  deleteAllCalls: () => void;
};

const useCallsStore = create(
  persist<CallsStore>(
    (set) => ({
      calls: [],
      deleteCall: (callId) => {
        set((state) => ({
          calls: state.calls.filter((o) => o.id !== callId),
        }));
      },
      setCall: (newCallOrCallUpdates) => {
        set((state) => {
          const calls: Call[] = JSON.parse(JSON.stringify(state.calls));
          const index = calls.findIndex(
            (o) => o.id === newCallOrCallUpdates.id
          );
          if (index === -1) {
            // call not found
            // pushing new call to list

            calls.push({ ...newCallOrCallUpdates, createdAt: moment() });
          } else {
            // call found
            const existingCall = calls[index];
            // Overrides existing values
            const updatedCall: Call = {
              ...existingCall,
              ...newCallOrCallUpdates,
              lastUpdated: moment(),
            };
            calls[index] = updatedCall;
          }
          return { calls };
        });
      },
      deleteAllCalls: () => set({ calls: [] }),
    }),
    {
      name: "callStore", // unique name
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCallsStore;