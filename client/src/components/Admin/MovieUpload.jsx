import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import toast from "react-hot-toast";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { uploadMovie, uploadTrailer } from "../../api/movie";

// components
import { ModalContainer, MovieForm, UploadProgress } from "../";

const MovieUpload = ({ visible, onClose }) => {
  // state
  const [videoSelected, setVideoSelected] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoInfo, setVideoInfo] = useState({});
  const [busy, setBusy] = useState(false);

  const resetState = () => {
    setVideoSelected(false);
    setVideoUploaded(false);
    setUploadProgress(0);
    setVideoInfo({});
  };
  // handling trailer upload
  const handleUploadTrailer = async (formData) => {
    const { success, message, response } = await uploadTrailer(
      formData,
      setUploadProgress
    );

    if (!success) {
      return toast.error(message);
    }

    const { url, public_id } = response;

    setVideoUploaded(true);
    setVideoInfo({ url, public_id });
    toast.success(message);
  };

  // handling error if file is of another type
  const handleTypeError = (error) => {
    toast.error(error);
  };

  // handling change function for video
  const handleChange = (file) => {
    const formData = new FormData();
    formData.append("video", file);

    setVideoSelected(true);
    handleUploadTrailer(formData);
  };

  // function for finding the progress of trailer upload
  const getUploadProgressValue = () => {
    if (!videoUploaded && uploadProgress >= 100) {
      return "Processing";
    }
    return `Upload progress ${uploadProgress}`;
  };

  const handleSubmit = async (data) => {
    if (!videoInfo.url || !videoInfo.public_id) {
      return toast.error("Trailer is Missing!");
    }

    setBusy(true);

    data.append("trailer", JSON.stringify(videoInfo));

    const { success, message } = await uploadMovie(data);

    setBusy(false);
    if (!success) {
      return toast.error(message);
    }

    toast.success(message);
    resetState();
    onClose();
  };

  return (
    <ModalContainer visible={visible}>
      {/* Upload progress */}
      <div className="mb-4">
        <UploadProgress
          width={uploadProgress}
          visible={!videoUploaded && videoSelected}
          message={getUploadProgressValue()}
        />
      </div>

      {!videoSelected ? (
        <TrailerSelector
          visible={!videoSelected}
          handleChange={handleChange}
          OnTypeError={handleTypeError}
        />
      ) : (
        <MovieForm
          busy={busy}
          onSubmit={!busy ? handleSubmit : null}
          btnTitle={"Upload"}
        />
      )}
    </ModalContainer>
  );
};

const TrailerSelector = ({ visible, handleChange, OnTypeError }) => {
  if (!visible) {
    return null;
  }

  return (
    <div className="flex items-center justify-center h-full">
      <FileUploader
        handleChange={handleChange}
        name="file"
        types={["mp4", "avi", "mkv"]}
        onTypeError={OnTypeError}
      >
        <div className=" w-48 h-48 border border-dashed dark:border-dark-subtle border-light-subtle rounded-full flex flex-col text-secondary dark:text-dark-subtle justify-center items-center cursor-pointer">
          <AiOutlineCloudUpload size={80} />
          <p className="">Drop your file here</p>
        </div>
      </FileUploader>
    </div>
  );
};

export default MovieUpload;
