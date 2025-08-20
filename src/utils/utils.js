export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const calculateCartTotal = (cartItems) => {
  return cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
};

export const getError = (error) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};