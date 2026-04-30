import { createAsyncThunk } from '@reduxjs/toolkit';
import * as reportsApi from '@/api/reports';

export const submitReportThunk = createAsyncThunk(
  'report/submit',
  async (reportData, { rejectWithValue }) => {
    try {
      const { data } = await reportsApi.submitReport(reportData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: 'No se pudo enviar el informe.' });
    }
  }
);

export const getReportsThunk = createAsyncThunk(
  'report/getAll',
  async (status, { rejectWithValue }) => {
    try {
      const { data } = await reportsApi.getReports(status);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: 'No se pudieron obtener los informes.' });
    }
  }
);

export const resolveReportThunk = createAsyncThunk(
  'report/resolve',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const { data } = await reportsApi.resolveReport(id, reason);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data ?? { message: 'No se pudo resolver el informe' });
    }
  }
);
