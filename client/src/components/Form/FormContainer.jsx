const FormContainer = ({ children }) => {
  return (
    <div className=" inset-0 dark:bg-primary bg-white -z-20 flex justify-center items-center min-h-screen">
      {children}
    </div>
  );
};

export default FormContainer;
