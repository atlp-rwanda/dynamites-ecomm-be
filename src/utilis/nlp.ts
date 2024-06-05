import {
  getProductByName,
  getProducts,
  getOrderStatusByTrackingNumber,
  getServices,
  getServiceByName,
  getProductDetails,
  getProductReviews,
  getCartItems,
  getTotalCartAmount,
  getCartItemQuantity,
  getProductCategories
  
} from '../service/chatbotService';

export const extractKeyword = (message: string, keyword: string): string => {
  return message.replace(keyword, '').trim();
};

export const analyzeMessage = (message: string): string => {
  return message.toLowerCase();
};

export const identifyIntent = (
  message: string
): { intent: string; keyword: string } => {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes('hi') ||
    lowerMessage.includes('hello') ||
    lowerMessage.includes('hey') ||
    lowerMessage.includes('good morning') ||
    lowerMessage.includes('good afternoon') ||
    lowerMessage.includes('good evening') ||
    lowerMessage.includes('good to see you again') ||
    lowerMessage.includes('nice to see you again') ||
    lowerMessage.includes('i’m glad to see you') ||
    lowerMessage.includes('i’m happy to see you') ||
    lowerMessage.includes('i’m pleased to see you')
  )
    return { intent: 'greeting', keyword: '' };

  if (
    lowerMessage.includes('what products do you sell') ||
    lowerMessage.includes('sell')
  )
    return { intent: 'listProducts', keyword: '' };

    if (
      (message.includes('do you have') && message.includes('from product stock')) ||
      (message.includes('is there') && message.includes('in your stock')) ||
      (message.includes('can I find') && message.includes('in the product stock')) ||
      (message.includes('do you carry') && message.includes('from your stock')) ||
      (message.includes('is it available') && message.includes('from the stock')) ||
      (message.includes('do you offer') && message.includes('from your product stock')) ||
      (message.includes('did you have') && message.includes('from product stock')) ||
      (message.includes('had') && message.includes('from your stock')) ||
      (message.includes('has') && message.includes('in stock')) ||
      (message.includes('will you have') && message.includes('from product stock')) ||
      (message.includes('would you have') && message.includes('from your stock'))
  ) {
      const productName = message
      .split(/do you have |is there |can I find |do you carry |is it available |do you offer |did you have |had |has |will you have |would you have /i)[1]
      .split(/ from product stock| in your stock| in the product stock| from your stock| from the stock| from your product stock/i)[0];
      return { intent: 'checkProductStock', keyword: productName.trim() };
  }
  

  const detailKeywords = [
    'tell me more about', 'give me more information on','give me more info on', 'give me info on', 'more details about',
    'info about', 'details on', 'can you tell me details about', 'what are the details of',
    'give me the details on', 'i need more details about', 'i am looking for information about',
    'info on', 'i want details on'
  ];
  
  const detailRegex = new RegExp(`(?:${detailKeywords.join('|')})\\s*([\\w\\s]+)`, 'i');
  
  if (detailKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
    const productNameMatch = message.match(detailRegex);
    const productName = productNameMatch ? productNameMatch[1].trim() : '';
    return { intent: 'productDetails', keyword: productName };
  }
  

  const priceKeywords = [
    'price of', 'cost of', 'how much is', 'how much does', 'how much for', 
    'what is the price of', 'what\'s the price of', 'what is the cost of', 
    'can you tell me the price of', 'i want to know the cost of'
  ];
  
  const priceRegex = new RegExp(`(?:${priceKeywords.join('|')})\\s*([\\w\\s]+)`, 'i');
  
  if (priceKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
    const productNameMatch = message.match(priceRegex);
    const productName = productNameMatch ? productNameMatch[1].trim() : '';
    return { intent: 'productPrice', keyword: productName };
  }
  
  if (
    lowerMessage.includes('what product categories do you have') ||
    lowerMessage.includes('list of product categories') ||
    lowerMessage.includes('list of product categories') ||
    lowerMessage.includes('product categories') ||
    lowerMessage.includes('categories of product') ||
    lowerMessage.includes('categories you offer') ||
    lowerMessage.includes('do you have product categories') ||
    lowerMessage.includes('are there product categories') ||
    lowerMessage.includes('show me product categories') ||
    lowerMessage.includes('tell me about product categories') ||
    lowerMessage.includes('can you tell me the product categories') ||
    lowerMessage.includes('what kind of product categories do you have') ||
    lowerMessage.includes('which product categories are available') ||
    lowerMessage.includes('provide me with product categories') ||
    lowerMessage.includes('offer product categories') ||
    lowerMessage.includes('give me details on product categories') ||
    lowerMessage.includes('describe your product categories') ||
    lowerMessage.includes('explain your product categories') ||
    lowerMessage.includes('what types of product categories are there') ||
    lowerMessage.includes('types of product categories you have') ||
    lowerMessage.includes('product categories available') ||
    lowerMessage.includes('product categories offered') ||
    lowerMessage.includes('product categories listed') ||
    lowerMessage.includes('product categories details') ||
    lowerMessage.includes('product categories description') ||
    lowerMessage.includes('product categories explanation') ||
    lowerMessage.includes('would you list your product categories?') ||
    lowerMessage.includes('could you show me the product categories?') ||
    lowerMessage.includes('is there a list of your product categories?') ||
    lowerMessage.includes('can you explain what product categories you offer?') ||
    lowerMessage.includes('what are the types of product categories you have?') ||
    lowerMessage.includes('I need to know the product categories you offer.') ||
    lowerMessage.includes('Could you give me specifics on your product categories?') ||
    lowerMessage.includes('What are the kinds of product categories available?') ||
    lowerMessage.includes('Tell me more about the product categories you have.') ||
    lowerMessage.includes('Are there any descriptions of your product categories?') ||
    lowerMessage.includes('Can you elaborate on the product categories you offer?') ||
    lowerMessage.includes('What are the names of the product categories you have?') ||
    lowerMessage.includes('Do you have a variety of product categories?') ||
    lowerMessage.includes('Show me the range of product categories you offer.')
) {
    return { intent: 'listProductCategories', keyword: '' };
}
if (lowerMessage.includes('products from')) {
  const categoryName = lowerMessage
    .split('products from')[1]
    .trim();
  return { intent: 'listProductsByCategoryName', keyword: categoryName };
}

