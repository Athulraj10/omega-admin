const { User } = require("../../models/user");
const Product = require("../../models/product");
const Response = require("../../services/Response");
const { ROLES } = require("../../services/Constants");

const SUCCESS = 200;
const FAIL = 400;
const INTERNAL_SERVER = 500;

const getSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: ROLES.SELLER.name }).sort({ createdAt: -1 });
    return Response.successResponseData(res, sellers, SUCCESS, "Seller list fetched successfully");
  } catch (err) {
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

const addSeller = async (req, res) => {
  try {
    const { companyName, name, email, phone, address, status } = req.body;

    if (!companyName || !name || !email || !phone) {
      return Response.errorResponseWithoutData(res, "Missing required fields", FAIL);
    }

    // Check for duplicate email
    const existingEmail = await User.findOne({ email, role: ROLES.SELLER.name });
    if (existingEmail) {
      return Response.errorResponseWithoutData(res, "Email already exists for a seller", FAIL);
    }

    // Check for duplicate company name
    const existingCompany = await User.findOne({ companyName, role: ROLES.SELLER.name });
    if (existingCompany) {
      return Response.errorResponseWithoutData(res, "Company name already exists", FAIL);
    }

    const seller = new User({
      companyName,
      address,
      userName: name,
      email,
      mobile_no: phone,
      role: ROLES.SELLER.name,
      roleLevel: ROLES.SELLER.level,
      status,
    });

    await seller.save();
    return Response.successResponseData(res, seller, SUCCESS, "Seller added successfully");
  } catch (err) {
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

const editSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, name, email, phone, address, status } = req.body;
    const existingEmail = await User.findOne({
      email,
      role: ROLES.SELLER.name,
      _id: { $ne: id },
    });
    if (existingEmail) {
      return Response.errorResponseWithoutData(res, "Email already exists for another seller", FAIL);
    }

    const existingCompany = await User.findOne({
      companyName,
      role: ROLES.SELLER.name,
      _id: { $ne: id },
    });
    if (existingCompany) {
      return Response.errorResponseWithoutData(res, "Company name already exists for another seller", FAIL);
    }

    const seller = await User.findByIdAndUpdate(
      id,
      {
        companyName,
        address,
        userName: name,
        email,
        mobile_no: phone,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!seller || seller.role !== ROLES.SELLER.name) {
      return Response.errorResponseWithoutData(res, "Seller not found", FAIL);
    }

    return Response.successResponseData(res, seller, SUCCESS, "Seller updated successfully");
  } catch (err) {
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

const deleteSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await User.findByIdAndDelete(id);

    if (!seller || seller.role !== ROLES.SELLER.name) {
      return Response.errorResponseWithoutData(res, "Seller not found", FAIL);
    }

    return Response.successResponseWithoutData(res, "Seller deleted successfully", SUCCESS);
  } catch (err) {
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

const getSellerProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Product.find({ seller: id });

    return Response.successResponseData(res, products, SUCCESS, "Seller products fetched successfully");
  } catch (err) {
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

const getSellerReports = async (req, res) => {
  try {
    // TODO: Add logic for actual reports
    return Response.successResponseData(res, {}, SUCCESS, "Seller reports fetched successfully");
  } catch (err) {
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

module.exports = {
  getSellers,
  addSeller,
  editSeller,
  deleteSeller,
  getSellerProducts,
  getSellerReports,
};
