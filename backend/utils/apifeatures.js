class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    
    // Remove some fields for category/price filters
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Filter for Price and Rating
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    
    let filterObj = JSON.parse(queryStr);

    // 🌟 THE FIX: If there's an empty category string (""), delete it so it doesn't search for blank items
    if (filterObj.category === "") {
      delete filterObj.category;
    }

    // 🌟 THE FIX: Convert strings like "0" and "250000" into actual numeric values for MongoDB
    if (filterObj.price) {
      if (filterObj.price.$gte) filterObj.price.$gte = Number(filterObj.price.$gte);
      if (filterObj.price.$lte) filterObj.price.$lte = Number(filterObj.price.$lte);
    }
    
    if (filterObj.ratings) {
      if (filterObj.ratings.$gte) filterObj.ratings.$gte = Number(filterObj.ratings.$gte);
    }

    this.query = this.query.find(filterObj);
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;