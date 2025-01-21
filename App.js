import React, { useState, useEffect } from 'react';
import { FlatList, StatusBar, Text, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';

// Store the original data
let originalData = [];

const App = () => {
    const [myData, setMyData] = useState([]);
    const [searchText, setSearchText] = useState(''); // Store search text
    const [isAscending, setIsAscending] = useState(true); // Track sorting order

    // Fetch the data on component mount
    useEffect(() => {
        fetch("https://mysafeinfo.com/api/data?list=oscarwinningmovies&format=json&case=default")
            .then((response) => response.json())
            .then((data) => {
                console.log(data); // Log the fetched data for debugging
                if (originalData.length === 0) {
                    originalData = data; // Store original data
                    setMyData(data); // Set state to display data
                }
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    // Filter the data based on the input text
    const filterData = (text) => {
        setSearchText(text); // Save the search text
        if (text) {
            const filteredData = originalData.filter((item) =>
                item.Title.toLowerCase().includes(text.toLowerCase()) ||
                item.Director.toLowerCase().includes(text.toLowerCase())
            );
            setMyData(filteredData);
        } else {
            setMyData(originalData);
        }
    };

    // Sort the current displayed data
    const sortData = (criteria) => {
        let sortedData = [...myData]; // Copy the currently displayed data
        if (criteria === 'year') {
            // Toggle sorting order
            setIsAscending(!isAscending);
            if (isAscending) {
                sortedData.sort((a, b) => parseInt(a.Released) - parseInt(b.Released)); // Ascending
            } else {
                sortedData.sort((a, b) => parseInt(b.Released) - parseInt(a.Released)); // Descending
            }
        } else if (criteria === 'director') {
            sortedData.sort((a, b) => a.Director.localeCompare(b.Director)); // Sort alphabetically by director
        }
        setMyData(sortedData); // Update the displayed list
    };

    // Render each item in the list
    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.ribbon} />
            <Text style={styles.title}>{item.Title}</Text>
            <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>📅 Year:</Text>
                    <Text style={styles.detailValue}>{item.Released}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>🎬 Director:</Text>
                    <Text style={styles.detailValue}>{item.Director}</Text>
                </View>
            </View>
            <View style={styles.decorativeLine} />
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar />
            <Text style={styles.header}>Oscar-Winning Movies</Text>

            {/* Search Box */}
            <TextInput
                style={styles.searchBox}
                placeholder="Search by title or director..."
                placeholderTextColor="#ffffff"
                value={searchText}
                onChangeText={filterData}
            />

            {/* Sorting Options */}
            <View style={styles.sortContainer}>
                <TouchableOpacity
                    style={styles.sortButton}
                    onPress={() => sortData('year')}
                >
                    <Text style={styles.sortButtonText}>
                        Sort by Year {isAscending ? '▲' : '▼'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.sortButton}
                    onPress={() => sortData('director')}
                >
                    <Text style={styles.sortButtonText}>Sort by Director</Text>
                </TouchableOpacity>
            </View>

            {/* Remove Filters Button */}
            <TouchableOpacity style={styles.removeFiltersButton} onPress={() => setMyData(originalData)}>
                <Text style={styles.removeFiltersText}>Remove Filters</Text>
            </TouchableOpacity>

            {/* Movie List */}
            <FlatList
                data={myData}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000', // Pure black background
        padding: 15,
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#DAA520', // Gold for the header
        marginBottom: 25,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    searchBox: {
        borderWidth: 2,
        borderColor: '#DAA520', // Gold border
        backgroundColor: '#1c1c1c', // Subtle black background
        color: '#ffffff', // White text
        borderRadius: 30,
        padding: 14,
        fontSize: 16,
        marginBottom: 20,
        shadowColor: '#DAA520',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
    },
    sortContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    sortButton: {
        backgroundColor: '#DAA520', // Gold background for buttons
        borderRadius: 20,
        padding: 10,
        paddingHorizontal: 20,
        shadowColor: '#DAA520',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
    },
    sortButtonText: {
        color: '#000000', // Black text for contrast
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
    },

    removeFiltersButton: {
        backgroundColor: '#DAA520', // Gold button background
        borderRadius: 20,
        padding: 10,
        marginBottom: 20,
        alignSelf: 'center',
        shadowColor: '#DAA520',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 5,
    },
    removeFiltersText: {
        color: '#000000', // Black text for contrast
        fontWeight: 'bold',
        fontSize: 16,
    },
    itemContainer: {
        padding: 20,
        marginBottom: 15,
        backgroundColor: '#1A1A1A', // Darker black for contrast
        borderRadius: 20, // Smooth rounded edges
        borderWidth: 1.5,
        borderColor: '#DAA520', // Metallic gold border
        shadowColor: '#DAA520',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 10,
        position: 'relative',
    },
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
        backgroundColor: 'rgba(218, 165, 32, 0.05)', // Subtle gold overlay
        borderRadius: 20, // Match container's border radius
        zIndex: -1, // Place it behind content
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#DAA520', // Gold text
        marginBottom: 8,
        textShadowColor: 'rgba(218, 165, 32, 0.7)', // Glowing effect
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    details: {
        fontSize: 16,
        color: '#D3D3D3', // Light gray for readability
        marginBottom: 5,
    },
    detailsContainer: {
        marginTop: 10,
    },
    detailRow: {
        flexDirection: 'row', // Arrange label and value in a row
        alignItems: 'center',
        marginBottom: 5,
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#DAA520', // Gold label
        marginRight: 8,
    },
    detailValue: {
        fontSize: 16,
        color: '#D3D3D3', // Silver for values
        fontWeight: '500',
    },
    decorativeLine: {
        height: 3,
        backgroundColor: '#DAA520', // Gold line for decoration
        borderRadius: 2,
        marginTop: 12,
        width: '50%',
        alignSelf: 'center',
    },

});

export default App;
