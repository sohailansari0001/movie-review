import { useParams } from "react-router-dom";
import { ModalContainer, RatingForm } from "../";
import { addReview } from "../../api/review";
import toast from "react-hot-toast";

const AddRatingModal = ({ visible, onClose, onSuccess }) => {
  const { movieId } = useParams();

  const handleSubmit = async (data) => {
    const { success, message, reviews } = await addReview(movieId, data);

    if (!success) {
      return toast.error(message);
    }

    toast.success(message);
    onSuccess(reviews);
    onClose();
  };

  return (
    <ModalContainer visible={visible} ignoreContainer onClose={onClose}>
      <RatingForm onSubmit={handleSubmit} />
    </ModalContainer>
  );
};

export default AddRatingModal;
