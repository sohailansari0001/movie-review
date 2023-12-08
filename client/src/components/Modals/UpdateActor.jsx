import { useState } from "react";
import toast from "react-hot-toast";

import { updateActor } from "../../api/actor";

// components
import { ActorForm, ModalContainer } from "../";

const UpdateActor = ({ visible, onClose, initialState, onSuccess }) => {
  const [busy, setBusy] = useState(false);

  //
  const handleSubmit = async (data) => {
    setBusy(true);

    const { success, message, actor } = await updateActor(
      initialState.id,
      data
    );

    setBusy(false);
    if (!success) {
      return toast.error(message);
    }
    onSuccess(actor);
    toast.success(message);
    onClose();
  };
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <ActorForm
        title={"Update Actor"}
        btnTitle={"Update"}
        onSubmit={!busy ? handleSubmit : null}
        busy={busy}
        initialState={initialState}
      />
    </ModalContainer>
  );
};

export default UpdateActor;
