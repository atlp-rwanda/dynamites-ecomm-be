import Product from '../database/models/productEntity';
import dbConnection from '../database';


const productRepository = dbConnection.getRepository(Product);
/**
 * Function to check the availability of a product based on its quantity.
 * If the quantity is zero, the product's availability is set to false.
 * If the quantity is greater tha zero, its availability is set to true.
 *
 * @param product - The ProductModel.
 */
const productQuantityWatch = async (product: Product) => {
    const quantity = product.quantity;

    if (quantity > 0) {
        product.isAvailable = true;
    } else {
        product.isAvailable = false;
    }

    await productRepository.save(product)

    return product;
};

export default productQuantityWatch;