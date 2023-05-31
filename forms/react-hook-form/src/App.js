import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  example: yup.string().required(),
  number: yup.number().nullable()
});

export default () => {
  const { register, handleSubmit, errors } = useForm({
    validationSchema
  });
  const onSubmit = data => {
    console.log(data);
  };
  return (
    <>
      <h1>Welcome to React Parcel Micro App!</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Example:
          <br />
          <input name="example" defaultValue="test" ref={register} />
        </label>
        <br />
        <label>
          Number:
          <br />
          <input name="number" type="number" ref={register} />
        </label>
        {errors && console.log(errors) && <></>}
        <br />
        <input type="submit" />
      </form>
      <ChitChat />
    </>
  );
};

const ChitChat = () => (
  <div className="max-w-sm flex p-6">
    <div className="flex-shrink-0">
      <img alt="logo"></img>
    </div>
    <div>
      <h4>Chit chat</h4>
      <p>Messages</p>
    </div>
  </div>
);
