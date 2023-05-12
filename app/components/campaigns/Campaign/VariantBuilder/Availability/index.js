import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import SectionHeader from '@/components/SectionHeader';
import Switch from '@/components/Switch';
import { setAvailability } from '@/features/variant/slice';
import { dateFormat } from '@/utils';
import CalendarIcon from '@/static/assets/calendar-icon.svg';
import { timeToAMPM } from '@/utils';
import 'react-datepicker/dist/react-datepicker.css';
import './availability.styl';

export default function Availability() {
  const availability = useSelector((store) => store.variant.form.availability);
  const dispatch = useDispatch();

  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  return (
    <div id='availability' className='section'>
      <SectionHeader title='Availability' />
      <Switch
        label='Set an expiry date for this reward'
        status={Boolean(availability?.visible)}
        onChange={() =>
          dispatch(
            setAvailability({
              visible: !availability?.visible,
              expiresAt: null,
            })
          )
        }
      />
      {availability?.visible && (
        <>
          <hr />
          <DatePicker
            id='date-picker'
            className='date-picker-input'
            showTimeSelect
            dateFormat={dateFormat}
            autoComplete='off'
            minDate={new Date()}
            filterTime={filterPassedTime}
            selected={availability?.expiresAt}
            onChange={(date) =>
              dispatch(setAvailability({ visible: true, expiresAt: date }))
            }
          />
          <label className='date-picker' htmlFor='date-picker'>
            <div>
              <img src={CalendarIcon} alt='' />
              <div>
                <p className='caption-2-medium'>Expiry date</p>
                <p className='base-1-semibold'>
                  {availability?.expiresAt
                    ? `${availability.expiresAt.toLocaleDateString()} ${timeToAMPM(
                        availability.expiresAt
                      )}`
                    : 'Select a date'}
                </p>
              </div>
            </div>
          </label>
        </>
      )}
    </div>
  );
}
