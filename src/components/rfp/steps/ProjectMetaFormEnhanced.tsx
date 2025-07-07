import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import DateInput from '@/components/DateInput';
import { 
  Building, 
  DollarSign, 
  Calendar, 
  MapPin, 
  FileText,
  AlertCircle,
  CheckCircle,
  Info,
  Calculator
} from 'lucide-react';
import type { RfpWizardData } from '../RfpWizardEnhanced';

interface ProjectMetaFormEnhancedProps {
  data: RfpWizardData;
  onDataChange: (data: Partial<RfpWizardData>) => void;
  errors?: string[];
}

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Project title is required')
    .min(10, 'Title must be at least 10 characters')
    .max(100, 'Title must be less than 100 characters'),
  facility_id: Yup.string()
    .required('Facility ID is required')
    .matches(/^[A-Z0-9-]+$/, 'Facility ID must contain only uppercase letters, numbers, and hyphens'),
  project_type: Yup.string().required('Project type is required'),
  budget_cap: Yup.number()
    .positive('Budget must be positive')
    .max(100000000, 'Budget cannot exceed $100M'),
  project_size_sqft: Yup.number()
    .positive('Project size must be positive')
    .max(10000000, 'Project size cannot exceed 10M sq ft'),
  release_date: Yup.date()
    .min(new Date(), 'Release date cannot be in the past'),
  proposal_due: Yup.date()
    .min(Yup.ref('release_date'), 'Proposal due date must be after release date'),
  contract_start: Yup.date()
    .min(Yup.ref('proposal_due'), 'Contract start date must be after proposal due date'),
});

const PROJECT_TYPES = [
  { value: 'new_construction', label: 'New Construction', icon: Building },
  { value: 'renovation', label: 'Renovation', icon: Building },
  { value: 'maintenance', label: 'Maintenance', icon: Building },
  { value: 'tenant_improvement', label: 'Tenant Improvement', icon: Building },
  { value: 'infrastructure', label: 'Infrastructure', icon: MapPin },
  { value: 'demolition', label: 'Demolition', icon: Building },
];

