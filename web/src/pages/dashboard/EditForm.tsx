import React from 'react'
import { Formik, Form, Field } from 'formik'
import { TextField, Button } from '@mui/material'
import * as Yup from 'yup'

const EditForm = ({ row, onSave }) => {
  const validationSchema = Yup.object({
    date: Yup.string().required('Required'),
    revenue: Yup.number().required('Required'),
    expenses: Yup.number().required('Required'),
    profit: Yup.number().required('Required'),
  })

  return (
    <Formik
      initialValues={row}
      validationSchema={validationSchema}
      onSubmit={(values) => onSave(values)}
    >
      {({ errors, touched }) => (
        <Form style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
          <Field
            name="date"
            type="date"
            label="Date"
            as={TextField}
            error={touched.date && !!errors.date}
            helperText={touched.date && errors.date}
            fullWidth
            margin="normal"
          />
          <Field
            name="revenue"
            label="Revenue"
            type="number"
            as={TextField}
            error={touched.revenue && !!errors.revenue}
            helperText={touched.revenue && errors.revenue}
            fullWidth
            margin="normal"
          />
          <Field
            name="expenses"
            label="Expenses"
            type="number"
            as={TextField}
            error={touched.expenses && !!errors.expenses}
            helperText={touched.expenses && errors.expenses}
            fullWidth
            margin="normal"
          />
          <Field
            name="profit"
            label="Profit"
            type="number"
            as={TextField}
            error={touched.profit && !!errors.profit}
            helperText={touched.profit && errors.profit}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
            Save
          </Button>
        </Form>
      )}
    </Formik>
  )
}

export default EditForm