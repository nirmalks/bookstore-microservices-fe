import { FieldValues, Path } from 'react-hook-form';
import { FormInputProps } from '../types/form';

const FormInput = <T extends FieldValues>({
  label,
  name,
  type,
  defaultValue = '',
  placeholder = '',
  size = 'w-full max-w-xs',
  register,
  validationSchema,
  error,
}: FormInputProps<T>) => {
  return (
    <div className="form-control">
      <label htmlFor={name} className="label">
        {label}
      </label>
      <input
        {...register(name as Path<T>, validationSchema)}
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        id={name}
        className={`input input-bordered input-primary ${size}`}
      />
      {error && <p className="text-error text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default FormInput;
