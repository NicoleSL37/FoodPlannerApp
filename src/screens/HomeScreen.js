import React, { useContext, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import RecipeCard from '../components/RecipeCard';

export default function HomeScreen({ navigation }) {
    const { userName } = useContext(UserContext);
    const [selectedCategory, setSelectedCategory] = useState('Desayuno');

    const handleRecipePress = () => {
        navigation.navigate('RecipeDetail');
    };

    return (
        <View style={styles.rootContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header Superior */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>¡Hola, {userName}!</Text>
                        <Text style={styles.subGreeting}>¿Qué cocinaremos hoy?</Text>
                    </View>
                    <TouchableOpacity style={styles.settingsButton}>
                        <Feather name="settings" size={18} color="#3E2723" />
                    </TouchableOpacity>
                </View>

                {/* Barra de Búsqueda */}
                <View style={styles.searchContainer}>
                    <Feather name="search" size={16} color="rgba(62, 39, 35, 0.4)" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Buscar recetas, ingredientes..."
                        placeholderTextColor="rgba(62, 39, 35, 0.4)"
                        style={styles.searchInput}
                    />
                </View>

                {/* Filtros de Categoría Interactivos */}
                <View style={styles.categoriesRow}>
                    {['Desayuno', 'Almuerzo', 'Cena', 'Postre'].map((cat, index) => {
                        const isSelected = selectedCategory === cat;
                        return (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.categoryChip,
                                    isSelected && styles.categoryChipActive
                                ]}
                                onPress={() => setSelectedCategory(cat)}
                            >
                                <Text style={[
                                    styles.categoryChipText,
                                    isSelected && styles.categoryChipTextActive
                                ]}>
                                    {cat}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Sección de Recetas Recomendadas usando el Componente Reutilizable */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recetas Recomendadas</Text>
                        <TouchableOpacity>
                            <Text style={styles.seeAllText}>Ver todas</Text>
                        </TouchableOpacity>
                    </View>

                    <RecipeCard
                        title="Bowl de Avena con Frutas y Chía"
                        time="15 min"
                        calories="320 kcal"
                        tag="Saludable"
                        icon="coffee"
                        category="Desayuno"
                        onViewRecipe={handleRecipePress}
                    />

                    <RecipeCard
                        title="Tostadas de Aguacate y Huevo Poché"
                        time="10 min"
                        calories="280 kcal"
                        tag="Energético"
                        icon="sun"
                        category="Almuerzo"
                        onViewRecipe={handleRecipePress}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        width: '100%',
        maxWidth: 380,
        height: 800,
        minHeight: 800,
        maxHeight: 800,
        alignSelf: 'center',
        backgroundColor: '#FDFBF7',
        overflow: 'hidden',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 12,
    },
    greeting: {
        fontSize: 22,
        fontWeight: '800',
        color: '#3E2723',
    },
    subGreeting: {
        fontSize: 12,
        fontWeight: '600',
        color: '#3E2723',
        opacity: 0.6,
        marginTop: 2,
    },
    settingsButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#EAE6DF',
        borderWidth: 1,
        borderColor: '#DDD8CE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchContainer: {
        marginHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EAE6DF',
        borderRadius: 16,
        paddingHorizontal: 14,
        height: 46,
        marginTop: 8,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 13,
        color: '#3E2723',
        fontWeight: '500',
    },
    categoriesRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 14,
        justifyContent: 'space-between',
    },
    categoryChip: {
        backgroundColor: '#EAE6DF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
    categoryChipActive: {
        backgroundColor: '#84A98C',
    },
    categoryChipText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#3E2723',
    },
    categoryChipTextActive: {
        color: '#FFFFFF',
    },
    sectionContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#3E2723',
    },
    seeAllText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#84A98C',
    },
});