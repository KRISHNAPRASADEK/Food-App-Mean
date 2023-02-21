const db = require("./db");
//import jsonwebtoken
const jwt = require("jsonwebtoken");

// all products
const allProducts = () => {
  return db.Product.find().then((result) => {
    if (result) {
      return {
        statusCode: 200,
        products: result,
      };
    } else {
      return {
        statusCode: 404,
        message: "Data is empty/server busy",
      };
    }
  });
};

// view product
const viewProduct = (id) => {
  return db.Product.findOne({ id }).then((result) => {
    if (result) {
      return {
        statusCode: 200,
        product: result,
      };
    } else {
      return {
        statusCode: 404,
        message: "Product is unavailable",
      };
    }
  });
};

// register
const register = (username, email, password) => {
  console.log("Inside register function in dataservice");
  //find acno is in mongodb // db.users.findOne()
  return db.User.findOne({ email }).then((result) => {
    console.log(result);
    if (result) {
      //acnt already exists
      return {
        statusCode: 403,
        message: "Account Already Exists",
      };
    } else {
      // to add new user
      const newUser = new db.User({
        username,
        email,
        password,
        checkout: [],
        wishlist: [],
        cart: [],
      });
      // to save new user in mongodb use save()
      newUser.save();
      return {
        statusCode: 200,
        message: "Registration Successful",
      };
    }
  });
};

//login
const login = (email, password) => {
  console.log("Inside login function in dataservice");
  // check acno pswd in mongodb
  return db.User.findOne({
    email,
    password,
  }).then((result) => {
    if (result) {
      //generate token

      const token = jwt.sign({ email }, "B68DC6BECCF4A68C3D8D78FE742E2", {
        algorithm: "HS256",
      });
      return {
        statusCode: 200,
        message: "Login Successful",
        username: result.username,
        checkout: result.checkout,
        wishlist: result.wishlist,
        cart: result.cart,
        email,
        token,
      };
    } else {
      return {
        statusCode: 403,
        message: "Invalid Account / Password",
      };
    }
  });
};

// addToWishlist
const addToWishlist = (email, id) => {
  console.log("Inside wishlist function in dataservice");
  let productId = Number(id);

  return db.User.findOne({ email }).then((result) => {
    if (result) {
      console.log(result);
      // email is present in db
      result.wishlist.push({
        productId,
      });

      // to update in mongodb
      result.save();
      return {
        statusCode: 200,
        message: `product id ${productId} added to wishlist`,
      };
    } else {
      return {
        statusCode: 404,
        message: "Invalid / server error",
      };
    }
  });
};

//removeFromWishlist
const removeFromWishlist = (email, id) => {
  console.log("Inside removefromwishlist function in dataservice");
  let productId = Number(id);

  return db.User.updateOne(
    { email },
    {
      $pull: {
        wishlist: { productId },
      },
    }
  ).then((result) => {
    if (result) {
      console.log(result);

      // to update in mongodb
      // result.save();
      return {
        statusCode: 200,
        message: `product id ${productId} removed from wishlist..`,
      };
    } else {
      return {
        statusCode: 404,
        message: "Invalid / server error",
      };
    }
  });
};

// addToCart
const addToCart = (email, id, count) => {
  console.log("Inside addToCart function in dataservice");
  let productId = Number(id);

  return db.User.findOne({ email }).then((result) => {
    if (result) {
      console.log(result);
      // email is present in db
      result.cart.push({
        productId,
        count,
      });
      result.save();
      // to update in mongodb
      return {
        statusCode: 200,
        message: `product id ${productId} added to cart`,
      };
    } else {
      return {
        statusCode: 404,
        message: "Invalid / server error",
      };
    }
  });
};

