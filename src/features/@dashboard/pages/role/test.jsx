import React from "react";
import ReactDOM from "react-dom";
import { Formik, Form } from "formik";

const Basic = () => (
  <div>
    <h1>Sign Up</h1>
    <Formik
      initialValues={{
        nos: 0,
        length: 0,
        breadth: 0,
        height: 0,
      }}
      onSubmit={async (values) => {
        alert(JSON.stringify(values, null, 2));
      }}
    >
      {({ values, setFieldValue }) => {
        const unCheckAll = () => {
          setFieldValue("height", 0);
          setFieldValue("nos", 0);
          setFieldValue("breadth", 0);
          setFieldValue("length", 0);
        };
        return (
          <Form>
            <pre>{JSON.stringify(values, undefined, 2)}</pre>
            <div>
              <input
                type="checkbox"
                checked={values.nos === 1}
                id="nos"
                name="nos"
                onChange={(e) => {
                  if (e.target.checked) {
                    setFieldValue("nos", 1);
                  } else {
                    unCheckAll();
                  }
                }}
              />
              <label for="nos">Nos</label>
            </div>
            <div>
              <input
                type="checkbox"
                checked={values.length === 1}
                id="length"
                name="length"
                onChange={(e) => {
                  if (e.target.checked) {
                    setFieldValue("nos", 1);
                    setFieldValue("length", 1);
                  } else {
                    unCheckAll();
                  }
                }}
              />
              <label for="length">Length</label>
            </div>
            <div>
              <input
                type="checkbox"
                checked={values.breadth === 1}
                id="breadth"
                name="breadth"
                onChange={(e) => {
                  if (e.target.checked) {
                    setFieldValue("nos", 1);
                    setFieldValue("breadth", 1);
                    setFieldValue("length", 1);
                  } else {
                    unCheckAll();
                  }
                }}
              />
              <label for="breadth">Breadth</label>
            </div>
            <div>
              <input
                type="checkbox"
                checked={values.height === 1}
                id="height"
                name="height"
                onChange={(e) => {
                  if (e.target.checked) {
                    setFieldValue("height", 1);
                    setFieldValue("nos", 1);
                    setFieldValue("breadth", 1);
                    setFieldValue("length", 1);
                  } else {
                    unCheckAll();
                  }
                }}
              />
              <label for="height">Height</label>
            </div>
            <button type="submit">Submit</button>
          </Form>
        );
      }}
    </Formik>
  </div>
);

ReactDOM.render(<Basic />, document.getElementById("root"));
