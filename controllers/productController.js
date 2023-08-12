import slugify from "slugify";
import fs from "fs";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";

export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //validations
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo is Required and should be less than 1mb" });
    }
    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      // products.photo.data = fs.readFileSync(photo.path);
      // products.photo.contentType = photo.type;
      const imageBuffer = fs.readFileSync(photo.path);
      products.photo.data = imageBuffer;
      products.photo.contentType = photo.type;
      products.base64Image = imageBuffer.toString("base64");
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in create product",
      error,
    });
  }
};

// export const getProductController = async (req, res) => {
//   try {
//     const products = await productModel
//       .find({})
//       .limit(12)
//       .sort({ createdAt: -1 });
//     res.status(200).send({
//       success: true,
//       message: "All products",
//       countTotal: products.length,
//       products,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error in getting products",
//       error: error.message,
//     });
//   }
// };

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .limit(12)
      .sort({ createdAt: -1 });

    const productsWithBase64Images = products.map((product) => ({
      ...product.toObject(),
      base64Image: product.photo.data.toString("base64"),
    }));

    res.status(200).send({
      success: true,
      message: "All products",
      countTotal: productsWithBase64Images.length,
      products: productsWithBase64Images,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};

// export const getSingleProductController = async (req, res) => {
//   try {
//     const product = await productModel
//       .find({ slug: req.params.slug })
//       .populate("category");
//     res.status(200).send({
//       success: true,
//       message: "Single product fetched successfully",
//       product,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error in fetching single products",
//       error,
//     });
//   }
// };
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .populate("category");

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    const productWithBase64Image = {
      ...product.toObject(),
      base64Image: product.photo.data.toString("base64"),
    };

    res.status(200).send({
      success: true,
      message: "Single product fetched successfully",
      product: productWithBase64Image,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching single product",
      error,
    });
  }
};

export const getProductPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product?.photo?.data) {
      res.set("Content-Type", product.photo.contentType);
      return res.status(200).send({
        success: true,
        message: "Image fetched successfully",
        product,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching product photo",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.pid);
    res.status(201).send({
      success: true,
      message: `${product.name} deleted successfully`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //validations
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "Photo is Required and should be less than 1mb" });
    }
    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      // products.photo.data = fs.readFileSync(photo.path);
      // products.photo.contentType = photo.type;
      const imageBuffer = fs.readFileSync(photo.path);
      products.photo.data = imageBuffer;
      products.photo.contentType = photo.type;
      products.base64Image = imageBuffer.toString("base64");
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update product",
      error,
    });
  }
};

export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) {
      args.category = checked;
    }
    if (radio.length) {
      args.price = { $gte: radio[0], $lte: radio[1] };
    }

    const products = await productModel.find(args);
    const productsWithBase64Images = products.map((product) => ({
      ...product.toObject(),
      base64Image: product.photo.data.toString("base64"),
    }));
    res.status(200).send({
      success: true,
      countTotal: productsWithBase64Images.length,
      products: productsWithBase64Images,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while filtering products",
      error,
    });
  }
};

export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while getting product count",
    });
  }
};

export const productListController = async (req, res) => {
  try {
    let perPage = 6;
    let page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    const productsWithBase64Images = products.map((product) => ({
      ...product.toObject(),
      base64Image: product.photo.data.toString("base64"),
    }));
    res.status(200).send({
      success: true,
      countTotal: productsWithBase64Images.length,
      products: productsWithBase64Images,
    });
  } catch (error) {
    console.log(error),
      res.status(400).send({
        success: false,
        message: "Error in per page controller",
      });
  }
};

export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });
    const productsWithBase64Images = results.map((product) => ({
      ...product.toObject(),
      base64Image: product.photo.data.toString("base64"),
    }));
    res.status(200).send({
      success: true,
      countTotal: productsWithBase64Images.length,
      products: productsWithBase64Images,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Something went wrong while searching",
      error,
    });
  }
};

export const similarProductsController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .limit(3)
      .populate("category");
      const productsWithBase64Images = products.map((product) => ({
        ...product.toObject(),
        base64Image: product.photo.data.toString("base64"),
      }));
      res.status(200).send({
        success: true,
        countTotal: productsWithBase64Images.length,
        products: productsWithBase64Images,
      });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while fetching similar products",
      error,
    });
  }
};

export const categoryProductController=async(req,res)=>{
  try {
    const {slug}=req.params;
    const category=await categoryModel.findOne({slug});
    const products=await productModel.find({category}).populate('category');
    const productsWithBase64Images = products.map((product) => ({
      ...product.toObject(),
      base64Image: product.photo.data.toString("base64"),
    }));
    res.status(200).send({
      success: true,
      countTotal: productsWithBase64Images.length,
      category,
      products: productsWithBase64Images,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success:false,
      message:"Error while getting products according to category",
      error
    })
    
  }
}
