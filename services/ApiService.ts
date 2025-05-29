// Complete product interface based on dummyjson API response
export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category?: string;
  thumbnail: string;
  images?: string[];
  tags?: string[];
  sku?: string;
  weight?: number;
  dimensions?: Dimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: Review[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: Meta;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Actual API response data
const API_RESPONSE = {"products":[{"id":1,"title":"Essence Mascara Lash Princess","description":"The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.","category":"beauty","price":9.99,"discountPercentage":10.48,"rating":2.56,"stock":99,"tags":["beauty","mascara"],"brand":"Essence","sku":"BEA-ESS-ESS-001","weight":4,"dimensions":{"width":15.14,"height":13.08,"depth":22.99},"warrantyInformation":"1 week warranty","shippingInformation":"Ships in 3-5 business days","availabilityStatus":"In Stock","reviews":[{"rating":3,"comment":"Would not recommend!","date":"2025-04-30T09:41:02.053Z","reviewerName":"Eleanor Collins","reviewerEmail":"eleanor.collins@x.dummyjson.com"},{"rating":4,"comment":"Very satisfied!","date":"2025-04-30T09:41:02.053Z","reviewerName":"Lucas Gordon","reviewerEmail":"lucas.gordon@x.dummyjson.com"},{"rating":5,"comment":"Highly impressed!","date":"2025-04-30T09:41:02.053Z","reviewerName":"Eleanor Collins","reviewerEmail":"eleanor.collins@x.dummyjson.com"}],"returnPolicy":"No return policy","minimumOrderQuantity":48,"meta":{"createdAt":"2025-04-30T09:41:02.053Z","updatedAt":"2025-04-30T09:41:02.053Z","barcode":"5784719087687","qrCode":"https://cdn.dummyjson.com/public/qr-code.png"},"images":["https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp"],"thumbnail":"https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp"},{"id":2,"title":"Eyeshadow Palette with Mirror","description":"The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it's convenient for on-the-go makeup application.","category":"beauty","price":19.99,"discountPercentage":18.19,"rating":2.86,"stock":34,"tags":["beauty","eyeshadow"],"brand":"Glamour Beauty","sku":"BEA-GLA-EYE-002","weight":9,"dimensions":{"width":9.26,"height":22.47,"depth":27.67},"warrantyInformation":"1 year warranty","shippingInformation":"Ships in 2 weeks","availabilityStatus":"In Stock","reviews":[{"rating":5,"comment":"Great product!","date":"2025-04-30T09:41:02.053Z","reviewerName":"Savannah Gomez","reviewerEmail":"savannah.gomez@x.dummyjson.com"},{"rating":4,"comment":"Awesome product!","date":"2025-04-30T09:41:02.053Z","reviewerName":"Christian Perez","reviewerEmail":"christian.perez@x.dummyjson.com"},{"rating":1,"comment":"Poor quality!","date":"2025-04-30T09:41:02.053Z","reviewerName":"Nicholas Bailey","reviewerEmail":"nicholas.bailey@x.dummyjson.com"}],"returnPolicy":"7 days return policy","minimumOrderQuantity":20,"meta":{"createdAt":"2025-04-30T09:41:02.053Z","updatedAt":"2025-04-30T09:41:02.053Z","barcode":"9170275171413","qrCode":"https://cdn.dummyjson.com/public/qr-code.png"},"images":["https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/1.webp"],"thumbnail":"https://cdn.dummyjson.com/product-images/beauty/eyeshadow-palette-with-mirror/thumbnail.webp"},{"id":3,"title":"Powder Canister","description":"The Powder Canister is a finely milled setting powder designed to set makeup and control shine. With a lightweight and translucent formula, it provides a smooth and matte finish.","category":"beauty","price":14.99,"discountPercentage":9.84,"rating":4.64,"stock":89,"tags":["beauty","face powder"],"brand":"Velvet Touch","sku":"BEA-VEL-POW-003","weight":8,"dimensions":{"width":29.27,"height":27.93,"depth":20.59},"warrantyInformation":"3 months warranty","shippingInformation":"Ships in 1-2 business days","availabilityStatus":"In Stock","reviews":[{"rating":4,"comment":"Would buy again!","date":"2025-04-30T09:41:02.053Z","reviewerName":"Alexander Jones","reviewerEmail":"alexander.jones@x.dummyjson.com"},{"rating":5,"comment":"Highly impressed!","date":"2025-04-30T09:41:02.053Z","reviewerName":"Elijah Cruz","reviewerEmail":"elijah.cruz@x.dummyjson.com"},{"rating":1,"comment":"Very dissatisfied!","date":"2025-04-30T09:41:02.053Z","reviewerName":"Avery Perez","reviewerEmail":"avery.perez@x.dummyjson.com"}],"returnPolicy":"No return policy","minimumOrderQuantity":22,"meta":{"createdAt":"2025-04-30T09:41:02.053Z","updatedAt":"2025-04-30T09:41:02.053Z","barcode":"8418883906837","qrCode":"https://cdn.dummyjson.com/public/qr-code.png"},"images":["https://cdn.dummyjson.com/product-images/beauty/powder-canister/1.webp"],"thumbnail":"https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp"}],"total":194,"skip":0,"limit":30};

// Extract products array from the API response
const MOCK_PRODUCTS: Product[] = API_RESPONSE.products;

class ApiService {
  private useMockData = true; // Always use mock data since we have the full API response

  // Full API response data with all products
  private fullApiResponse = API_RESPONSE;

  // Debug method to check network connectivity - always returns true since we're using mock data
  async checkConnection(): Promise<boolean> {
    console.log('Checking API connection - returning true for mock data');
    return this.useMockData || true; // Always return true for mock data
  }

  // Get products with pagination from our predefined API response
  getMockProducts(page: number, limit: number): ProductsResponse {
    const skip = (page - 1) * limit;
    const allProducts = this.fullApiResponse.products;
    const paginatedProducts = allProducts.slice(skip, skip + limit);
    
    console.log(`Getting products. Page: ${page}, Limit: ${limit}, Products: ${paginatedProducts.length}`);
    
    return {
      products: paginatedProducts,
      total: this.fullApiResponse.total, // Use the total from the API response
      skip: skip,
      limit: limit
    };
  }

  // This method makes a direct API request to dummyjson.com
  async fetchProducts(page: number = 1, limit: number = 10): Promise<ProductsResponse> {
    console.log(`Fetching products from API for page ${page} with limit ${limit}`);
    
    try {
      // Calculate skip value for pagination
      const skip = (page - 1) * limit;
      
      // First try the actual API request
      try {
        // Make a direct API request to dummyjson.com
        const url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
        console.log(`Making API request to: ${url}`);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`API response received with ${data.products?.length || 0} products`);
        
        return data as ProductsResponse;
      } catch (networkError) {
        // If the API request fails, fall back to mock data
        console.warn('API request failed, falling back to mock data:', networkError);
        return this.getMockProducts(page, limit);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // As a last resort, return mock data
      return this.getMockProducts(page, limit);
    }
  }
  
  // Method to get a single product by ID
  async getProductById(id: number): Promise<Product | null> {
    console.log(`Fetching product with ID: ${id}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const product = this.fullApiResponse.products.find(p => p.id === id);
      return product || null;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      return null;
    }
  }
  
  // Method to get products by category
  async getProductsByCategory(category: string, page: number = 1, limit: number = 10): Promise<ProductsResponse> {
    console.log(`Fetching products in category: ${category}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const filteredProducts = this.fullApiResponse.products.filter(p => p.category === category);
      const skip = (page - 1) * limit;
      const paginatedProducts = filteredProducts.slice(skip, skip + limit);
      
      return {
        products: paginatedProducts,
        total: filteredProducts.length,
        skip: skip,
        limit: limit
      };
    } catch (error) {
      console.error(`Error fetching products in category ${category}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const apiService = new ApiService();
