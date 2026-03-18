import { useState } from "react";

export default function useInput(initialValue, validationFn = null) {
  const [value, setValue] = useState(initialValue);
  const [isTouched, setIsTouched] = useState(false);

  const error = validationFn && isTouched ? validationFn(value) : null;

  const handleChange = (e) => {
    setValue(e.target.value);
    setIsTouched(false);
  };

  const handleBlur = () => {
    setIsTouched(true);
  };

  return {
    value,
    handleChange,
    handleBlur,
    error,
  };
}
