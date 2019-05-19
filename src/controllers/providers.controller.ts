import { Response, Request } from "express";

import Provider from "../models/provider";
import { serializePagination } from "../lib/pagination";

const DEFAULT_PER_PAGE = 10;
const MAX_PER_PAGE = 50;

export function getAll(req: Request, res: Response) {
  const page = Math.max(req.body.page || 1, 1);
  const limit = Math.max(
    Math.min(req.body.page || DEFAULT_PER_PAGE, MAX_PER_PAGE),
    1
  );

  Provider.paginate({}, { page, limit }).then((results) => {
    res.status(200).json({
      data: {
        providers: results.docs.map((provider) => Provider.serialize(provider)),
      },
      pagination: serializePagination(results),
    });
  });
}
