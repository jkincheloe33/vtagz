import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setReward } from '@/features/variant/slice';
import rewardHelper from '@/features/variant/helpers/reward';

export default function useSharedRewardHandlers(rewardType) {
  const dispatch = useDispatch();
  const reward = useSelector((store) => store.variant.form.reward);

  const handleTypeChange = (e) =>
    dispatch(
      setReward({
        options: { ...reward.options, type: e.target.value },
      })
    );

  const handleFileChange = (file) => {
    rewardHelper
      .parseCodesFile(rewardType, file)
      .then((codes) => {
        dispatch(
          setReward({
            options: {
              ...reward.options,
              code: null,
              codes: codes,
            },
          })
        );
      })
      .catch((e) => {
        toast.warn(e);
      });
  };

  const handleFileRemove = () =>
    dispatch(
      setReward({
        options: {
          ...reward.options,
          code: null,
          codes: null,
        },
      })
    );

  const handleCodeChange = (e) =>
    dispatch(
      setReward({
        options: {
          ...reward.options,
          code: e.target.value,
          codes: null,
        },
      })
    );

  return {
    handleFileChange,
    handleFileRemove,
    handleTypeChange,
    handleCodeChange,
  };
}
