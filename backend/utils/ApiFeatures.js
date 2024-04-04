class ApiFeatures {
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }

  search() {
    const { search } = this.queryObj;

    if (!search) {
      return this;
    }

    const filters = {
      $or: [
        { title: { $regex: search, $options: 'i' } }, // Case-insensitive regex match for title
        { description: { $regex: search, $options: 'i' } } // Case-insensitive regex match for description
      ]
    };

    // Check if search input is a valid number
    if (!isNaN(parseFloat(search))) {
      filters.$or.push({ price: parseFloat(search) });
    }

    this.query = this.query.find(filters);
    return this;
  }

  month() {
    const { month } = this.queryObj;

    if (month) {
      this.query = this.query.find({
        $expr: {
          $eq: [{ $month: '$dateOfSale' }, Number(month)] // Match the month
        }
      });
    }

    return this;
  }

  paginate() {
    const page = this.queryObj.page || 1;
    const limit = this.queryObj.perPage || 10;
    const skip = (page - 1) * 10;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
