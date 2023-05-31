import React, { Fragment, useEffect, useState } from "react";
import formData from "./data.json";

export default () => (
  <>
    <h1>Welcome to React Parcel Micro App!</h1>
    <p>Hard to get more minimal than this React app.</p>

    <Form formData={formData} />
  </>
);

const Form = ({ formData }) => {
  const [page, setPage] = useState(0);
  const [currentPageData, setCurrentPageData] = useState(formData[page]);
  const [values, setValues] = useState({});

  useEffect(() => {
    const upcomingPageData = formData[page];
    setCurrentPageData(upcomingPageData);
    setValues((currentValues) => {
      const newValues = upcomingPageData.fields.reduce((obj, field) => {
        if (field.component === "field_group") {
          for (const subField of field.fields) {
            obj[subField._uid] = "";
          }
        } else {
          obj[field._uid] = "";
        }

        return obj;
      }, {});

      return { ...newValues, ...currentValues };
    });
  }, [page, formData]);

  const naivgatePages = (direction) => () => {
    const findNextPage = (page) => {
      const upcomingPageData = formData[page];

      if (upcomingPageData.conditional?.field) {
        const segments = upcomingPageData.conditional.field.split("_");
        const fieldId = segments[segments.length - 1];

        const fieldToMatchValue = values[fieldId];

        if (fieldToMatchValue !== upcomingPageData.conditional.value) {
          return findNextPage(direction === "next" ? page + 1 : page - 1);
        }
      }
      return page;
    };

    setPage(findNextPage(direction === "next" ? page + 1 : page - 1));
  };

  const nextPage = naivgatePages("next");
  const prevPage = naivgatePages("prev");

  const fieldChanged = (fieldId, value) => {
    setValues((currentValues) => {
      currentValues[fieldId] = value;
      return currentValues;
    });

    setCurrentPageData((currentPageData) => ({ ...currentPageData }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>{currentPageData.label}</h2>
      {currentPageData.fields
        .filter(fieldMeetsCondition(values))
        .map((field) => {
          switch (field.component) {
            case "field_group":
              return (
                <FieldGroup
                  key={field._uid}
                  field={field}
                  fieldChanged={fieldChanged}
                  values={values}
                />
              );
            case "options":
              return (
                <Option
                  key={field._uid}
                  field={field}
                  fieldChanged={fieldChanged}
                  value={values[field._uid]}
                />
              );
            default:
              return (
                <Field
                  key={field._uid}
                  field={field}
                  fieldChanged={fieldChanged}
                  value={values[field._uid]}
                />
              );
          }
        })}
      {page > 0 && <button onClick={prevPage}>Back</button>}
      &nbsp;
      {page < formData.length - 1 && <button onClick={nextPage}>Next</button>}
    </form>
  );
};

const Field = ({ field, fieldChanged, type, value }) => (
  <div key={field._uid}>
    <label htmlFor={field._uid}>{field.label}</label>
    <input
      type={type || field.component}
      id={field._uid}
      name={field._uid}
      value={value}
      onChange={(e) => fieldChanged(field._uid, e.target.value)}
    />
  </div>
);

const FieldGroup = ({ field, fieldChanged, values }) => (
  <fieldset>
    <h3>{field.label}</h3>
    {field.fields.map((field) => (
      <Field
        key={field._uid}
        field={field}
        fieldChanged={fieldChanged}
        value={values[field._uid]}
      />
    ))}
  </fieldset>
);

const Option = ({ field, fieldChanged, value }) => (
  <div>
    <h3>{field.label}</h3>
    {field.options.map((option, index) => (
      <Fragment key={option.value}>
        <label htmlFor={option.value}>
          <input
            type="radio"
            id={option.value}
            name={field._uid}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => {
              fieldChanged(field._uid, e.target.value);
            }}
          />
          {option.label}
        </label>
        {index < field.options.length - 1 && <br />}
      </Fragment>
    ))}
  </div>
);

const fieldMeetsCondition = (values) => (field) => {
  if (field.conditional && field.conditional.field) {
    const segments = field.conditional.field.split("_");
    const fieldId = segments[segments.length - 1];
    return values[fieldId] === field.conditional.value;
  }
  return true;
};