if (
  lowerMessage.includes('what products do you have from') ||
  lowerMessage.includes('list products from') ||
  lowerMessage.includes('show me products from') ||
  lowerMessage.includes('products in the category') ||
  lowerMessage.includes('products from the category') ||
  lowerMessage.includes('products with category')
) {
  const categoryName = lowerMessage
    .split(/what products do you have from |list products from |show me products from |products in the category |products from the category |products with category /i)[1]
    .trim();
  return { intent: 'listProductsByCategory', keyword: categoryName };
}


  const reviewKeywords = [
    'review of', 'reviews of', 'what are the reviews of', 'can you tell me the reviews of', 
    'i want to know the reviews of', 'what\'s the review of', 'how are the reviews of'
  ];
  
  const reviewRegex = new RegExp(`(?:${reviewKeywords.join('|')})\\s*([\\w\\s]+)`, 'i');
  
  if (reviewKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
    const productNameMatch = message.match(reviewRegex);
    const productName = productNameMatch ? productNameMatch[1].trim() : '';
    return { intent: 'productReview', keyword: productName };
  }
  

  const cancelOrderKeywords = [
    'cancel my order', 'cancel order', 'can i cancel my order', 'how to cancel my order',
    'how do i cancel my order', 'order cancellation', 'stop my order', 'cancel this order',
    'cancel the order', 'am i able to cancel my order?', 'will i be able to cancel my order?',
    'could i cancel my order?', 'i want to cancel my order', 'please cancel my order',
    'what is the process to cancel my order?', 'how can i stop my order?', 'i need to cancel my order',
    'i wish to cancel my order', 'i\'d like to cancel my order', 'i have decided to cancel my order',
    'i\'m thinking of canceling my order', 'i intend to cancel my order', 'i plan to cancel my order',
    'i aim to cancel my order', 'i\'m considering canceling my order', 'i\'m pondering over canceling my order',
    'i\'m mulling over canceling my order', 'i\'m deliberating whether to cancel my order', 'i\'m hesitating to cancel my order',
    'i\'m uncertain about canceling my order', 'i\'m skeptical about canceling my order', 'i\'m hesitant to cancel my order',
    'i\'m indecisive about canceling my order', 'i\'m wavering on canceling my order', 'i\'m contemplating canceling my order',
    'i\'m second-guessing canceling my order', 'i\'m reconsidering canceling my order', 'i\'m reevaluating canceling my order',
    'i\'m reassessing canceling my order', 'i\'m reviewing canceling my order', 'i\'m evaluating canceling my order',
    'i\'m assessing canceling my order', 'i\'m analyzing canceling my order', 'i\'m scrutinizing canceling my order',
    'i\'m examining canceling my order', 'i\'m inspecting canceling my order', 'i\'m probing canceling my order',
    'i\'m investigating canceling my order', 'i\'m researching canceling my order', 'i\'m studying canceling my order',
    'i\'m looking into canceling my order', 'i\'m delving into canceling my order', 'i\'m diving into canceling my order',
    'i\'m getting into canceling my order', 'i\'m stepping into canceling my order', 'i\'m venturing into canceling my order',
    'i\'m plunging into canceling my order', 'i\'m sinking into canceling my order', 'i\'m immersing myself into canceling my order',
    'i\'m submerging myself into canceling my order', 'i\'m engaging in canceling my order', 'i\'m participating in canceling my order',
    'i\'m involved in canceling my order', 'i\'m implicated in canceling my order', 'i\'m complicit in canceling my order',
    'i\'m party to canceling my order', 'i\'m privy to canceling my order', 'i\'m aware of canceling my order',
    'i\'m cognizant of canceling my order', 'i\'m mindful of canceling my order', 'i\'m conscious of canceling my order',
    'i\'m alert to canceling my order', 'i\'m awake to canceling my order', 'i\'m vigilant about canceling my order',
    'i\'m watchful of canceling my order', 'i\'m observant of canceling my order', 'i\'m attentive to canceling my order',
    'i\'m keen on canceling my order', 'i\'m eager to cancel my order'
  ];
  
  const cancelOrderRegex = new RegExp(`(?:${cancelOrderKeywords.join('|')})\\s*([\\w\\s]+)`, 'i');
  
  if (cancelOrderKeywords.some(keyword => lowerMessage.toLowerCase().includes(keyword))) {
    const productNameMatch = lowerMessage.match(cancelOrderRegex);
    const productName = productNameMatch? productNameMatch[1].trim() : '';
    return {
      intent: 'cancelOrder',
      keyword: productName,
    };
  }
  

  if (
    lowerMessage.includes('return my order') ||
    lowerMessage.includes('return order') ||
    lowerMessage.includes('how to return my order') ||
    lowerMessage.includes('how do i return my order') ||
    lowerMessage.includes('order return') ||
    lowerMessage.includes('send back my order')
  )
    return {
      intent: 'returnOrder',
      keyword: extractKeyword(lowerMessage, 'how can i return my order'),
    };

  if (
    lowerMessage.includes('change the delivery address for my order') ||
    lowerMessage.includes('change address') ||
    lowerMessage.includes('update delivery address') ||
    lowerMessage.includes('edit delivery address') ||
    lowerMessage.includes('how to change delivery address') ||
    lowerMessage.includes('how do i change the address') ||
    lowerMessage.includes('new delivery address')
  )
    return {
      intent: 'changeOrderAddress',
      keyword: extractKeyword(
        lowerMessage,
        'can i change the delivery address for my order'
      ),
    };

  if (
    lowerMessage.includes('know if my order has been shipped') ||
    lowerMessage.includes('order shipped') ||
    lowerMessage.includes('order status') ||
    lowerMessage.includes('is my order shipped') ||
    lowerMessage.includes('has my order been shipped') ||
    lowerMessage.includes('check order shipment') ||
    lowerMessage.includes('track my order')
  )
    return {
      intent: 'orderShipped',
      keyword: extractKeyword(
        lowerMessage,
        'how do i know if my order has been shipped'
      ),
    };

  if (
    lowerMessage.includes('add items to an existing order') ||
    lowerMessage.includes('add items to order') ||
    lowerMessage.includes('modify my order') ||
    lowerMessage.includes('can i add items to my order') ||
    lowerMessage.includes('how to add items to order') ||
    lowerMessage.includes('edit my order') ||
    lowerMessage.includes('include more items in my order')
  )
    return {
      intent: 'addItemsToOrder',
      keyword: extractKeyword(
        lowerMessage,
        'can i add items to an existing order'
      ),
    };

  if (
    lowerMessage.includes('return policy') ||
    lowerMessage.includes('return guidelines') ||
    lowerMessage.includes('how to return products') ||
    lowerMessage.includes('product return rules') ||
    lowerMessage.includes('what is your return policy') ||
    lowerMessage.includes('how does your return policy work') ||
    lowerMessage.includes('explain return policy')
  )
    return { intent: 'returnPolicy', keyword: '' };

  if (
    lowerMessage.includes('request a refund') ||
    lowerMessage.includes('refund') ||
    lowerMessage.includes('get a refund') ||
    lowerMessage.includes('how to request a refund') ||
    lowerMessage.includes('how do i get a refund') ||
    lowerMessage.includes('money back') ||
    lowerMessage.includes('refund process')
  )
    return { intent: 'requestRefund', keyword: '' };

  if (
    lowerMessage.includes('shipping charges on my order') ||
    lowerMessage.includes('shipping charges') ||
    lowerMessage.includes('delivery charges') ||
    lowerMessage.includes('how much are shipping charges') ||
    lowerMessage.includes('how much are delivery charges') ||
    lowerMessage.includes('cost of shipping') ||
    lowerMessage.includes('shipping fees')
  )
    return { intent: 'shippingCharges', keyword: '' };

  if (
    lowerMessage.includes('expedite my shipping') ||
    lowerMessage.includes('expedite shipping') ||
    lowerMessage.includes('fast shipping') ||
    lowerMessage.includes('rush shipping') ||
    lowerMessage.includes('how to expedite shipping') ||
    lowerMessage.includes('how to get fast shipping') ||
    lowerMessage.includes('speed up shipping')
  )
    return { intent: 'expediteShipping', keyword: '' };
