import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import fenceDataStore from '../services/fenceDataStore';
import { FenceDto } from '../services/types/fence';

type FenceItem = Pick<FenceDto, 'FenceID' | 'FenceName' | 'FenceStatus'> & {
    Numberofequipment: number;
    IsUnfold: boolean;
}

export default function FenceList() {
    const router = useRouter();
    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [items, setItems] = useState<FenceItem[]>([]);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [searchText, setSearchText] = useState('');
    const currentPage = useRef(1);
    const hasInitialLoad = useRef(false);
    const pageSize = 20;

    const loadItems = useCallback(async (refresh = false) => {
        if (isLoading) return;
        
        // For non-refresh loads, check if we should load more
        if (!refresh && !hasNextPage) return;

        try {
            setIsLoading(true);
            if (refresh) {
                currentPage.current = 1;
                setHasNextPage(true);
            }

            const response = await fenceDataStore.getFenceListByModel({
                fenceId: '',
                model: [],
                eqptType: [],
                serialNumbers: '',
                contains: ''
            });
            const newItems = (response.items || []).map(item => ({
                FenceID: item.FenceID,
                FenceName: item.FenceName,
                FenceStatus: item.FenceStatus || '',
                Numberofequipment: item.Numberofequipment || 0,
                IsUnfold: item.IsUnfold || false,
            }));
            
            if (refresh) {
                setItems(newItems);
            } else {
                setItems(prev => [...prev, ...newItems]);
            }
            
            setHasNextPage(newItems.length === pageSize);
            if (!refresh) {
                currentPage.current += 1;
            }
        } catch (error) {
            console.error('Error loading fences:', error);
            Alert.alert('Error', 'Failed to load fences');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [searchText]); // Remove isLoading and hasNextPage from dependencies

    useEffect(() => {
        if (isFocused && !hasInitialLoad.current) {
            hasInitialLoad.current = true;
            loadItems(true);
        }
    }, [isFocused, loadItems]);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        hasInitialLoad.current = false; // Reset initial load flag for manual refresh
        loadItems(true);
    }, [loadItems]);

    const onEndReached = useCallback(() => {
        if (hasNextPage && !isLoading) {
            loadItems();
        }
    }, [hasNextPage, isLoading, loadItems]);

    const handleSearch = useCallback((text: string) => {
        setSearchText(text);
        setHasNextPage(true);
        hasInitialLoad.current = false; // Reset initial load flag for new search
        loadItems(true);
    }, [loadItems]); 

    const handleMapPress = useCallback(() => {
        router.push('/fence/map' as any);
    }, [router]);

    const handleCreatePress = useCallback(async () => {
        try {
            const response = await fenceDataStore.checkFenceNumber();
            const fenceCount = response.items.length;
            
            if (fenceCount >= 10) {
                Alert.alert('Notice', 'Maximum number of fences reached');
                return;
            }
            router.push('/fence/create' as any);
        } catch (error) {
            console.error('Error checking fence count:', error);
            Alert.alert('Error', 'Failed to check fence count');
        }
    }, [router]);

    const renderItem = useCallback(({ item }: { item: FenceItem }) => (
        <TouchableOpacity 
            style={styles.itemContainer}
            onPress={() => router.push(`/fence/${item.FenceID}` as any)}
        >
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.FenceName}</Text>
                <View style={styles.itemDetails}>
                    <Text style={styles.itemStatus}>Status: {item.FenceStatus || 'N/A'}</Text>
                    <Text style={styles.itemCount}>Equipment: {item.Numberofequipment}</Text>
                </View>
            </View>
            <View style={styles.itemArrow}>
                <Text>›</Text>
            </View>
        </TouchableOpacity>
    ), [router]);

    const renderFooter = useCallback(() => {
        if (!isLoading) return null;
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }, [isLoading]);

    const renderEmpty = useCallback(() => {
        if (isLoading) return null;
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No fences found</Text>
            </View>
        );
    }, [isLoading]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search..."
                    value={searchText}
                    onChangeText={handleSearch}
                />
                <TouchableOpacity onPress={handleMapPress} style={styles.iconButton}>
                    <Text>Map</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={item => item.FenceID}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                    />
                }
            />

            <TouchableOpacity 
                style={styles.fabButton}
                onPress={handleCreatePress}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        padding: 8,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    searchBar: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginRight: 8,
    },
    iconButton: {
        padding: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    itemContainer: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    itemDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemStatus: {
        fontSize: 14,
        color: '#666',
    },
    itemCount: {
        fontSize: 14,
        color: '#666',
    },
    itemArrow: {
        justifyContent: 'center',
        paddingLeft: 8,
    },
    loaderContainer: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
    fabButton: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    fabText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
});