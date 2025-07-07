import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ProjectMetaData {
  title: string;
  facility_id: string;
  budget_cap?: number;
  release_date?: string;
  proposal_due?: string;
  contract_start?: string;
}

interface ProjectMetaFormProps {
  data: ProjectMetaData;
  onDataChange: (data: Partial<ProjectMetaData>) => void;
}

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  facility_id: Yup.string().required('Facility ID is required'),
  budget_cap: Yup.number(),
  release_date: Yup.date(),
  proposal_due: Yup.date(),
  contract_start: Yup.date(),
});

export function ProjectMetaForm({ data, onDataChange }: ProjectMetaFormProps) {
  return (
    <Formik
      initialValues={data}
      validationSchema={validationSchema}
      onSubmit={values => onDataChange(values)}
    >
      {({ errors, touched }) => (
        <Form className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white">
              Title
            </label>
            <Field
              name="title"
              as={Input}
              className={`mt-1 block w-full rounded-md ${errors.title && touched.title ? 'border-red-500' : ''}`}
            />
            {touched.title && errors.title && <div className="text-red-500 text-sm">{errors.title}</div>}
          </div>

          <div>
            <label htmlFor="facility_id" className="block text-sm font-medium text-white">
              Facility ID
            </label>
            <Field
              name="facility_id"
              as={Input}
              className={`mt-1 block w-full rounded-md ${errors.facility_id && touched.facility_id ? 'border-red-500' : ''}`}
            />
            {touched.facility_id && errors.facility_id && <div className="text-red-500 text-sm">{errors.facility_id}</div>}
          </div>

          <div>
            <label htmlFor="budget_cap" className="block text-sm font-medium text-white">
              Budget Cap
            </label>
            <Field
              name="budget_cap"
              type="number"
              as={Input}
              className="mt-1 block w-full rounded-md"
            />
            {touched.budget_cap && errors.budget_cap && <div className="text-red-500 text-sm">{errors.budget_cap}</div>}
          </div>

          <div>
            <label htmlFor="release_date" className="block text-sm font-medium text-white">
              Release Date
            </label>
            <Field
              name="release_date"
              type="date"
              as={Input}
              className="mt-1 block w-full rounded-md"
            />
            {touched.release_date && errors.release_date && <div className="text-red-500 text-sm">{errors.release_date}</div>}
          </div>

          <div>
            <label htmlFor="proposal_due" className="block text-sm font-medium text-white">
              Proposal Due
            </label>
            <Field
              name="proposal_due"
              type="date"
              as={Input}
              className="mt-1 block w-full rounded-md"
            />
            {touched.proposal_due && errors.proposal_due && <div className="text-red-500 text-sm">{errors.proposal_due}</div>}
          </div>

          <div>
            <label htmlFor="contract_start" className="block text-sm font-medium text-white">
              Contract Start
            </label>
            <Field
              name="contract_start"
              type="date"
              as={Input}
              className="mt-1 block w-full rounded-md"
            />
            {touched.contract_start && errors.contract_start && <div className="text-red-500 text-sm">{errors.contract_start}</div>}
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="mt-4">
              Save
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