const serviceQueryKeywords = [
  'what services do you offer', 'services', 'available services', 'list of services', 'services provided',
  'what can you do', 'services you offer', 'what kind of services do you provide', 'what services are available',
  'could you tell me about your services', 'do you offer any services', 'what are your service offerings',
  'i\'m interested in learning about your services', 'i would like to know more about your services',
  'can you give me information on your services', 'could you describe your services', 'what are the services you provide',
  'what services can i get from you', 'which services do you specialize in', 'could you list your service offerings',
  'i\'d like to know what services you have', 'i\'m curious about the services you offer', 'what are the different services you offer',
  'i want to understand the services you provide', 'i\'m looking for information on your service options',
  'can you tell me about the various services you offer', 'i\'d appreciate if you could explain your service portfolio',
  'i\'m trying to find out what kind of services you have', 'i\'d like you to elaborate on the services you provide',
  'could you give me an overview of the services you offer', 'i\'m inquiring about the services available from your company',
  'i\'m wondering what kind of services you specialize in', 'i\'d love to learn more about the services you have available',
  'i\'m interested in exploring the different services you provide', 'i\'m hoping you can tell me more about the services you offer',
  'i\'m eager to understand the range of services you have', 'i\'d be grateful if you could share details about your service offerings',
  'i\'m keen to know what kind of services you can assist me with', 'i\'m hoping you can enlighten me on the services you provide',
  'i\'m desirous of getting information on the services you offer', 'i\'m yearning to learn about the services you have available',
  'i\'m craving to understand the services you can render', 'i\'m longing to discover the services you specialize in',
  'i\'m hankering to find out about the services you provide', 'i\'m aching to get details on the services you offer',
  'i\'m pining to learn more about the services you have', 'i\'m itching to know what kind of services you can deliver',
  'i\'ve been dying to inquire about the services you offer', 'i\'ve been burning to get information on your service offerings',
  'i\'ve been aching to understand the services you provide', 'i\'ve been yearning to discover the services you have available',
  'i\'ve been craving to learn about the services you can render', 'i\'ve been hankering to find out about the services you specialize in',
  'i\'ve been pining to get details on the services you offer', 'i\'ve been longing to explore the services you have available',
  'i\'ve been itching to know what kind of services you can assist me with'
];

const serviceQueryRegex = new RegExp(`(?:${serviceQueryKeywords.join('|')})`, 'i');

