import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOnboardingMessage } from '@/features/sms/slice';

export default function Onboarding() {
  const dispatch = useDispatch();
  const { onboardingMessage } = useSelector(({ sms }) => sms.form);

  return (
    <>
      <p id='opening-message'>
        Send automated messages to your SMS subscribers to welcome them to your
        campaign and keep them informed throughout the rebate journey.
      </p>
      <h3 className='section-heading'>Onboarding message</h3>
      <p className='details'>
        Automatically sent to new subscribers when they join your campaign. Best
        practices include referencing the rebate value, eligible product(s) and
        participating retailers.
      </p>
      <p className='details'>
        An automated message will be sent to the subscriber by VTAGZ after your
        onboarding message outlining how the user can submit their receipt and
        claim their rebate.
      </p>
      <p className='details example'>Example:</p>
      <p className='details'>
        Get a $5.79 cash-back when you purchase 2 bags of our eco-friendly
        veggie chips + be entered to win a FREE variety pack! 🌎
      </p>
      <p className='details'>
        Visit your nearest health-focused grocery store & buy 2 bags of our
        veggie chips in any flavor. ✨
      </p>
      <textarea
        onChange={(e) => dispatch(setOnboardingMessage(e.target.value))}
        placeholder='Enter your onboarding message'
        rows='4'
        value={onboardingMessage}
      />
    </>
  );
}