export function ProjectMetaFormEnhanced({ data, onDataChange, errors = [] }: ProjectMetaFormEnhancedProps) {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (values: any) => {
    onDataChange(values);
  };

  const formatCurrency = (value: number | undefined) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatSquareFeet = (value: number | undefined) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-US').format(value) + ' sq ft';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Formik
        initialValues={data}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors: formErrors, touched, values, setFieldValue }) => (
          <Form className="space-y-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Project Information</h2>
              <p className="text-muted-foreground">
                Define the core details of your RFP project. This information will be used throughout the document.
              </p>
            </div>

            {/* Form Errors */}
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </AlertDescription>
              </Alert>
            )}

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Project Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Project Title *
                  </Label>
                  <Field
                    name="title"
                    as={Input}
                    placeholder="e.g., Hospital East Wing Renovation Phase 2"
                    className={`transition-all duration-200 ${
                      formErrors.title && touched.title ? 'border-red-500' : ''
                    } ${focusedField === 'title' ? 'ring-2 ring-primary/20' : ''}`}
                    onFocus={() => setFocusedField('title')}
                    onBlur={() => setFocusedField(null)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue('title', e.target.value);
                      onDataChange({ title: e.target.value });
                    }}
                  />
                  {touched.title && formErrors.title && (
                    <p className="text-red-500 text-sm">{formErrors.title}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    A clear, descriptive title for your RFP project
                  </p>
                </div>

                {/* Facility ID and Project Type Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="facility_id" className="text-sm font-medium">
                      Facility ID *
                    </Label>
                    <Field
                      name="facility_id"
                      as={Input}
                      placeholder="e.g., NYC-HOSP-001"
                      className={`transition-all duration-200 ${
                        formErrors.facility_id && touched.facility_id ? 'border-red-500' : ''
                      } ${focusedField === 'facility_id' ? 'ring-2 ring-primary/20' : ''}`}
                      onFocus={() => setFocusedField('facility_id')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value.toUpperCase();
                        setFieldValue('facility_id', value);
                        onDataChange({ facility_id: value });
                      }}
                    />
                    {touched.facility_id && formErrors.facility_id && (
                      <p className="text-red-500 text-sm">{formErrors.facility_id}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project_type" className="text-sm font-medium">
                      Project Type *
                    </Label>
                    <Select
                      value={values.project_type}
                      onValueChange={(value) => {
                        setFieldValue('project_type', value);
                        onDataChange({ project_type: value });
                      }}
                    >
                      <SelectTrigger className={`transition-all duration-200 ${
                        formErrors.project_type && touched.project_type ? 'border-red-500' : ''
                      }`}>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROJECT_TYPES.map((type) => {
                          const IconComponent = type.icon;
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-4 h-4" />
                                {type.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {touched.project_type && formErrors.project_type && (
                      <p className="text-red-500 text-sm">{formErrors.project_type}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Scale */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Project Scale
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="budget_cap" className="text-sm font-medium">
                      Budget Cap
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Field
                        name="budget_cap"
                        type="number"
                        as={Input}
                        placeholder="5000000"
                        className={`pl-10 transition-all duration-200 ${
                          formErrors.budget_cap && touched.budget_cap ? 'border-red-500' : ''
                        } ${focusedField === 'budget_cap' ? 'ring-2 ring-primary/20' : ''}`}
                        onFocus={() => setFocusedField('budget_cap')}
                        onBlur={() => setFocusedField(null)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = e.target.value ? parseInt(e.target.value) : undefined;
                          setFieldValue('budget_cap', value);
                          onDataChange({ budget_cap: value });
                        }}
                      />
                    </div>
                    {values.budget_cap && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {formatCurrency(values.budget_cap)}
                        </Badge>
                      </div>
                    )}
                    {touched.budget_cap && formErrors.budget_cap && (
                      <p className="text-red-500 text-sm">{formErrors.budget_cap}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project_size_sqft" className="text-sm font-medium">
                      Project Size (sq ft)
                    </Label>
                    <Field
                      name="project_size_sqft"
                      type="number"
                      as={Input}
                      placeholder="50000"
                      className={`transition-all duration-200 ${
                        formErrors.project_size_sqft && touched.project_size_sqft ? 'border-red-500' : ''
                      } ${focusedField === 'project_size_sqft' ? 'ring-2 ring-primary/20' : ''}`}
                      onFocus={() => setFocusedField('project_size_sqft')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const value = e.target.value ? parseInt(e.target.value) : undefined;
                        setFieldValue('project_size_sqft', value);
                        onDataChange({ project_size_sqft: value });
                      }}
                    />
                    {values.project_size_sqft && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {formatSquareFeet(values.project_size_sqft)}
                        </Badge>
                      </div>
                    )}
                    {touched.project_size_sqft && formErrors.project_size_sqft && (
                      <p className="text-red-500 text-sm">{formErrors.project_size_sqft}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="release_date" className="text-sm font-medium">
                      RFP Release Date
                    </Label>
<DateInput
                      value={values.release_date}
                      onChange={(date) => {
                        setFieldValue('release_date', date?.toISOString().split('T')[0] || '');
                        onDataChange({ release_date: date?.toISOString().split('T')[0] || '' });
                      }}
                      placeholder="Select release date"
                      className={`transition-all duration-200 ${
                        formErrors.release_date && touched.release_date ? 'border-red-500' : ''
                      } ${focusedField === 'release_date' ? 'ring-2 ring-primary/20' : ''}`}
                      onFocus={() => setFocusedField('release_date')}
                      onBlur={() => setFocusedField(null)}
                    />
                    {touched.release_date && formErrors.release_date && (
                      <p className="text-red-500 text-sm">{formErrors.release_date}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="proposal_due" className="text-sm font-medium">
                      Proposal Due Date
                    </Label>
<DateInput
                      value={values.proposal_due}
                      onChange={(date) => {
                        setFieldValue('proposal_due', date?.toISOString().split('T')[0] || '');
                        onDataChange({ proposal_due: date?.toISOString().split('T')[0] || '' });
                      }}
                      placeholder="Select proposal due date"
                      className={`transition-all duration-200 ${
                        formErrors.proposal_due && touched.proposal_due ? 'border-red-500' : ''
                      } ${focusedField === 'proposal_due' ? 'ring-2 ring-primary/20' : ''}`}
                      onFocus={() => setFocusedField('proposal_due')}
                      onBlur={() => setFocusedField(null)}
                    />
                    {touched.proposal_due && formErrors.proposal_due && (
                      <p className="text-red-500 text-sm">{formErrors.proposal_due}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contract_start" className="text-sm font-medium">
                      Contract Start Date
                    </Label>
<DateInput
                      value={values.contract_start}
                      onChange={(date) => {
                        setFieldValue('contract_start', date?.toISOString().split('T')[0] || '');
                        onDataChange({ contract_start: date?.toISOString().split('T')[0] || '' });
                      }}
                      placeholder="Select contract start date"
                      className={`transition-all duration-200 ${
                        formErrors.contract_start && touched.contract_start ? 'border-red-500' : ''
                      } ${focusedField === 'contract_start' ? 'ring-2 ring-primary/20' : ''}`}
                      onFocus={() => setFocusedField('contract_start')}
                      onBlur={() => setFocusedField(null)}
                    />
                    {touched.contract_start && formErrors.contract_start && (
                      <p className="text-red-500 text-sm">{formErrors.contract_start}</p>
                    )}
                  </div>
                </div>

                {/* Timeline Info */}
                {values.release_date && values.proposal_due && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Bidders will have{' '}
                      {Math.ceil(
                        (new Date(values.proposal_due).getTime() - new Date(values.release_date).getTime()) /
                        (1000 * 60 * 60 * 24)
                      )}{' '}
                      days to prepare their proposals.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Validation Summary */}
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {Object.keys(formErrors).length === 0 ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-600 font-medium">All fields are valid</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <span className="text-yellow-600 font-medium">
                          {Object.keys(formErrors).length} field(s) need attention
                        </span>
                      </>
                    )}
                  </div>
                  <Badge variant="outline">
                    Step 1 of 7
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Form>
        )}
      </Formik>
    </motion.div>
  );
}