if (serviceQueryKeywords.some(keyword => lowerMessage.toLowerCase().includes(keyword))) {
  const serviceNameMatch = lowerMessage.match(serviceQueryRegex);
  const serviceName = serviceNameMatch ? serviceNameMatch[0].trim() : '';
  return {
    intent: 'listServices',
    keyword: serviceName,
  };
}

  if (
    lowerMessage.includes('provide gift wrapping services') ||
    lowerMessage.includes('gift wrapping') ||
    lowerMessage.includes('gift wrap') ||
    lowerMessage.includes('do you offer gift wrapping') ||
    lowerMessage.includes('how to get gift wrapping') ||
    lowerMessage.includes('gift wrapping options') ||
    lowerMessage.includes('wrapping as a gift')
  )
    return { intent: 'giftWrapping', keyword: '' };

  if (
    lowerMessage.includes('schedule a delivery') ||
    lowerMessage.includes('schedule delivery') ||
    lowerMessage.includes('set a delivery time') ||
    lowerMessage.includes('delivery schedule') ||
    lowerMessage.includes('choose delivery time') ||
    lowerMessage.includes('pick delivery date') ||
    lowerMessage.includes('how to schedule delivery')
  )
    return { intent: 'scheduleDelivery', keyword: '' };

  if (
    lowerMessage.includes('installation services for') ||
    lowerMessage.includes('installation') ||
    lowerMessage.includes('setup services') ||
    lowerMessage.includes('install my product') ||
    lowerMessage.includes('do you offer installation') ||
    lowerMessage.includes('how to get installation services') ||
    lowerMessage.includes('product installation')
  )
    return {
      intent: 'installationServices',
      keyword: extractKeyword(
        lowerMessage,
        'do you offer installation services for'
      ),
    };

  if (
    lowerMessage.includes('what is in my cart') ||
    lowerMessage.includes('what items are in my cart') ||
    lowerMessage.includes('contents of my cart') ||
    lowerMessage.includes('show me my cart items')
  ) {
    return { intent: 'getCartItems', keyword: '' };
  }

  if (
    lowerMessage.includes('how much does my cart total') ||
    lowerMessage.includes('total of my cart') ||
    lowerMessage.includes('cost of my cart') ||
    lowerMessage.includes('calculate my cart total') ||
    lowerMessage.includes('what is the sum of my cart')
  ) {
    return { intent: 'getCartTotal', keyword: '' };
  }

  if (
    lowerMessage.includes('can i add more items to my cart') ||
    lowerMessage.includes('add more to my cart') ||
    lowerMessage.includes('increase cart items') ||
    lowerMessage.includes('add items to my cart')
  ) {
    return { intent: 'canAddToCart', keyword: '' };
  }

  if (
    lowerMessage.includes('do i have enough items left in my cart') ||
    lowerMessage.includes('items remaining in my cart') ||
    lowerMessage.includes('cart quantity remaining') ||
    lowerMessage.includes('how many items can I add to my cart') ||
    lowerMessage.includes('available quantity for my cart items')
  ) {
    return { intent: 'getCartItemQuantity', keyword: '' };
  }

  const changeQuantityKeywords = [
    'update quantity of item in cart', 'change item quantity in cart', 'modify item quantity in cart',
    'increase item quantity in cart', 'decrease item quantity in cart', 'add more of this item to my cart',
    'remove some of this item from my cart', 'adjust item quantity in my cart', 'alter item quantity in my cart',
    'change item quantity in my cart', 'update item quantity in my cart', 'modify item quantity in my cart',
    'increase item quantity in my cart', 'decrease item quantity in my cart', 'I want to change item quantity in my cart',
    'Can I change item quantity in my cart?', 'How do I change item quantity in my cart?', 'What is the process to change item quantity in my cart?',
    'Will I be able to change item quantity in my cart?', 'Could I change item quantity in my cart?', 'I need to change item quantity in my cart',
    'I wish to change item quantity in my cart', 'I\'d like to change item quantity in my cart', 'I have decided to change item quantity in my cart',
    'I\'m thinking of changing item quantity in my cart', 'I intend to change item quantity in my cart', 'I plan to change item quantity in my cart',
   
  ];
  
  const changeQuantityRegex = new RegExp(`(?:${changeQuantityKeywords.join('|')})\\s*([\\w\\s]+)`, 'i');
  
  if (changeQuantityKeywords.some(keyword => lowerMessage.toLowerCase().includes(keyword))) {
    const itemNameMatch = lowerMessage.match(changeQuantityRegex);
    const itemName = itemNameMatch? itemNameMatch[1].trim() : '';
    return { intent: 'updateCartQuantity', keyword: itemName };
  }
  

  if (
    lowerMessage.includes('is there anything i should remove from my cart') ||
    lowerMessage.includes('remove items from my cart') ||
    lowerMessage.includes('items to remove from cart') ||
    lowerMessage.includes('what should I remove from my cart') ||
    lowerMessage.includes('clear my cart')
  ) {
    return { intent: 'removeCartItem', keyword: '' };
  }

  if (
    lowerMessage.includes('what happens if i remove an item from my cart') ||
    lowerMessage.includes('impact of removing item from cart') ||
    lowerMessage.includes('consequences of removing cart item') ||
    lowerMessage.includes('effect of removing item from cart') ||
    lowerMessage.includes('remove item from cart impact')
  ) {
    return { intent: 'handleCartRemoval', keyword: '' };
  }

  if (
    lowerMessage.includes('can i save my cart for later') ||
    lowerMessage.includes('save cart for future') ||
    lowerMessage.includes('store cart for later use') ||
    lowerMessage.includes('keep cart for later') ||
    lowerMessage.includes('preserve cart contents')
  ) {
    return { intent: 'saveCart', keyword: '' };
  }

  if (
    lowerMessage.includes('international shipping') ||
    lowerMessage.includes('international') ||
    lowerMessage.includes('ship internationally') ||
    lowerMessage.includes('do you ship internationally') ||
    lowerMessage.includes('how to ship internationally') ||
    lowerMessage.includes('global shipping') ||
    lowerMessage.includes('worldwide shipping')
  )
    return { intent: 'internationalShipping', keyword: '' };

  if (
    lowerMessage.includes('shipping options') ||
    lowerMessage.includes('delivery options') ||
    lowerMessage.includes('types of shipping') ||
    lowerMessage.includes('what shipping options do you have') ||
    lowerMessage.includes('available shipping options') ||
    lowerMessage.includes('shipping methods') ||
    lowerMessage.includes('how can i choose shipping options')
  )
    return { intent: 'shippingOptions', keyword: '' };

  if (
    lowerMessage.includes('create a wishlist') ||
    lowerMessage.includes('wishlist') ||
    lowerMessage.includes('make a wishlist') ||
    lowerMessage.includes('how to create a wishlist') ||
    lowerMessage.includes('add to wishlist') ||
    lowerMessage.includes('wishlist creation') ||
    lowerMessage.includes('making a wishlist') ||
    lowerMessage.includes('set up a wishlist') || 
    lowerMessage.includes('start a wishlist') || 
    lowerMessage.includes('build a wishlist') || 
    lowerMessage.includes('initiate a wishlist') || 
    lowerMessage.includes('establish a wishlist') || 
    lowerMessage.includes('what is a wishlist?') || 
    lowerMessage.includes('how do I create a wishlist?') || 
    lowerMessage.includes('I want to create a wishlist') || 
    lowerMessage.includes('show me how to make a wishlist') ||
    lowerMessage.includes('teach me about creating a wishlist') || 
    lowerMessage.includes('guide me in setting up a wishlist') || 
    lowerMessage.includes('help me start a wishlist') || 
    lowerMessage.includes('assist me in building a wishlist') ||
    lowerMessage.includes('initiate my wishlist') || 
    lowerMessage.includes('establish my wishlist') ||
    lowerMessage.includes('will you show me how to create a wishlist?') ||
    lowerMessage.includes('did you teach me how to set up a wishlist?') || 
    lowerMessage.includes('could you guide me in starting a wishlist?') || 
    lowerMessage.includes('would you assist me in building a wishlist?') || 
    lowerMessage.includes('should I create a wishlist?') ||
    lowerMessage.includes('can I add something to my wishlist?') ||
    lowerMessage.includes('let me know how to add to my wishlist') ||
    lowerMessage.includes('tell me how to add items to my wishlist') || 
    lowerMessage.includes('show me how to add items to my wishlist') || 
    lowerMessage.includes('explain how to add items to my wishlist') || 
    lowerMessage.includes('walk me through adding items to my wishlist') || 
    lowerMessage.includes('lead me in adding items to my wishlist') || 
    lowerMessage.includes('me to adding items to my wishlist') || 
    lowerMessage.includes('how to add items to my wishlist') || 
    lowerMessage.includes('me to creating a wishlist') || 
    lowerMessage.includes('how to create a wishlist') || 
    lowerMessage.includes('me to setting up a wishlist') ||
    lowerMessage.includes('how to set up a wishlist') || 
    lowerMessage.includes('me to starting a wishlist') ||
    lowerMessage.includes('how to start a wishlist') || 
    lowerMessage.includes('me to building a wishlist') ||
    lowerMessage.includes('how to build a wishlist') || 
    lowerMessage.includes('me to initiating a wishlist') ||
    lowerMessage.includes('how to initiate a wishlist') || 
    lowerMessage.includes('me to establishing a wishlist') || 
    lowerMessage.includes('how to establish a wishlist') || 
    lowerMessage.includes('me to making a wishlist') || 
    lowerMessage.includes('how to make a wishlist') || 
    lowerMessage.includes('me to wishlist creation') ||
    lowerMessage.includes('how to create a wishlist') || 
    lowerMessage.includes('me to wishlist management') || 
    lowerMessage.includes('how to manage a wishlist') || 
    lowerMessage.includes('me to wishlist addition') || 
    lowerMessage.includes('how to add to a wishlist') || 
    lowerMessage.includes('me to wishlist editing') || 
    lowerMessage.includes('how to edit a wishlist') ||
    lowerMessage.includes('me to wishlist removal') || 
    lowerMessage.includes('how to remove from a wishlist') || 
    lowerMessage.includes('me to wishlist sharing') || 
    lowerMessage.includes('how to share a wishlist') || 
    lowerMessage.includes('me to wishlist collaboration') ||
    lowerMessage.includes('how to collaborate on a wishlist') || 
    lowerMessage.includes('me to wishlist customization') || 
    lowerMessage.includes('how to customize a wishlist') || 
    lowerMessage.includes('me to wishlist organization') ||
    lowerMessage.includes('how to organize a wishlist') || 
    lowerMessage.includes('me to wishlist maintenance') || 
    lowerMessage.includes('how to maintain a wishlist') || 
    lowerMessage.includes('me to wishlist enhancement') ||
    lowerMessage.includes('how to enhance a wishlist') || 
    lowerMessage.includes('me to wishlist improvement') ||
    lowerMessage.includes('how to improve a wishlist') || 
    lowerMessage.includes('me to wishlist optimization') ||
    lowerMessage.includes('how to optimize a wishlist') || 
    lowerMessage.includes('me to wishlist expansion') ||
    lowerMessage.includes('how to expand a wishlist') || 
    lowerMessage.includes('me to wishlist extension') || 
    lowerMessage.includes('how to extend a wishlist') || 
    lowerMessage.includes('me to wishlist adjustment') || 
    lowerMessage.includes('how to adjust a wishlist') || 
    lowerMessage.includes('me to wishlist modification') || 
    lowerMessage.includes('how to modify a wishlist') || 
    lowerMessage.includes('me to wishlist alteration') ||
    lowerMessage.includes('how to alter a wishlist') || 
    lowerMessage.includes('me to wishlist amendment') || 
    lowerMessage.includes('how to amend a wishlist') || 
    lowerMessage.includes('me to wishlist revision') ||
    lowerMessage.includes('how to revise a wishlist') ||
    lowerMessage.includes('me to wishlist update') 
  )
    return { intent: 'createWishlist', keyword: '' };

  if (
    lowerMessage.includes('offer customer support') ||
    lowerMessage.includes('customer support') ||
    lowerMessage.includes('customer assistance') ||
    lowerMessage.includes('help from customer service') ||
    lowerMessage.includes('do you provide customer support') ||
    lowerMessage.includes('how to get customer support') ||
    lowerMessage.includes('support services')
  )
    return { intent: 'customerSupport', keyword: '' };

  if (
    lowerMessage.includes('contact customer support') ||
    lowerMessage.includes('contact support') ||
    lowerMessage.includes('get in touch with support') ||
    lowerMessage.includes('how to contact support') ||
    lowerMessage.includes('how do i contact support') ||
    lowerMessage.includes('reach customer support') ||
    lowerMessage.includes('connect with support')
  )
    return { intent: 'contactSupport', keyword: '' };

  if (
    lowerMessage.includes('customer service hours') ||
    lowerMessage.includes('service hours') ||
    lowerMessage.includes('support hours') ||
    lowerMessage.includes('what are your service hours') ||
    lowerMessage.includes('when is customer service available') ||
    lowerMessage.includes('support availability') ||
    lowerMessage.includes('customer service availability')
  )
    return { intent: 'customerServiceHours', keyword: '' };

  if (
    lowerMessage.includes('loyalty program') ||
    lowerMessage.includes('loyalty') ||
    lowerMessage.includes('rewards program') ||
    lowerMessage.includes('do you have a loyalty program') ||
    lowerMessage.includes('how to join loyalty program') ||
    lowerMessage.includes('loyalty benefits') ||
    lowerMessage.includes('program for loyal customers')
  )
    return { intent: 'loyaltyProgram', keyword: '' };

  if (
    lowerMessage.includes('sign up for your newsletter') ||
    lowerMessage.includes('newsletter') ||
    lowerMessage.includes('join your newsletter') ||
    lowerMessage.includes('newsletter sign up') ||
    lowerMessage.includes('how to join your newsletter') ||
    lowerMessage.includes('newsletter subscription') ||
    lowerMessage.includes('subscribe to newsletter')
  )
    return { intent: 'newsletterSignUp', keyword: '' };

  if (
    lowerMessage.includes('create an account') ||
    lowerMessage.includes('sign up') ||
    lowerMessage.includes('register') ||
    lowerMessage.includes('how to create an account') ||
    lowerMessage.includes('how to sign up') ||
    lowerMessage.includes('account creation') ||
    lowerMessage.includes('new account')
  )
    return { intent: 'createAccount', keyword: '' };

  if (
    lowerMessage.includes('log in to my account') ||
    lowerMessage.includes('log in') ||
    lowerMessage.includes('sign in') ||
    lowerMessage.includes('how to log in') ||
    lowerMessage.includes('how to sign in') ||
    lowerMessage.includes('account login') ||
    lowerMessage.includes('account sign in')
  )
    return { intent: 'logInAccount', keyword: '' };

  if (
    lowerMessage.includes('reset my password') ||
    lowerMessage.includes('reset password') ||
    lowerMessage.includes('forgot password') ||
    lowerMessage.includes('change my password') ||
    lowerMessage.includes('how to reset my password') ||
    lowerMessage.includes('password reset') ||
    lowerMessage.includes('recover password')
  )
    return { intent: 'resetPassword', keyword: '' };

  if (
    lowerMessage.includes('update my account information') ||
    lowerMessage.includes('update account') ||
    lowerMessage.includes('edit account information') ||
    lowerMessage.includes('how to update account information') ||
    lowerMessage.includes('change my account details') ||
    lowerMessage.includes('account information update') ||
    lowerMessage.includes('modify account information')
  )
    return { intent: 'updateAccountInfo', keyword: '' };

  if (
    lowerMessage.includes('view my order history') ||
    lowerMessage.includes('order history') ||
    lowerMessage.includes('past orders') ||
    lowerMessage.includes('see my order history') ||
    lowerMessage.includes('how to view order history') ||
    lowerMessage.includes('check order history') ||
    lowerMessage.includes('history of my orders')
  )
    return { intent: 'viewOrderHistory', keyword: '' };

  if (
    lowerMessage.includes('manage my addresses') ||
    lowerMessage.includes('manage addresses') ||
    lowerMessage.includes('address management') ||
    lowerMessage.includes('how to manage my addresses') ||
    lowerMessage.includes('update my addresses') ||
    lowerMessage.includes('edit my addresses') ||
    lowerMessage.includes('address book')
  )
    return { intent: 'manageAddresses', keyword: '' };

  if (
    lowerMessage.includes('delete my account') ||
    lowerMessage.includes('delete account') ||
    lowerMessage.includes('remove my account') ||
    lowerMessage.includes('how to delete my account') ||
    lowerMessage.includes('how to remove my account') ||
    lowerMessage.includes('account deletion') ||
    lowerMessage.includes('close my account')
  )
    return { intent: 'deleteAccount', keyword: '' };

  if (
    lowerMessage.includes('payment methods do you accept') ||
    lowerMessage.includes('payment methods') ||
    lowerMessage.includes('accepted payment methods') ||
    lowerMessage.includes('what payment methods do you have') ||
    lowerMessage.includes('how can i pay') ||
    lowerMessage.includes('payment options') ||
    lowerMessage.includes('ways to pay')
  )
    return { intent: 'paymentMethods', keyword: '' };

  if (
    lowerMessage.includes('use a promo code') ||
    lowerMessage.includes('promo code') ||
    lowerMessage.includes('apply promo code') ||
    lowerMessage.includes('how to use a promo code') ||
    lowerMessage.includes('how to apply promo code') ||
    lowerMessage.includes('discount code') ||
    lowerMessage.includes('using promo code')
  )
    return { intent: 'usePromoCode', keyword: '' };

  if (
    lowerMessage.includes('safe to use my credit card on your site') ||
    lowerMessage.includes('credit card safety') ||
    lowerMessage.includes('is it safe to use credit card') ||
    lowerMessage.includes('is my credit card information secure') ||
    lowerMessage.includes('credit card security') ||
    lowerMessage.includes('protect credit card info') ||
    lowerMessage.includes('using credit card safely')
  )
    return { intent: 'creditCardSafety', keyword: '' };

  if (
    lowerMessage.includes('multiple payment methods for a single purchase') ||
    lowerMessage.includes('multiple payment methods') ||
    lowerMessage.includes('split payment') ||
    lowerMessage.includes('how to use multiple payment methods') ||
    lowerMessage.includes('can i use more than one payment method') ||
    lowerMessage.includes('pay with multiple methods') ||
    lowerMessage.includes('using different payment methods')
  )
    return { intent: 'multiplePaymentMethods', keyword: '' };

  if (
    lowerMessage.includes('apply a gift card to my purchase') ||
    lowerMessage.includes('apply gift card') ||
    lowerMessage.includes('use gift card') ||
    lowerMessage.includes('how to apply gift card') ||
    lowerMessage.includes('how to use a gift card') ||
    lowerMessage.includes('redeem gift card') ||
    lowerMessage.includes('using gift card for purchase')
  )
    return { intent: 'applyGiftCard', keyword: '' };

  if (
    lowerMessage.includes('financing options') ||
    lowerMessage.includes('financing') ||
    lowerMessage.includes('payment plans') ||
    lowerMessage.includes('do you offer financing') ||
    lowerMessage.includes('how to get financing') ||
    lowerMessage.includes('available financing options') ||
    lowerMessage.includes('financing plans')
  )
    return { intent: 'financingOptions', keyword: '' };

  if (
    lowerMessage.includes('invoice for my purchase') ||
    lowerMessage.includes('invoice') ||
    lowerMessage.includes('billing statement') ||
    lowerMessage.includes('get an invoice') ||
    lowerMessage.includes('how to get an invoice') ||
    lowerMessage.includes('request invoice') ||
    lowerMessage.includes('purchase invoice')
  )
    return { intent: 'getInvoice', keyword: '' };

  if (
    lowerMessage.includes('business hours') ||
    lowerMessage.includes('hours') ||
    lowerMessage.includes('working hours') ||
    lowerMessage.includes('what are your business hours') ||
    lowerMessage.includes('what time are you open') ||
    lowerMessage.includes('operating hours') ||
    lowerMessage.includes('store hours')
  )
    return { intent: 'businessHours', keyword: '' };

  if (
    lowerMessage.includes('where are you located') ||
    lowerMessage.includes('location') ||
    lowerMessage.includes('store location') ||
    lowerMessage.includes('your address') ||
    lowerMessage.includes('where is your store') ||
    lowerMessage.includes('store address') ||
    lowerMessage.includes('find your location')
  )
    return { intent: 'location', keyword: '' };

  if (
    lowerMessage.includes('do you have a physical store') ||
    lowerMessage.includes('physical store') ||
    lowerMessage.includes('retail store') ||
    lowerMessage.includes('brick and mortar store') ||
    lowerMessage.includes('where is your physical store') ||
    lowerMessage.includes('do you have a retail location') ||
    lowerMessage.includes('visit your store')
  )
    return { intent: 'physicalStore', keyword: '' };

  if (
    lowerMessage.includes('how can i contact you') ||
    lowerMessage.includes('contact') ||
    lowerMessage.includes('get in touch with you') ||
    lowerMessage.includes('reach you') ||
    lowerMessage.includes('how to contact') ||
    lowerMessage.includes('how do i contact you') ||
    lowerMessage.includes('connect with you')
  )
    return { intent: 'contactInfo', keyword: '' };

  if (
    lowerMessage.includes('ongoing sales or promotions') ||
    lowerMessage.includes('sales promotions') ||
    lowerMessage.includes('current sales') ||
    lowerMessage.includes('current promotions') ||
    lowerMessage.includes('do you have sales') ||
    lowerMessage.includes('what are your promotions') ||
    lowerMessage.includes('discounts available')
  )
    return { intent: 'salesPromotions', keyword: '' };

  if (
    lowerMessage.includes('provide feedback on your service') ||
    lowerMessage.includes('feedback') ||
    lowerMessage.includes('give feedback') ||
    lowerMessage.includes('leave feedback') ||
    lowerMessage.includes('how to provide feedback') ||
    lowerMessage.includes('how to give feedback') ||
    lowerMessage.includes('service feedback')
  )
    return { intent: 'provideFeedback', keyword: '' };

  if (
    lowerMessage.includes('follow you on social media') ||
    lowerMessage.includes('social media') ||
    lowerMessage.includes('find you on social media') ||
    lowerMessage.includes('connect on social media') ||
    lowerMessage.includes('social media accounts') ||
    lowerMessage.includes('how to follow you on social media') ||
    lowerMessage.includes('social media presence')
  )
    return { intent: 'socialMedia', keyword: '' };

  return { intent: 'unknown', keyword: '' };
};

