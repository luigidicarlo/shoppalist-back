import { Document, FilterQuery, Model } from 'mongoose';

interface PaginationArgs<T> {
  page?: number;
  limit?: number;
  Model: Model<T>;
  sort?: any;
  query?: FilterQuery<T>;
}

export const paginate = async <T extends Document>({
  page = 1,
  limit = 10,
  Model,
  sort = {},
  query = {},
}: PaginationArgs<T>) => {
  const totalDocuments = await Model.countDocuments(query);
  let currentPage = page;
  let lastPage = Math.ceil(totalDocuments / limit);

  if (limit <= 0) limit = 10;

  if (lastPage === 0) lastPage = 1;
  if (page > lastPage) currentPage = lastPage;
  if (page < 1) currentPage = 1;

  const documents = await Model.find(query)
    .skip((currentPage - 1) * limit)
    .limit(limit)
    .sort(sort)
    .exec();

  return { documents, currentPage, lastPage };
};
