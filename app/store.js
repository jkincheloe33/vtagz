import { configureStore } from '@reduxjs/toolkit';
import product from '@/features/product/slice';
import products from '@/features/products/slice';
import productsAnalytics from '@/features/products-analytics/slice';
import user from '@/features/user/slice';
import app from '@/features/app/slice';
import login from '@/features/login/slice';
import sms from '@/features/sms/slice';
import variant from '@/features/variant/slice';
import variants from '@/features/variants/slice';

export const store = configureStore({
  reducer: {
    product,
    products,
    productsAnalytics,
    user,
    app,
    login,
    sms,
    variant,
    variants,
  },
});
