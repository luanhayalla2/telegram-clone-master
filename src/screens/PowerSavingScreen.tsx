import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';
import { useSettings } from '../context/SettingsContext';
import SettingRow from '../components/SettingRow';

export default function PowerSavingScreen() {
  const { colors } = useTheme();
  const { 
    powerSavingMode, setPowerSavingMode,
    powerSavingThreshold, setPowerSavingThreshold,
    disableAnimations, setDisableAnimations,
    disableStickersAutoPlay, setDisableStickersAutoPlay,
    disableGifsAutoPlay, setDisableGifsAutoPlay,
    disableVideoAutoPlay, setDisableVideoAutoPlay
  } = useSettings();

  const handleAdjustThreshold = (amount: number) => {
    const newVal = Math.max(0, Math.min(100, powerSavingThreshold + amount));
    setPowerSavingThreshold(newVal);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView>
        <View style={styles.header}>
          <Ionicons name="battery-charging-outline" size={64} color="#34C759" style={{ alignSelf: 'center', marginBottom: 16 }} />
          <Text style={[styles.headerText, { color: colors.textPrimary }]}>Economia de Energia</Text>
          <Text style={[styles.subText, { color: colors.textSecondary }]}>
            Reduza o consumo de bateria desativando animações e reproduções automáticas.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>MODO DE ECONOMIA</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <TouchableOpacity 
              style={styles.optionItem} 
              onPress={() => setPowerSavingMode('always')}
            >
              <Text style={[styles.optionText, { color: colors.textPrimary }]}>Sempre Ativado</Text>
              {powerSavingMode === 'always' && <Ionicons name="checkmark" size={24} color={colors.primary} />}
            </TouchableOpacity>
            <View style={[styles.divider, { backgroundColor: colors.separator }]} />
            <TouchableOpacity 
              style={styles.optionItem} 
              onPress={() => setPowerSavingMode('battery')}
            >
              <Text style={[styles.optionText, { color: colors.textPrimary }]}>Quando a bateria estiver baixa</Text>
              {powerSavingMode === 'battery' && <Ionicons name="checkmark" size={24} color={colors.primary} />}
            </TouchableOpacity>
            <View style={[styles.divider, { backgroundColor: colors.separator }]} />
            <TouchableOpacity 
              style={styles.optionItem} 
              onPress={() => setPowerSavingMode('never')}
            >
              <Text style={[styles.optionText, { color: colors.textPrimary }]}>Sempre Desativado</Text>
              {powerSavingMode === 'never' && <Ionicons name="checkmark" size={24} color={colors.primary} />}
            </TouchableOpacity>
          </View>
        </View>

        {powerSavingMode === 'battery' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>LIMITE DE BATERIA: {powerSavingThreshold}%</Text>
            <View style={[styles.card, { backgroundColor: colors.surface, padding: 16 }]}>
              <View style={styles.thresholdControls}>
                <TouchableOpacity onPress={() => handleAdjustThreshold(-5)} style={styles.thresholdBtn}>
                  <Ionicons name="remove-circle-outline" size={32} color={colors.primary} />
                </TouchableOpacity>
                <View style={[styles.thresholdBar, { backgroundColor: colors.separator }]}>
                  <View style={[styles.thresholdFill, { width: `${powerSavingThreshold}%`, backgroundColor: colors.primary }]} />
                </View>
                <TouchableOpacity onPress={() => handleAdjustThreshold(5)} style={styles.thresholdBtn}>
                  <Ionicons name="add-circle-outline" size={32} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>RECURSOS DESATIVADOS</Text>
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <SettingRow 
              iconName="sparkles-outline" 
              iconBgColor="#AF52DE" 
              label="Desativar Animações" 
              showSwitch 
              switchValue={disableAnimations} 
              onSwitchChange={setDisableAnimations} 
            />
            <SettingRow 
              iconName="happy-outline" 
              iconBgColor="#FF9500" 
              label="Stickers Auto-reproduzir" 
              showSwitch 
              switchValue={disableStickersAutoPlay} 
              onSwitchChange={setDisableStickersAutoPlay} 
            />
            <SettingRow 
              iconName="play-circle-outline" 
              iconBgColor="#5856D6" 
              label="GIFs Auto-reproduzir" 
              showSwitch 
              switchValue={disableGifsAutoPlay} 
              onSwitchChange={setDisableGifsAutoPlay} 
            />
            <SettingRow 
              iconName="videocam-outline" 
              iconBgColor="#FF3B30" 
              label="Vídeos Auto-reproduzir" 
              showSwitch 
              switchValue={disableVideoAutoPlay} 
              onSwitchChange={setDisableVideoAutoPlay} 
              isLast
            />
          </View>
          <Text style={[styles.footerInfo, { color: colors.textSecondary }]}>
            Estes recursos serão desativados automaticamente quando o modo de economia estiver ativo.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 32, alignItems: 'center' },
  headerText: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subText: { fontSize: 13, textAlign: 'center', paddingHorizontal: 20 },
  section: { marginTop: 12 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', marginLeft: 16, marginBottom: 8 },
  card: { overflow: 'hidden' },
  optionItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  optionText: { fontSize: 17 },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: 16 },
  thresholdControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  thresholdBtn: { padding: 4 },
  thresholdBar: { flex: 1, height: 4, borderRadius: 2, marginHorizontal: 16, overflow: 'hidden' },
  thresholdFill: { height: '100%' },
  footerInfo: { fontSize: 12, padding: 16, textAlign: 'center' }
});
