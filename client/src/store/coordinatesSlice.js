import { createSlice } from "@reduxjs/toolkit";

const coordinateSlice = createSlice({
    name: "coordinates",
    initialState: {
        lat: null,  // Latitud
        lng: null, // Longitud
        placeName: "",    //luagr del siito
    },
    reducers: {
        setCoordinates: (state, action) => {
            state.lat = action.payload.lat
            state.lng = action.payload.lng;
            state.placeName = action.payload.placeName || "";
        },
    },
});

export const { setCoordinates } = coordinateSlice.actions;
export default coordinateSlice.reducer;