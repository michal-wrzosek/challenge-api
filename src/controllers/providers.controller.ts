import { Response, Request, NextFunction } from "express";
import Joi from "@hapi/joi";

import Provider from "../models/provider";
import { serializePagination } from "../lib/pagination";
import { US_STATES } from "../types/USStates";
import HttpException from "../exceptions/HttpException";
import { isSet } from "../lib/isSet";

const DEFAULT_PER_PAGE = 10;
const MAX_PER_PAGE = 50;

const getAllQuerySchema = Joi.object().keys({
  page: Joi.number()
    .integer()
    .min(1),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(MAX_PER_PAGE),

  max_discharges: Joi.number()
    .integer()
    .min(0),
  min_discharges: Joi.number()
    .integer()
    .min(0),
  max_average_covered_charges: Joi.number()
    .integer()
    .min(0),
  min_average_covered_charges: Joi.number()
    .integer()
    .min(0),
  max_average_medicare_payments: Joi.number()
    .integer()
    .min(0),
  min_average_medicare_payments: Joi.number()
    .integer()
    .min(0),
  state: Joi.only(Object.keys(US_STATES)),
});

export function getAllValidation(req: Request, res: Response, next: NextFunction) {
  Joi.validate(req.query, getAllQuerySchema, { abortEarly: false }, (err) => {
    if (err) {
      const message = err.details.map((e) => e.message).join(" and ");
      throw new HttpException(400, `Bad Request: ${message}`);
    }

    next();
  });
}

export async function getAll(req: Request, res: Response) {
  const page = req.query.page || 1;
  const limit = req.query.limit || DEFAULT_PER_PAGE;

  const max_discharges = req.query.max_discharges;
  const min_discharges = req.query.min_discharges;
  const max_average_covered_charges = req.query.max_average_covered_charges;
  const min_average_covered_charges = req.query.min_average_covered_charges;
  const max_average_medicare_payments = req.query.max_average_medicare_payments;
  const min_average_medicare_payments = req.query.min_average_medicare_payments;
  const state = req.query.state;

  const conditions_filters = [
    ...(isSet(max_discharges) ? [{ totalDischarges: { $lte: max_discharges } }] : []),
    ...(isSet(min_discharges) ? [{ totalDischarges: { $gte: min_discharges } }] : []),
    ...(isSet(max_average_covered_charges) ? [{ avgCoveredCharges: { $lte: max_average_covered_charges } }] : []),
    ...(isSet(min_average_covered_charges) ? [{ avgCoveredCharges: { $gte: min_average_covered_charges } }] : []),
    ...(isSet(max_average_medicare_payments) ? [{ avgMedicarePayments: { $lte: max_average_medicare_payments } }] : []),
    ...(isSet(min_average_medicare_payments) ? [{ avgMedicarePayments: { $gte: min_average_medicare_payments } }] : []),
    ...(isSet(state) ? [{ state }] : []),
  ];

  const conditions = {
    ...(conditions_filters.length ? { $and: conditions_filters } : {}),
  };

  const results = await Provider.paginate(conditions, { page, limit });

  res.status(200).json({
    data: {
      providers: results.docs.map((provider) => Provider.serialize(provider)),
    },
    pagination: serializePagination(results),
  });
}
