import { Injectable } from '@nestjs/common';

@Injectable()
export class SharedService {
  async advancedResults(requestQuery, model: any, populate?) {
    let query;

    const reqQuery = { ...requestQuery };
    //fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    //loop over removeFields and delete them from req.query
    removeFields.forEach((param) => delete reqQuery[param]);

    //create query string
    let queryStr = JSON.stringify(reqQuery);

    //create operators ($gt, $lt etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`,
    );
    query = model.find(JSON.parse(queryStr));

    const totalCount = await model.find(JSON.parse(queryStr)).countDocuments();
    //select fields
    if (requestQuery.select) {
      const fields = requestQuery.select.split(',').join(' ');
      query.select(fields);
    }
    //sort
    if (requestQuery.sort) {
      const sortBy = requestQuery.sort.split(',').join(' ');
      query.sort(sortBy);
    } else {
      query.sort('-createdAt');
    }

    //Pagination
    const page = parseInt(requestQuery.page, 10) || 1;
    const limit = parseInt(requestQuery.limit, 10) || 100;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    query.skip(startIndex).limit(limit);

    if (populate) {
      query.populate(populate);
    }

    //Execute Query
    const results = await query;

    //Pagination Result
    const pagination: any = {};

    if (endIndex < totalCount) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }
    return {
      totalCount,
      currentPage: page,
      limit,
      success: true,
      count: results.length,
      pagination,
      data: results,
    };
  }
}
