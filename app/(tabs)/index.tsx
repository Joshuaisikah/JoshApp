import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, View, Text, StatusBar, Alert } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Product, apiService } from '../../services/ApiService';

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch products from the API
  const fetchProducts = async (pageNum: number, refresh = false) => {
    console.log(`Fetching products for page ${pageNum}...`);
    
    refresh ? setRefreshing(true) : setIsLoading(true);
    setError(null);
    
    try {
      // Use a fixed limit per page as specified in the requirements
      const limit = 10;
      
      // Call the API service to fetch products
      const response = await apiService.fetchProducts(pageNum, limit);
      
      // Log the response for debugging
      console.log(`Successfully fetched ${response.products.length} products`);
      
      // Update state with fetched products
      if (pageNum === 1 || refresh) {
        console.log('Setting initial products');
        setProducts(response.products);
      } else {
        console.log('Appending more products');
        setProducts(prevProducts => [...prevProducts, ...response.products]);
      }
      
      // Check if we have more products to load
      const hasMoreItems = response.total > (response.skip + response.limit);
      setHasMore(hasMoreItems);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(`Failed to load products: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log('Home screen mounted, fetching products...');
    fetchProducts(1);
  }, []);
  
  // Log products state changes for debugging
  useEffect(() => {
    console.log(`Products state updated: ${products.length} products in state`);
  }, [products]);

  const handleLoadMore = () => {
    if (!isLoading && !refreshing && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  };

  const handleRefresh = () => {
    if (!isLoading) {
      setPage(1);
      fetchProducts(1, true);
    }
  };
  
  // Handle the Next button press - required by instructions
  const handleNextPage = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.thumbnail}
        contentFit="cover"
        transition={300}
        placeholder={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' }}
      />
      <View style={styles.badgesContainer}>
        {item.discountPercentage && item.discountPercentage > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{Math.round(item.discountPercentage)}% OFF</Text>
          </View>
        )}
        {item.availabilityStatus === 'Low Stock' && (
          <View style={[styles.discountBadge, styles.stockBadge]}>
            <Text style={styles.discountText}>Low Stock</Text>
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardCategory}>{item.category}</Text>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
        
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 2).map((tag, index) => (
              <Text key={index} style={styles.tagText}>{tag}</Text>
            ))}
          </View>
        )}
        
        <View style={styles.cardFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
          </View>
          {item.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FFB800" />
              <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
              {item.stock !== undefined && (
                <Text style={styles.stockText}>Stock: {item.stock}</Text>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Products</Text>
        <Text style={styles.headerSubtitle}>Browse our latest products</Text>
      </View>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => fetchProducts(1)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            onRefresh={handleRefresh}
            refreshing={refreshing}
            ListFooterComponent={() => (
              isLoading && !refreshing ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#0066cc" />
                  <Text style={styles.loadingText}>Loading products...</Text>
                </View>
              ) : null
            )}
            ListEmptyComponent={() => (
              !isLoading ? (
                <View style={styles.empty}>
                  <Ionicons name="basket-outline" size={60} color="#999" />
                  <Text style={styles.emptyText}>No products found</Text>
                </View>
              ) : null
            )}
          />
          
          {/* Next button for pagination as required by instructions */}
          {products.length > 0 && hasMore && (
            <TouchableOpacity 
              style={styles.loadMoreButton}
              onPress={handleNextPage}
              disabled={isLoading}
            >
              <Text style={styles.loadMoreText}>Next Page</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e78b7',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  list: {
    padding: 12,
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: '#eee',
  },
  badgesContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    gap: 5,
  },
  discountBadge: {
    backgroundColor: '#e74c3c',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  stockBadge: {
    backgroundColor: '#f39c12',
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardContent: {
    padding: 16,
  },
  cardCategory: {
    fontSize: 12,
    color: '#2e78b7',
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceContainer: {
    backgroundColor: '#f0f7ff',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e78b7',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: '500',
    color: '#666',
    marginRight: 8,
  },
  stockText: {
    fontSize: 12,
    color: '#999',
  },
  empty: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  loaderContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  loadMoreButton: {
    backgroundColor: '#2e78b7',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
    shadowColor: '#2e78b7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  loadMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  retryButton: {
    backgroundColor: '#2e78b7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  endOfListContainer: {
    alignItems: 'center',
    padding: 20,
  },
  endOfListText: {
    color: '#999',
    fontSize: 14,
  },
});