// removeFromCart
const removeFromCart = (email, id) => {
  console.log("Inside removeFromCart function in dataservice");
  let productId = Number(id);

  return db.User.updateOne(
    { email },
    {
      $pull: {
        cart: { productId },
      },
    }
  ).then((result) => {
    if (result) {
      console.log(result);

      // to update in mongodb
      // result.save();
      return {
        statusCode: 200,
        message: `product id ${productId} removed from cart..`,
      };
    } else {
      return {
        statusCode: 404,
        message: "Invalid / server error",
      };
    }
  });
};
// emptyCart
const emptyCart = (email) => {
  console.log("Inside emptyCart function in dataservice");

  return db.User.findOneAndUpdate(
    { email },
    {
      $set: {
        cart: [],
      },
    }
  ).then((result) => {
    if (result) {
      console.log(result);

      // to update in mongodb
      // result.save();
      return {
        statusCode: 200,
        message: `cart is empty..`,
      };
    } else {
      return {
        statusCode: 404,
        message: "Invalid / server error",
      };
    }
  });
};

//updateCartItemCount
const updateCartItemCount = (email, id, count) => {
  console.log("Inside updateCartItemCount function in dataservice");
  let productId = Number(id);
  count = Number(count);
  return db.User.findOneAndUpdate(
    { email, "cart.productId": productId },
    {
      $set: {
        "cart.$.count": count,
      },
    }
  ).then((result) => {
    if (result) {
      console.log(result);

      // to update in mongodb
      // result.save();
      return {
        statusCode: 200,
        message: `product id ${productId} item count  updated..`,
      };
    } else {
      return {
        statusCode: 404,
        message: "Invalid / server error",
      };
    }
  });
};

//getMyItems
const getWishlist = (email) => {
  console.log("Inside getMyItems function in dataservice");
  // check email in mongodb
  return db.User.findOne({ email }).then((result) => {
    if (result) {
      //generate token
      const token = jwt.sign({ email }, "B68DC6BECCF4A68C3D8D78FE742E2", {
        algorithm: "HS256",
      });
      return {
        statusCode: 200,
        message: `got my items of ${result.username}`,
        username: result.username,
        checkout: result.checkout,
        wishlist: result.wishlist,
        cart: result.cart,
        email,
        token,
      };
    } else {
      return {
        statusCode: 403,
        message: "Invalid email / server issues",
      };
    }
  });
};

//getMyOrders
const getMyOrders = (email) => {
  console.log("Inside getMyOrders function in dataservice");
  // check email in mongodb
  return db.User.findOne({ email }).then((result) => {
    if (result) {
      //generate token
      const token = jwt.sign({ email }, "B68DC6BECCF4A68C3D8D78FE742E2", {
        algorithm: "HS256",
      });
      return {
        statusCode: 200,
        message: `got orders of ${result.username}`,
        checkout: result.checkout,
      };
    } else {
      return {
        statusCode: 403,
        message: "Invalid email / server issues",
      };
    }
  });
};

// addToCheckout
const addToCheckout = (
  email,
  orderID,
  transactionID,
  dateAndTime,
  amount,
  status,
  products,
  detailes
) => {
  console.log("Inside addToCheckout function in dataservice");
  // let productId = Number(id);

  return db.User.findOne({ email }).then((result) => {
    if (result) {
      console.log(result);
      // email is present in db
      result.checkout.push({
        orderID,
        transactionID,
        dateAndTime,
        amount,
        status,
        products,
        detailes,
      });
      result.save();
      // to update in mongodb
      return {
        statusCode: 200,
        message: `transaction ${transactionID} added to checkout`,
        name: detailes.name,
        mobile: detailes.mobile,
        orderID,
        transactionID,
        dateAndTime,
        amount,
      };
    } else {
      return {
        statusCode: 404,
        message: "Invalid / server error",
      };
    }
  });
};

module.exports = {
  allProducts,
  viewProduct,
  register,
  login,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  addToCart,
  removeFromCart,
  updateCartItemCount,
  emptyCart,
  addToCheckout,
  getMyOrders,
};
