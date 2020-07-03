import { useState } from "react";

function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  return [
    values,
    (event) => {
      setValues({ ...values, [event.target.id]: event.target.value });
    },
  ];
}

export default useForm;
