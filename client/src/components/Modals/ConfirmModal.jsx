import { ImSpinner3 } from "react-icons/im";
import { ModalContainer } from "../";

const ConfirmModal = ({
  visible,
  busy,
  onConfirm,
  onCancel,
  subtitle,
  title,
}) => {
  const commonClass =
    " px-3 py-1 text-white rounded-md hover:bg-opacity-80 transition-all duration-200";

  return (
    <ModalContainer visible={visible} ignoreContainer>
      <div className=" dark:bg-primary bg-white rounded p-4 text-center">
        <h2 className=" text-red-400 font-semibold text-xl ">{title}</h2>
        <p className=" text-secondary dark:text-white text-sm  mt-1">
          {subtitle}
        </p>

        <div className=" flex items-center justify-end space-x-3 mt-4">
          {busy ? (
            <p className=" flex items-center gap-2 text-secondary dark:text-white">
              <ImSpinner3 className=" animate-spin" />
              <span className=" ">Please Wait !</span>
            </p>
          ) : (
            <>
              <button
                type="button"
                className={commonClass + " bg-blue-400"}
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className={commonClass + " bg-red-400"}
                onClick={onConfirm}
              >
                Confirm
              </button>
            </>
          )}
        </div>
      </div>
    </ModalContainer>
  );
};

export default ConfirmModal;
