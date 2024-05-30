interface UserModel {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    picture: string | null;
  }
  
  interface Product {
    id: number;
    name: string;
    image: string;
    gallery: string[];
    shortDesc: string;
    longDesc: string;
    quantity: number;
    regularPrice: number;
    salesPrice: number;
    tags: string[];
    type: string;
    isAvailable: boolean;
    averageRating: number;
    createdAt: Date;
    updatedAt: Date;
    vendor: UserModel;
  }

  interface order {
    id: number;
    user: UserModel | null;
    totalAmount: number;
    status: string;
    deliveryInfo: string | null;
    trackingNumber: string;
    createdAt: Date;
    updatedAt: Date;
    orderDetails: OrderDetails[];
    paid: boolean | null;
  }
  interface OrderDetails {
    id: number;
    order: order;
    product: Product;
    quantity: number;
    price: number;
  }

export const added_to_cart_message=(
    product:Product,
    user:UserModel
): string =>{

    return `
            Dear ${product.vendor.firstName}  ${product.vendor.lastName},

            We are pleased to inform you that a new product has been added to a cart.

            Product Details:
            - Product Name: ${product.name}
            - Product ID: ${product.id}
            - Added By: ${user.firstName} ${user.lastName} email: ${user.email}
            - Added At: ${new Date().toLocaleString()}

            Please prepare for a potential order.

            Best regards,
            The E-commerce Team

            `
}



export const removed_to_cart_message=(
    product:Product,
    user:UserModel
):string=>{

    return `
            Dear ${product.vendor.firstName}  ${product.vendor.lastName}

            We would like to inform you that a product has been removed from a cart.

            Product Details:
            - Product Name: ${product.name}
            - Product ID: ${product.id}
            - Removed By: ${user.firstName} ${user.lastName} email:${user.email}
            - Removed At: ${new Date().toLocaleString()}

            If you have any questions or need further information, please do not hesitate to contact us.

            Best regards,

            The E-commerce Team
         `     
}


export const pressorder_message = (
    product:Product,
    order:order
): string =>{


    return `
            Dear ${product.vendor.firstName}  ${product.vendor.lastName},

            We are pleased to inform you that a new order has been placed.

            Order Details:
            - Order ID: ${order.id}
            - order Tracked Number: ${order.trackingNumber}
            - Customer Name: ${order.user?.firstName} ${order.user?.lastName}  email:${order.user?.email}
            - Order Date: ${order.createdAt}
            - Product: ${product.name} with id ${product.id}

            Please prepare the order for shipping as soon as possible.

            Thank you for your prompt attention to this new order.

            Best regards,
            
            The E-commerce Team
           ` 
}

export const order_status_changed = (
    product:Product,
    order:order
)=>{

    return  `
            Dear ${product.vendor.firstName}  ${product.vendor.lastName},

            We hope this message finds you well.

            We would like to inform you that the status of Order ${order.id} has been updated to "${order.status}". Please find the details of the order below:

            - Order ID: ${order.id}
            - Order Tracking Number: ${order.trackingNumber}
            - Customer Name:  ${order.user?.firstName} ${order.user?.lastName} email:${order.user?.email}
            - Order Date: ${order.createdAt}
            - Current Status: ${order.status}

            
            If you have any questions or require further information, please do not hesitate to contact us.

            Thank you for your continued partnership.

            Best regards,

            The E-commerce Team 
            

            ---

            **Note:** This is an automated message. Please do not reply directly to this email.

            `
}

export const order_canceled = (
  product:Product,
  order:order
)=>{
  return `

        Dear ${product.vendor.firstName} ${product.vendor.lastName},

        We regret to inform you that the following order has been canceled:

        Order Details:
        - Order ID: ${order.id}
        - Product Name: ${product.name}
        - Product ID: ${product.id}
        - Order Date: ${new Date(order.createdAt).toLocaleDateString()}
        - Customer: ${order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Guest'}
        - Total Amount: $${order.totalAmount}

        If you have any questions or need further assistance, please do not hesitate to contact our support team.

        Best regards,
        The E-commerce Team

        `
}




export const new_product_created = (
product:Product
)=>{
  return `

        Hello ${product.vendor.firstName} ${product.vendor.lastName},

        We are excited to inform you that your new product has been successfully created and listed on our platform!

        Product Details:
        - Name: ${product.name}
        - Short Description: ${product.shortDesc}
        - Price: $${product.regularPrice}
        - Availability: ${product.isAvailable ? 'In Stock' : 'Out of Stock'}

        Thank you for being a valued vendor. We wish you great success with your new product!

        Best regards,
        The E-commerce Team
    `
}

export const updated_Product = (
  product:Product
)=>{
  return `
   
        Hello ${product.vendor.firstName} ${product.vendor.lastName},

        We are pleased to inform you that your product has been successfully updated on our platform!

        Updated Product Details:
        - Name: ${product.name}
        - Short Description:${product.shortDesc}
        - Price: $${product.regularPrice}
        - Availability: ${product.isAvailable ? 'In Stock' : 'Out of Stock'}

        Thank you for continuously enhancing your product offerings. We wish you continued success!

        Best regards,
        The E-commerce Team
    `
}

export const product_deleted=(
  product:Product
)=>{
  return `

        Hello ${product.vendor.firstName} ${product.vendor.id},

        We regret to inform you that your product has been removed from our platform.

        Deleted Product Details:
        - Name: ${product.name}
        - Short Description:${product.shortDesc}
        - Price: $${product.regularPrice}

        If you have any questions or believe this was a mistake, please contact our support team.

        Best regards,
        The E-commerce Team
    `
}

export const product_not_availble = (
  product:Product
)=>{
  return  `
        Dear ${product.vendor.firstName},

        We regret to inform you that your product "${product.name}" is currently unavailable on our platform.

        Product Details:
        - Name: ${product.name}
        - Short Description: ${product.shortDesc}
        - Price: $${product.regularPrice}

        If you have any questions or concerns, please feel free to contact our support team.

        Best regards,
        The E-commerce Team
`
}

export const expiried_order = (
  product:Product,
  order:order
)=>{
  return `
          Hello ${product.vendor.firstName} ${product.vendor.lastName},

          We regret to inform you that the following order has been cancelled as it was not processed within the stipulated time frame of 5 days:

          Order Details:
          - Order ID: ${order.id}
          - Total Amount: $${order.totalAmount}
          - Order Status: ${order.status}
          - Ordered At: ${order.createdAt.toLocaleString()}
          
          Product Details:
          ${order.orderDetails.map(detail => `
          - Product Name: ${detail.product.name}
          - Product ID: ${detail.product.id}
          - Quantity: ${detail.quantity}
          - Price: $${detail.price}`).join('\n')}
          
          If you have any questions or concerns, please contact our support team.

          Best regards,
          The E-commerce Team
  `
}