
import { z } from 'zod';

export const GetOverdueRfisSchema = z.object({
  project_id: z.string().uuid().optional(),
  days_overdue: z.number().min(0).default(0),
});

export const CreateRfiSchema = z.object({
  project_id: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  submitted_by: z.string().max(255).optional(),
  assigned_to: z.string().max(255).optional(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // YYYY-MM-DD format
});

export const ProcurementSummarySchema = z.object({
  project_id: z.string().uuid().optional(),
});

export const PortfolioHealthSchema = z.object({});

export const RiskAdvisorySchema = z.object({
  project_id: z.string().uuid(),
});

export const NextActionSchema = z.object({
  project_id: z.string().uuid(),
});

export const SustainabilityOverviewSchema = z.object({
  project_id: z.string().uuid(),
});