export const generateResponse = async (
  message: string,
  userId: number
): Promise<string> => {
  const { intent, keyword } = identifyIntent(message);

  switch (intent) {
    case 'greeting':
      return 'How can I assist you today?';
    case 'listProducts':
      const products = await getProducts();
      return `We sell the following products: ${products.map((p) => p.name).join(', ')}.`;

      case 'checkProductStock':
        const product = await getProductByName(keyword);
        return product
           ? `Yes, we have ${product.name} in stock.`
            : `Sorry, we do not have ${keyword} in stock.`;
    case 'productDetails':
      const productDetails = await getProductDetails(keyword);
      return productDetails
        ? `Sure, here is more information about ${keyword}: ${productDetails.longDesc}. This product, features an average rating of ${productDetails.averageRating}. It is currently ${productDetails.isAvailable ? 'available' : 'unavailable'} and is priced at $${productDetails.salesPrice} (regular price: $${productDetails.regularPrice}).`
        : `Sorry, we couldn't find detailed information about ${keyword}. It might not exist or there might be a typo in the product name.`;
       
    case 'productPrice':
      const productprice = await getProductByName(keyword);
      return productprice
        ? `The price of ${productprice.name} is $${productprice.salesPrice}.`
        : `Sorry, we do not have pricing information for ${keyword}.`;
        case 'listProductCategories':
          const categories = await getProductCategories();
          return `We offer the following product categories: ${categories.map((c) => c.name).join(', ')}.`;

    case 'productReview':
      const reviews = await getProductReviews(keyword);
      if (reviews && reviews.length > 0) {
        const reviewsText = reviews
          .map((review) => `${review.rating} stars: ${review.content}`)
          .join('; ');
        return `The reviews for ${keyword} are: ${reviewsText}.`;
      } else {
        return `Sorry, there are no reviews for ${keyword}.`;
      }

    case 'similarProducts':
      const similarProducts = await getProducts();
      return similarProducts
        ? `Here are some products similar to ${keyword}: ${similarProducts.map((p) => p.name).join(', ')}`
        : `Sorry, we do not have similar products to ${keyword}.`;

    case 'bestSellingProduct':
      const bestSellingProducts = await getProducts();
      return bestSellingProducts
        ? `The best-selling product in ${keyword} is ${bestSellingProducts[0].name}.`
        : `Sorry, we do not have best-selling products information for ${keyword}.`;

    case 'getCartItems':
      const cartItems = await getCartItems(userId);
      return `Your cart contains the following items: ${cartItems
        .map((item) => `${item.product.name} (${item.quantity})`)
        .join(', ')}`;

    case 'getCartTotal':
      const totalAmount = await getTotalCartAmount(userId);
      return `The total cost of the items in your cart is $${totalAmount.toFixed(
        2
      )}`;

    case 'canAddToCart':
      return 'Yes, you can add more items to your cart.';

    case 'getCartItemQuantity':
      const quantity = await getCartItemQuantity(userId);
      return `You have ${quantity} items remaining in your cart.`;

    case 'updateCartQuantity':
      return 'To update the quantity of an item in your cart, please go to your cart page and adjust the quantity as needed.';

    case 'removeCartItem':
      return 'To remove an item from your cart, please go to your cart page and click the remove button next to the item you want to remove.';

    case 'handleCartRemoval':
      return 'If you remove an item from your cart, the total cost of your cart will be updated to reflect the change.';

    case 'saveCart':
      return 'Unfortunately, we do not currently have the functionality to save your cart for later use. Please complete your purchase or remove items from your cart as needed.';
    case 'orderStatus':
      const orderStatus = await getOrderStatusByTrackingNumber(keyword);
      return orderStatus
        ? `The status of your order with tracking number ${keyword} is: ${orderStatus}.`
        : `I'm sorry, but I couldn't find an order with the tracking number ${keyword}.`;

    case 'cancelOrder':
      return 'To cancel your order on our website, please follow these steps: First, log in to your account using your credentials. Next, navigate to the  Order History  section, where you can view a list of your recent orders. Identify the order you wish to cancel and select the option to cancel it. If the order is eligible for cancellation, you will be prompted to confirm your decision. Once confirmed, your order will be canceled, and you will receive a confirmation message. If you encounter any difficulties or have any questions during the process, please don not hesitate to contact our customer support team for assistance';

    case 'returnOrder':
      return 'To return your order, first check the company return policy on their website or your order receipt to understand the requirements and return window. Ensure the items are in the required condition, typically unused and in original packaging. Log in to your account on the company’s website, go to the Order History or My Orders section, and initiate the return process by following the provided instructions, which may include printing a return shipping label. Pack the items securely, attach the return label, and drop off the package at the designated shipping location. Use the tracking number to monitor the return, and once the company receives and processes it, expect a refund within a few days to several weeks. If you need help, contact customer service';

    case 'changeOrderAddress':
      return ' To change the delivery address of your order, follow these steps: First, ensure you are logged into your account on our website. Then, navigate to the  Account Settings  section, where you will find options to manage your order details. Locate the specific order for which you would like to update the delivery address. Once you have identified the order, you should see an option to modify the delivery information. Click on this option, and you will be prompted to enter the new delivery address. Finally, review the changes carefully before confirming to ensure accuracy. If you encounter any difficulties or need further assistance, dot hesitate to reach out to our customer support team for guidance and contacting our customer support.';

    case 'orderShipped':
      const shippedOrder = await getOrderStatusByTrackingNumber(
        userId.toString()
      );
      return shippedOrder
        ? 'To find shipping information for your requested service, please follow these guidelines: Navigate to Checkout: Proceed to the checkout page by adding your desired service to the cart and clicking on the Checkout button.Then, Provide Delivery Information: Enter your shipping address and any additional delivery instructions in the designated fields. Ensure that all details are accurate to avoid any delays or delivery issues.Select Shipping Method: During the checkout process, you will be prompted to choose a shipping method. Select the option that best suits your preferences and delivery timeline.Review Order Summary: Before finalizing your order, review the summary to ensure that all information, including shipping details and costs, is correct. Make any necessary adjustments if needed.Then Place Your Order: Once you are satisfied with the shipping information provided, proceed to place your order. Upon completion, you will receive a confirmation email with your order details and shipping information.'
        : 'Sorry, we could not find any shipping information for your account.';

    case 'addItemsToOrder':
      return 'Yes, you can often add items to an existing order, but this ability depends on the store is policies and the order is status. If your order has not yet been processed or shipped, most stores allow modifications through your online account or by contacting customer service. Some stores might still permit changes after processing but before shipment, requiring more direct intervention from customer service. Once the order has shipped, adding items is generally not possible, necessitating a new order for additional items. To add items, check your order status online, modify it through your account if possible, or contact customer service with your order number and the desired items. Policies vary between companies, so always check the specific policies of the store you are ordering from to understand their process for modifying orders';

    case 'returnPolicy':
      return 'Our return policy allows you to return products within 30 days of purchase. Please ensure the items are in their original condition.';

    case 'requestRefund':
      return 'To request a refund, please contact our customer support with your order details.';

    case 'shippingCharges':
      return 'Shipping charges depend on your location and the shipping method selected. You can view the charges at checkout.';

    case 'expediteShipping':
      return 'Yes, we offer expedited shipping options at checkout. Please select the expedited shipping method during the checkout process.';

    case 'listServices':
      const services = await getServices();
      return `We offer the following services: ${services.map((s) => s.name).join(', ')}.`;
    case 'giftWrapping':
      return 'Yes, we offer gift wrapping services at an additional cost. You can select this option during checkout.';

    case 'scheduleDelivery':
      return 'Yes, you can schedule a delivery date during the checkout process.';

    case 'installationServices':
      const service = await getServiceByName(keyword);
      return service
        ? `Yes, we offer installation services for ${keyword}.`
        : `Sorry, we do not offer installation services for ${keyword}.`;

    case 'internationalShipping':
      return 'Yes, we offer international shipping. Please select your destination country during checkout to see the available options.';

    case 'shippingOptions':
      return 'We offer standard, expedited, and international shipping options. Please choose your preferred method during checkout.';

    case 'createWishlist':
      return 'To create a wishlist of your requested services, log in to your account on our website to access your personalized wishlist page. Navigate to the services section, where you can browse through our offerings and select the services you are interested in adding to your wishlist. For each service you wish to add, click on the  Add to Wishlist  button or icon located near the service description. Once you have added all desired services to your wishlist, you can view and manage them by accessing your wishlist from your account dashboard. In your wishlist, you will be able to review the selected services, make any changes if needed, and proceed to request or purchase them at your convenience';

    case 'customerSupport':
      return 'To get customer support, simply contact our team via phone, email, on our website. For immediate assistance, send an email to dynamitesecommerce@gmail.com, or start a live chat session. Our support operates Monday to sunday, from 9 AM to 6 PM. Depending on your concern, our team will guide you through the appropriate steps or provide relevant information. Expect prompt and personalized assistance tailored to your needs. Your feedback is valuable, so feel free to share any suggestions after interacting with our team. We are dedicated to improving our support services to better serve you';

    case 'contactSupport':
      return 'You can Text us to our email at dynamitesecommerce@gmail.com, or live chat on our website.';

    case 'customerServiceHours':
      return 'Our customer service hours are 9 AM to 6 PM, Monday to Friday.';

    case 'loyaltyProgram':
      return 'Yes, we offer a loyalty program where you can earn points for every purchase and redeem them for discounts on future orders.';

    case 'newsletterSignUp':
      return 'You can sign up for our newsletter on our website to receive updates on new products, promotions, and special offers.';

    case 'createAccount':
      return 'To sign up for our services, visit our website homepage and click on the Sign Up or Register option. You will be directed to a registration form where you will need to provide essential details such as your name, email address, and password. After filling out the required information, review it for accuracy, and then click on the  Sign Up  or  Register  button to proceed. Once registered, you may receive a confirmation email containing a verification link according your user type like vendor or buyer; click on the link to verify your email address and complete the sign-up process. By following these steps, you will successfully create an account, gaining access to our range of services and features. If you encounter any issues, our customer support team is available to assist you.';

    case 'logInAccount':
      return 'To log in to your account, click on the Log In button on our website and enter your email and password.';

    case 'resetPassword':
      return 'To reset your password, click on the  Forgot Password  link on the login page and follow the instructions.';

    case 'updateAccountInfo':
      return 'To update your account information, log in to your account and go to the  Account Settings  section.';

    case 'viewOrderHistory':
      return 'To view your order history, log in to your account and go to the  Order History  section.';

    case 'manageAddresses':
      return 'To manage your addresses, log in to your account and go to the  Address Book  section.';

    case 'deleteAccount':
      return 'To delete your account, please contact our customer support and they will assist you with the process.';

    case 'paymentMethods':
      return 'We accept Visa, MasterCard, Credit Card,MOMO payment, PayPal, and gift cards.';

    case 'usePromoCode':
      return 'To use a promo code, enter the code at checkout in the  Promo Code  field and the discount will be applied to your order.';

    case 'creditCardSafety':
      return 'Yes, it is safe to use your credit card on our site. We use secure encryption to protect your personal information.';

    case 'multiplePaymentMethods':
      return 'Yes, you can use multiple payment methods for a single purchase by selecting  Split Payment  at checkout.';

    case 'applyGiftCard':
      return 'To apply a gift card to your purchase, enter the gift card number at checkout in the  Gift Card  field.';

    case 'financingOptions':
      return 'Yes, we offer financing options through our partner, Affirm. You can select Affirm at checkout to apply for financing.';

    case 'getInvoice':
      return 'Yes, you can get an invoice for your purchase by logging into your account and going to the  Order History  section.';

    case 'businessHours':
      return 'Our business hours are 24 weekly hours, Monday to Sunday.';

    case 'location':
      return 'We are located online and wherever you are around the world.';

    case 'physicalStore':
      return 'Yes, we have a physical store located in every country you belong too.';

    case 'contactInfo':
      return 'You can contact email at dynamitesecommerce@gmail.com, or live chat on our website.';

    case 'salesPromotions':
      return 'Yes, we have ongoing sales and promotions. Please visit our website and check the  Promotions  section for the latest offers.';

    case 'provideFeedback':
      return 'You can provide feedback on our service by filling out the feedback form on our website or contacting our customer support.';

    case 'socialMedia':
      return 'Yes, you can follow us on social media. Here are mostly use, like: Facebook, Twitter, Instagram.';

    default:
      return 'I am sorry, I did not understand your request. Can you please provide more details?';
  }
};
