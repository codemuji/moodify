const FormGroup = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  autoComplete,
}) => {
  const fieldId = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="form-group">
      <label htmlFor={fieldId}>{label}</label>
      <input
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        type={type}
        id={fieldId}
        placeholder={placeholder}
        required
      />
    </div>
  );
};

export default FormGroup;
