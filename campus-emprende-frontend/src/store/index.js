import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import serviceReducer from './service/serviceSlice';
import reportReducer from './report/reportSlice';
import reviewReducer from './review/reviewSlice';
import serviceRequestReducer from './serviceRequest/serviceRequestSlice';
import adminReducer from './admin/adminSlice';
import commentReducer from './comment/commentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    service: serviceReducer,
    report: reportReducer,
    review: reviewReducer,
    serviceRequest: serviceRequestReducer,
    admin: adminReducer,
    comment: commentReducer,
  },
});
