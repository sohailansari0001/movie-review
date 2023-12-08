const FormInput = ({ name, placeholder, label, ...rest }) => {
  return (
    <div className=" flex flex-col-reverse gap-1">
      <input
        id={name}
        name={name}
        className="bg-transparent rounded border-2 dark:border-dark-subtle border-light-subtle dark:focus:border-white focus:border-primary py-2 px-4 w-full outline-none text-lg peer transition-all duration-100 dark:text-white"
        placeholder={placeholder}
        {...rest}
      />
      <label
        htmlFor="email"
        className=" font-semibold dark:text-dark-subtle text-light-subtle  dark:peer-focus:text-white peer-focus:text-primary transition-all duration-100 w-max"
      >
        {label}
      </label>
    </div>
  );
};

export default FormInput;
