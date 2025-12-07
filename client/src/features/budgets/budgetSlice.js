import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/budgets';

// Get budgets
export const getBudgets = createAsyncThunk('budgets/getAll', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.get(API_URL, config);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Set budget
export const setBudget = createAsyncThunk('budgets/set', async (budgetData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(API_URL, budgetData, config);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete budget
export const deleteBudget = createAsyncThunk('budgets/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.delete(API_URL + '/' + id, config);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const initialState = {
    budgets: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const budgetSlice = createSlice({
    name: 'budgets',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBudgets.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getBudgets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.budgets = action.payload;
            })
            .addCase(getBudgets.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(setBudget.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(setBudget.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Update or add
                const index = state.budgets.findIndex(b => b.category === action.payload.category && b.month === action.payload.month);
                if (index !== -1) {
                    state.budgets[index] = action.payload;
                } else {
                    state.budgets.push(action.payload);
                }
            })
            .addCase(setBudget.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteBudget.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteBudget.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.budgets = state.budgets.filter(
                    (budget) => budget._id !== action.payload.id
                );
            })
            .addCase(deleteBudget.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = budgetSlice.actions;
export default budgetSlice.reducer;
