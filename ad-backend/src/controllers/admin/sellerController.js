const { User } = require("../../models/user");
const Product = require("../../models/product");
const Response = require("../../services/Response");
const { ROLES } = require("../../services/Constants");
const SUCCESS = 200;
const FAIL = 400;
const INTERNAL_SERVER = 500;

exports.getSellers = async (req, res) => {
  try {
    const sellers = await User.find({ role: ROLES.SELLER.name }).sort({ createdAt: -1 });
    return Response.successResponseData(res, sellers, SUCCESS, "Seller list fetched successfully");
  } catch (err) {
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

exports.addSeller = async (req, res) => {
  try {
    const { companyName, name, email, phone, address, status } = req.body;
    
    // Check for duplicate email
    const existingEmail = await User.findOne({ 
      email: email,
      role: ROLES.SELLER.name 
    });
    if (existingEmail) {
      return Response.errorResponseWithoutData(res, "Email already exists for a seller", FAIL);
    }
    
    // Check for duplicate company name
    const existingCompany = await User.findOne({ 
      companyName: companyName,
      role: ROLES.SELLER.name 
    });
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
    console.log({seller})
    return Response.successResponseData(res, seller, SUCCESS, "Seller added successfully");
  } catch (err) {
    console.log(err);
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

exports.editSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, name, email, phone, address, status } = req.body;
    
    // Check for duplicate email (excluding current seller)
    const existingEmail = await User.findOne({ 
      email: email,
      role: ROLES.SELLER.name,
      _id: { $ne: id }
    });
    if (existingEmail) {
      return Response.errorResponseWithoutData(res, "Email already exists for another seller", FAIL);
    }
    
    // Check for duplicate company name (excluding current seller)
    const existingCompany = await User.findOne({ 
      companyName: companyName,
      role: ROLES.SELLER.name,
      _id: { $ne: id }
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
      { new: true }
    );
    if (!seller || seller.role !== ROLES.SELLER.name) return Response.errorResponseWithoutData(res, "Seller not found", FAIL);
    return Response.successResponseData(res, seller, SUCCESS, "Seller updated successfully");
  } catch (err) {
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

exports.deleteSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await User.findByIdAndDelete(id);
    if (!seller || seller.role !== ROLES.SELLER.name) return Response.errorResponseWithoutData(res, "Seller not found", FAIL);
    return Response.successResponseWithoutData(res, "Seller deleted successfully", SUCCESS);
  } catch (err) {
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

exports.getSellerProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Product.find({ seller: id });
    return Response.successResponseData(res, products, SUCCESS, "Seller products fetched successfully");
  } catch (err) {
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
};

exports.getSellerReports = async (req, res) => {
  try {
    return Response.successResponseData(res, {}, SUCCESS, "Seller reports fetched successfully");
  } catch (err) {
    return Response.errorResponseData(res, err.message, INTERNAL_SERVER);
  }
}; 