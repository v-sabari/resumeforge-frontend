import { useState } from 'react';

export const useForm = (initialState) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const setValue = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleChange,
    setValue,
  };
};
