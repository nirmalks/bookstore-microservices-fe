import { useNavigation } from 'react-router';

export const SubmitBtn = ({ text = 'Submit' }) => {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  return (
    <button
      type="submit"
      className="btn btn-primary btn-block"
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <>
          <span className="loading loading-spinner">Submitting...</span>
        </>
      ) : (
        text
      )}
    </button>
  );
};
