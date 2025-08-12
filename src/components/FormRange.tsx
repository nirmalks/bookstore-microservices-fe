import { useState } from 'react';
import { FormRangeProps } from '../types/form';

const FormRange = ({
  label,
  name,
  size,
  value,
  step,
  maxValue,
  register,
}: FormRangeProps) => {
  const [selectedValue, setSelectedValue] = useState(value || maxValue);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(e.target.value);
  };
  return (
    <div className="form-control">
      <label htmlFor={name} className="label cursor-pointer">
        <span className="label-text capitalize">{label}</span>
        <span>{selectedValue}</span>
      </label>
      <input
        type="range"
        {...register(name, { onChange: handleChange })}
        name={name}
        min={0}
        max={maxValue}
        value={selectedValue}
        onChange={(e) => setSelectedValue(e.target.value)}
        className={`range range-primary ${size}`}
        step={step}
        id={name}
      />
      <div className="w-full flex justify-between text-xs px-2 mt-2">
        <span className="font-bold text-md">0</span>
        <span className="font-bold text-md">Max : {maxValue}</span>
      </div>
    </div>
  );
};
export default FormRange;
