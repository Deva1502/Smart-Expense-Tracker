import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://smart-expense-tracker-c9xv.onrender.com/api/expenses';

// Get expenses
export const getExpenses = createAsyncThunk('expenses/getAll', async (_, thunkAPI) => {
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

// Create expense
export const createExpense = createAsyncThunk('expenses/create', async (expenseData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const response = await axios.post(API_URL, expenseData, config);
        return response.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete expense
export const deleteExpense = createAsyncThunk('expenses/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        await axios.delete(`${API_URL}/${id}`, config);
        return id;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const initialState = {
    expenses: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const expenseSlice = createSlice({
    name: 'expenses',
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
            .addCase(getExpenses.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getExpenses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.expenses = action.payload;
            })
            .addCase(getExpenses.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createExpense.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createExpense.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.expenses.unshift(action.payload); // Add to beginning
            })
            .addCase(createExpense.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.expenses = state.expenses.filter((expense) => expense._id !== action.payload);
            });
    },
});

export const { reset } = expenseSlice.actions;
export default expenseSlice.reducer;
