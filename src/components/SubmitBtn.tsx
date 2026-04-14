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
          <span className="flex items-center justify-center gap-2">
            <span className="loading loading-spinner loading-xs"></span>
            Submitting...
          </span>
        </>
      ) : (
        text
      )}
    </button>
  );
};
