/**
 * 🏟️ CARD DE QUADRA
 * 
 * Componente que exibe informações de uma quadra esportiva.
 * Mostra foto, nome, endereço e botão de agendar.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import CustomButton from './CustomButton';

/**
 * PROPS:
 * @param {object} court - Dados da quadra (do mockData.js)
 * @param {function} onPress - Função ao clicar no card
 * @param {function} onSchedulePress - Função ao clicar em "Agendar"
 */
export default function CourtCard({ court, onPress, onSchedulePress }) {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: colors.surface }]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* Imagem da quadra */}
            <View style={[styles.imageContainer, { backgroundColor: colors.border }]}>
                {/* O backend não manda imagem/emoji ainda, então fallback */}
                <Text style={styles.image}>{court.image || '🏟️'}</Text>

                {/* Badge de disponibilidade */}
                {court.available === false && (
                    <View style={[styles.unavailableBadge, { backgroundColor: colors.error }]}>
                        <Text style={styles.unavailableText}>Indisponível</Text>
                    </View>
                )}
            </View>

            {/* Informações da quadra */}
            <View style={styles.infoContainer}>
                {/* Nome da quadra */}
                <Text
                    style={[styles.courtName, { color: colors.text }]}
                    numberOfLines={1}
                >
                    {court.name}
                </Text>

                {/* Endereço */}
                <View style={styles.addressContainer}>
                    <Ionicons
                        name="location-outline"
                        size={14}
                        color={colors.textSecondary}
                    />
                    <Text
                        style={[styles.addressText, { color: colors.textSecondary }]}
                        numberOfLines={1}
                    >
                        {court.address}
                    </Text>
                </View>

                {/* Preço e Avaliação */}
                <View style={styles.detailsContainer}>
                    {/* Preço */}
                    <View style={styles.priceContainer}>
                        <Text style={[styles.price, { color: colors.primary }]}>
                            R$ {court.hourly_rate || court.pricePerHour || '0'}
                        </Text>
                        <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
                            /hora
                        </Text>
                    </View>

                    {/* Avaliação */}
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color="#FFB800" />
                        <Text style={[styles.rating, { color: colors.text }]}>
                            {court.rating || 'N/A'}
                        </Text>
                    </View>
                </View>

                {/* Botão Agendar */}
                <CustomButton
                    title="Agendar"
                    variant="primary"
                    onPress={onSchedulePress}
                    disabled={court.available === false}
                    style={styles.button}
                />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        overflow: 'hidden',
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    imageContainer: {
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative', // Para posicionar o badge
    },

    image: {
        fontSize: 64,
    },

    unavailableBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },

    unavailableText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },

    infoContainer: {
        padding: 16,
        gap: 8,
    },

    courtName: {
        fontSize: 16,
        fontWeight: '600',
    },

    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },

    addressText: {
        fontSize: 14,
        flex: 1,
    },

    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },

    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },

    price: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    priceLabel: {
        fontSize: 14,
    },

    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    rating: {
        fontSize: 14,
        fontWeight: '600',
    },

    button: {
        marginTop: 8,
    },
});

/**
 * CONCEITOS:
 * 
 * 1. position: 'absolute': Posiciona elemento sobre outro
 * 2. overflow: 'hidden': Esconde conteúdo que passa da borda
 * 3. alignItems: 'baseline': Alinha pela linha de base do texto
 * 4. Badges: Pequenos indicadores de status
 */
