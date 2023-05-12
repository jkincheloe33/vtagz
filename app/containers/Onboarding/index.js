import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createBrand } from '@/features/login/thunks';
import SignUp from '@/components/Onboarding/SignUp';
import BrandDetails from '@/components/Onboarding/BrandDetails';
import VtagzIncludesLayout from '@/components/VtagzIncludesLayout';

export default function Onboarding() {
  const dispatch = useDispatch();
  const { error } = useSelector(({ user }) => user);
  const [step, setStep] = useState(0);

  const signUp = async (params) => {
    // await and unwrap to prevent next step until thunk is fulfilled
    await dispatch(createBrand(params)).unwrap();
    setStep((s) => s + 1);
  };

  useEffect(() => {
    if (error.message) {
      toast.warn(error.message);
    }
  }, [error.message]);

  return (
    <VtagzIncludesLayout>
      {step === 0 && <SignUp onSuccess={signUp} />}
      {step === 1 && <BrandDetails />}
    </VtagzIncludesLayout>
  );
}
