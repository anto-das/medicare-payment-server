type IOptions = {
  page?: number | string;
  limit?: number | string;
};

type IOptionsResult = {
  page: number;
  limit: number;
  skip: number;
  
};

function paginationSorting(options: IOptions): IOptionsResult {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip = Number(page - 1) * limit;
  return {
      page,
      limit,
      skip,
  }
}

export default paginationSorting;
