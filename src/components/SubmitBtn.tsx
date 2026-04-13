type SubmitBtnProps = {
  text: string,
  isSubmitting: boolean
}
export const SubmitBtn = ({ text = 'Submit', isSubmitting = false }: SubmitBtnProps) => {

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
