const Selector = ({ name, value, label, onChange, options }) => {
  return (
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className=" border-2 dark:border-dark-subtle py-1 px-2 dark:focus:border-white focus:border-primary outline-none transtion rounded bg-transparent text-light-subtle dark:text-dark-subtle dark:focus:text-white focus:text-primary w-full text-center "
    >
      <option
        value=""
        className="dark:text-dark-subtle text-light-subtle dark:bg-primary outline-none"
      >
        {label}
      </option>
      {options.map(({ title, value }) => {
        return (
          <option
            className="dark:text-dark-subtle text-light-subtle dark:bg-primary outline-none"
            value={value}
            key={value}
          >
            {title}
          </option>
        );
      })}
    </select>
  );
};

export default Selector;
