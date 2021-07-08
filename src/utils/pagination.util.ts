import { Document, Model } from 'mongoose';

export const paginate = async <T extends Document>(
  page = 1,
  defaultLimit = 10,
  Model: Model<T>,
  sort: any = {},
  query: any = {},
) => {
  const totalDocuments = await Model.countDocuments(query);
  let currentPage = page;
  let lastPage = Math.ceil(totalDocuments / defaultLimit);

  if (defaultLimit <= 0) defaultLimit = 10;

  if (lastPage === 0) lastPage = 1;
  if (page > lastPage) currentPage = lastPage;
  if (page < 1) currentPage = 1;

  const documents = await Model.find(query)
    .skip((currentPage - 1) * defaultLimit)
    .limit(defaultLimit)
    .sort(sort)
    .exec();

  return { documents, currentPage, lastPage };
};
