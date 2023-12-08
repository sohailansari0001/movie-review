import toast from "react-hot-toast";
import { ModalContainer, RatingForm } from "../";
import { updateReview } from "../../api/review";
import { useState } from "react";

const EditRatingModal = ({ visible, onClose, onSuccess, initialState }) => {
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (data) => {
    setBusy(true);
    const { success, message } = await updateReview(initialState.id, data);

    setBusy(false);
    if (!success) {
      return toast.error(message);
    }

    onSuccess({ ...data });
    toast.success(message);
    onClose();
  };

  return (
    <ModalContainer visible={visible} ignoreContainer onClose={onClose}>
      <RatingForm
        busy={busy}
        onSubmit={handleSubmit}
        initialState={initialState}
      />
    </ModalContainer>
  );
};

export default EditRatingModal;
