import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFaqMessage } from '@/features/sms/slice';

export default function Faq() {
  const dispatch = useDispatch();
  const { faqMessage } = useSelector(({ sms }) => sms.form);

  return (
    <>
      <h3 className='section-heading'>FAQ message</h3>
      <p className='details'>
        Automatically sent to subscribers when they send ‘FAQ’ to your campaign
        phone number. Best practices include referencing the eligible product(s)
        and participating retailers.
      </p>
      <p className='details example'>Example:</p>
      <p className='details'>
        1 - How do I receive my rebate?
        <br />
        - Purchase 2 (or more!) products from any of our participating
        eco-friendly brands at your local health-focused grocery store (you'll
        get the second item free!)
        <br />- Text SUBMIT + a pic of your receipt to this #
      </p>
      <p className='details'>
        2 - What do I get cash back on?
        <br />- You'll get a cash rebate for the full value of the 2nd item you
        purchase from each participating brand - of lesser or equal value -
        effectively a buy one get one free!
      </p>
      <p className='details'>
        3 - How will I receive my cash rebate?
        <br />- After receipt submission, your receipt will be validated. Once
        approved, we will request your preferred digital wallet info for payout!
      </p>
      <textarea
        onChange={(e) => dispatch(setFaqMessage(e.target.value))}
        placeholder='Enter your FAQ response'
        rows='4'
        value={faqMessage}
      />
    </>
  );
}
