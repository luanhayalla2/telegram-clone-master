import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';
type Language = 'pt' | 'en';

export interface ChatFolder {
  id: string;
  name: string;
  icon: string;
  includedTypes: string[]; // 'private', 'groups', 'channels', 'bots'
  excludedChats: string[];
  includedChats: string[];
}

interface SettingsContextType {
  theme: Theme;
  language: Language;
  sendOnEnter: boolean;
  textSize: number;
  chatWallpaper: string | null;
  autoPlayGifs: boolean;
  autoPlayVideos: boolean;
  showNameAndPhoto: boolean;
  useShortNames: boolean;
  blockedUsers: string[];
  phoneNumberPrivacy: string;
  lastSeenPrivacy: string;
  profilePhotoPrivacy: string;
  forwardedMessagesPrivacy: string;
  groupsChannelsPrivacy: string;
  passcodeEnabled: boolean;
  twoStepVerificationEnabled: boolean;
  notificationsPrivate: boolean;
  notificationsGroups: boolean;
  notificationsChannels: boolean;
  vibrationEnabled: boolean;
  ringtoneEnabled: boolean;
  syncContacts: boolean;
  previewEnabled: boolean;
  autoDownloadMobile: boolean;
  autoDownloadWifi: boolean;
  autoDownloadRoaming: boolean;
  saveToGallery: boolean;
  chatFolders: ChatFolder[];
  powerSavingMode: 'always' | 'never' | 'battery';
  powerSavingThreshold: number;
  disableAnimations: boolean;
  disableStickersAutoPlay: boolean;
  disableGifsAutoPlay: boolean;
  disableVideoAutoPlay: boolean;
  disableBackgroundSync: boolean;
  isPremium: boolean;
  isBusiness: boolean;
  toggleTheme: () => void;
  setLanguage: (lang: Language) => void;
  setSendOnEnter: (value: boolean) => void;
  setTextSize: (value: number) => void;
  setChatWallpaper: (value: string | null) => void;
  setAutoPlayGifs: (value: boolean) => void;
  setAutoPlayVideos: (value: boolean) => void;
  setShowNameAndPhoto: (value: boolean) => void;
  setUseShortNames: (value: boolean) => void;
  setBlockedUsers: (users: string[]) => void;
  setPhoneNumberPrivacy: (value: string) => void;
  setLastSeenPrivacy: (value: string) => void;
  setProfilePhotoPrivacy: (value: string) => void;
  setForwardedMessagesPrivacy: (value: string) => void;
  setGroupsChannelsPrivacy: (value: string) => void;
  setPasscodeEnabled: (value: boolean) => void;
  setTwoStepVerificationEnabled: (value: boolean) => void;
  setNotificationsPrivate: (value: boolean) => void;
  setNotificationsGroups: (value: boolean) => void;
  setNotificationsChannels: (value: boolean) => void;
  setVibrationEnabled: (value: boolean) => void;
  setRingtoneEnabled: (value: boolean) => void;
  setSyncContacts: (value: boolean) => void;
  setPreviewEnabled: (value: boolean) => void;
  setAutoDownloadMobile: (value: boolean) => void;
  setAutoDownloadWifi: (value: boolean) => void;
  setAutoDownloadRoaming: (value: boolean) => void;
  setSaveToGallery: (value: boolean) => void;
  setChatFolders: (folders: ChatFolder[]) => void;
  setPowerSavingMode: (value: 'always' | 'never' | 'battery') => void;
  setPowerSavingThreshold: (value: number) => void;
  setDisableAnimations: (value: boolean) => void;
  setDisableStickersAutoPlay: (value: boolean) => void;
  setDisableGifsAutoPlay: (value: boolean) => void;
  setDisableVideoAutoPlay: (value: boolean) => void;
  setDisableBackgroundSync: (value: boolean) => void;
  setIsPremium: (value: boolean) => void;
  setIsBusiness: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const DEFAULT_CHAT_FOLDERS: ChatFolder[] = [
  { id: 'all_chats', name: 'Todos os Chats', icon: 'chatbox-ellipses-outline', includedTypes: [], excludedChats: [], includedChats: [] },
];

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguageState] = useState<Language>('pt');
  const [sendOnEnter, setSendOnEnterState] = useState(true);
  const [textSize, setTextSizeState] = useState(16);
  const [chatWallpaper, setChatWallpaperState] = useState<string | null>(null);
  const [autoPlayGifs, setAutoPlayGifsState] = useState(true);
  const [autoPlayVideos, setAutoPlayVideosState] = useState(true);
  const [showNameAndPhoto, setShowNameAndPhotoState] = useState(true);
  const [useShortNames, setUseShortNamesState] = useState(false);
  
  // Privacy & Security
  const [blockedUsers, setBlockedUsersState] = useState<string[]>([]);
  const [phoneNumberPrivacy, setPhoneNumberPrivacyState] = useState('Meus Contatos');
  const [lastSeenPrivacy, setLastSeenPrivacyState] = useState('Todos');
  const [profilePhotoPrivacy, setProfilePhotoPrivacyState] = useState('Todos');
  const [forwardedMessagesPrivacy, setForwardedMessagesPrivacyState] = useState('Todos');
  const [groupsChannelsPrivacy, setGroupsChannelsPrivacyState] = useState('Todos');
  const [passcodeEnabled, setPasscodeEnabledState] = useState(false);
  const [twoStepVerificationEnabled, setTwoStepVerificationEnabledState] = useState(true);

  // Notifications
  const [notificationsPrivate, setNotificationsPrivateState] = useState(true);
  const [notificationsGroups, setNotificationsGroupsState] = useState(true);
  const [notificationsChannels, setNotificationsChannelsState] = useState(false);
  const [vibrationEnabled, setVibrationEnabledState] = useState(true);
  const [ringtoneEnabled, setRingtoneEnabledState] = useState(true);
  const [syncContacts, setSyncContactsState] = useState(true);
  const [previewEnabled, setPreviewEnabledState] = useState(true);

  // Data & Storage
  const [autoDownloadMobile, setAutoDownloadMobileState] = useState(true);
  const [autoDownloadWifi, setAutoDownloadWifiState] = useState(true);
  const [autoDownloadRoaming, setAutoDownloadRoamingState] = useState(false);
  const [saveToGallery, setSaveToGalleryState] = useState(false);

  // Chat Folders
  const [chatFolders, setChatFoldersState] = useState<ChatFolder[]>(DEFAULT_CHAT_FOLDERS);

  // Power Saving
  const [powerSavingMode, setPowerSavingModeState] = useState<'always' | 'never' | 'battery'>('battery');
  const [powerSavingThreshold, setPowerSavingThresholdState] = useState(30);
  const [disableAnimations, setDisableAnimationsState] = useState(false);
  const [disableStickersAutoPlay, setDisableStickersAutoPlayState] = useState(false);
  const [disableGifsAutoPlay, setDisableGifsAutoPlayState] = useState(false);
  const [disableVideoAutoPlay, setDisableVideoAutoPlayState] = useState(false);
  const [disableBackgroundSync, setDisableBackgroundSyncState] = useState(false);

  // Premium & Business
  const [isPremium, setIsPremiumState] = useState(false);
  const [isBusiness, setIsBusinessState] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('app_theme');
      const savedLang = await AsyncStorage.getItem('app_lang');
      const savedSendOnEnter = await AsyncStorage.getItem('chat_send_on_enter');
      const savedTextSize = await AsyncStorage.getItem('chat_text_size');
      const savedWallpaper = await AsyncStorage.getItem('chat_wallpaper');
      const savedGifs = await AsyncStorage.getItem('chat_auto_gifs');
      const savedVideos = await AsyncStorage.getItem('chat_auto_videos');
      const savedNamePhoto = await AsyncStorage.getItem('chat_show_name_photo');
      const savedShortNames = await AsyncStorage.getItem('chat_use_short_names');

      // Privacy
      const savedBlockedUsers = await AsyncStorage.getItem('privacy_blocked_users');
      const savedPhonePriv = await AsyncStorage.getItem('privacy_phone');
      const savedLastSeen = await AsyncStorage.getItem('privacy_last_seen');
      const savedPhotoPriv = await AsyncStorage.getItem('privacy_photo');
      const savedForwardPriv = await AsyncStorage.getItem('privacy_forward');
      const savedGroupsPriv = await AsyncStorage.getItem('privacy_groups');
      const savedPasscode = await AsyncStorage.getItem('security_passcode');
      const saved2fa = await AsyncStorage.getItem('security_2fa');

      // Notifications
      const savedNotifPriv = await AsyncStorage.getItem('notif_private');
      const savedNotifGroups = await AsyncStorage.getItem('notif_groups');
      const savedNotifChannels = await AsyncStorage.getItem('notif_channels');
      const savedVib = await AsyncStorage.getItem('notif_vibration');
      const savedRing = await AsyncStorage.getItem('notif_ringtone');
      const savedSync = await AsyncStorage.getItem('notif_sync');
      const savedPrev = await AsyncStorage.getItem('notif_preview');

      // Data
      const savedMobile = await AsyncStorage.getItem('data_mobile');
      const savedWifi = await AsyncStorage.getItem('data_wifi');
      const savedRoaming = await AsyncStorage.getItem('data_roaming');
      const savedGallery = await AsyncStorage.getItem('data_gallery');

      // Folders
      const savedFolders = await AsyncStorage.getItem('chat_folders');

      // Power Saving
      const savedPSMode = await AsyncStorage.getItem('ps_mode');
      const savedPSThreshold = await AsyncStorage.getItem('ps_threshold');
      const savedPSAnim = await AsyncStorage.getItem('ps_disable_animations');
      const savedPSStickers = await AsyncStorage.getItem('ps_disable_stickers');
      const savedPSGifs = await AsyncStorage.getItem('ps_disable_gifs');
      const savedPSVideos = await AsyncStorage.getItem('ps_disable_videos');
      const savedPSSync = await AsyncStorage.getItem('ps_disable_sync');

      // Premium & Business
      const savedPremium = await AsyncStorage.getItem('is_premium');
      const savedBusiness = await AsyncStorage.getItem('is_business');

      if (savedTheme) setTheme(savedTheme as Theme);
      if (savedLang) setLanguageState(savedLang as Language);
      if (savedSendOnEnter !== null) setSendOnEnterState(savedSendOnEnter === 'true');
      if (savedTextSize !== null) setTextSizeState(Number(savedTextSize));
      if (savedWallpaper !== null) setChatWallpaperState(savedWallpaper);
      if (savedGifs !== null) setAutoPlayGifsState(savedGifs === 'true');
      if (savedVideos !== null) setAutoPlayVideosState(savedVideos === 'true');
      if (savedNamePhoto !== null) setShowNameAndPhotoState(savedNamePhoto === 'true');
      if (savedShortNames !== null) setUseShortNamesState(savedShortNames === 'true');

      if (savedBlockedUsers) setBlockedUsersState(JSON.parse(savedBlockedUsers));
      if (savedPhonePriv) setPhoneNumberPrivacyState(savedPhonePriv);
      if (savedLastSeen) setLastSeenPrivacyState(savedLastSeen);
      if (savedPhotoPriv) setProfilePhotoPrivacyState(savedPhotoPriv);
      if (savedForwardPriv) setForwardedMessagesPrivacyState(savedForwardPriv);
      if (savedGroupsPriv) setGroupsChannelsPrivacyState(savedGroupsPriv);
      if (savedPasscode !== null) setPasscodeEnabledState(savedPasscode === 'true');
      if (saved2fa !== null) setTwoStepVerificationEnabledState(saved2fa === 'true');

      if (savedNotifPriv !== null) setNotificationsPrivateState(savedNotifPriv === 'true');
      if (savedNotifGroups !== null) setNotificationsGroupsState(savedNotifGroups === 'true');
      if (savedNotifChannels !== null) setNotificationsChannelsState(savedNotifChannels === 'true');
      if (savedVib !== null) setVibrationEnabledState(savedVib === 'true');
      if (savedRing !== null) setRingtoneEnabledState(savedRing === 'true');
      if (savedSync !== null) setSyncContactsState(savedSync === 'true');
      if (savedPrev !== null) setPreviewEnabledState(savedPrev === 'true');

      if (savedMobile !== null) setAutoDownloadMobileState(savedMobile === 'true');
      if (savedWifi !== null) setAutoDownloadWifiState(savedWifi === 'true');
      if (savedRoaming !== null) setAutoDownloadRoamingState(savedRoaming === 'true');
      if (savedGallery !== null) setSaveToGalleryState(savedGallery === 'true');

      if (savedFolders) setChatFoldersState(JSON.parse(savedFolders));

      if (savedPSMode) setPowerSavingModeState(savedPSMode as 'always' | 'never' | 'battery');
      if (savedPSThreshold) setPowerSavingThresholdState(Number(savedPSThreshold));
      if (savedPSAnim !== null) setDisableAnimationsState(savedPSAnim === 'true');
      if (savedPSStickers !== null) setDisableStickersAutoPlayState(savedPSStickers === 'true');
      if (savedPSGifs !== null) setDisableGifsAutoPlayState(savedPSGifs === 'true');
      if (savedPSVideos !== null) setDisableVideoAutoPlayState(savedPSVideos === 'true');
      if (savedPSSync !== null) setDisableBackgroundSyncState(savedPSSync === 'true');

      if (savedPremium !== null) setIsPremiumState(savedPremium === 'true');
      if (savedBusiness !== null) setIsBusinessState(savedBusiness === 'true');
    } catch (e) {
      console.error('Erro ao carregar configurações:', e);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('app_theme', newTheme);
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem('app_lang', lang);
  };

  const setSendOnEnter = async (value: boolean) => {
    setSendOnEnterState(value);
    await AsyncStorage.setItem('chat_send_on_enter', String(value));
  };

  const setTextSize = async (value: number) => {
    setTextSizeState(value);
    await AsyncStorage.setItem('chat_text_size', String(value));
  };

  const setChatWallpaper = async (value: string | null) => {
    setChatWallpaperState(value);
    if (value) await AsyncStorage.setItem('chat_wallpaper', value);
    else await AsyncStorage.removeItem('chat_wallpaper');
  };

  const setAutoPlayGifs = async (value: boolean) => {
    setAutoPlayGifsState(value);
    await AsyncStorage.setItem('chat_auto_gifs', String(value));
  };

  const setAutoPlayVideos = async (value: boolean) => {
    setAutoPlayVideosState(value);
    await AsyncStorage.setItem('chat_auto_videos', String(value));
  };

  const setShowNameAndPhoto = async (value: boolean) => {
    setShowNameAndPhotoState(value);
    await AsyncStorage.setItem('chat_show_name_photo', String(value));
  };

  const setUseShortNames = async (value: boolean) => {
    setUseShortNamesState(value);
    await AsyncStorage.setItem('chat_use_short_names', String(value));
  };

  const setBlockedUsers = async (users: string[]) => {
    setBlockedUsersState(users);
    await AsyncStorage.setItem('privacy_blocked_users', JSON.stringify(users));
  };

  const setPhoneNumberPrivacy = async (value: string) => {
    setPhoneNumberPrivacyState(value);
    await AsyncStorage.setItem('privacy_phone', value);
  };

  const setLastSeenPrivacy = async (value: string) => {
    setLastSeenPrivacyState(value);
    await AsyncStorage.setItem('privacy_last_seen', value);
  };

  const setProfilePhotoPrivacy = async (value: string) => {
    setProfilePhotoPrivacyState(value);
    await AsyncStorage.setItem('privacy_photo', value);
  };

  const setForwardedMessagesPrivacy = async (value: string) => {
    setForwardedMessagesPrivacyState(value);
    await AsyncStorage.setItem('privacy_forward', value);
  };

  const setGroupsChannelsPrivacy = async (value: string) => {
    setGroupsChannelsPrivacyState(value);
    await AsyncStorage.setItem('privacy_groups', value);
  };

  const setPasscodeEnabled = async (value: boolean) => {
    setPasscodeEnabledState(value);
    await AsyncStorage.setItem('security_passcode', String(value));
  };

  const setTwoStepVerificationEnabled = async (value: boolean) => {
    setTwoStepVerificationEnabledState(value);
    await AsyncStorage.setItem('security_2fa', String(value));
  };

  const setNotificationsPrivate = async (value: boolean) => {
    setNotificationsPrivateState(value);
    await AsyncStorage.setItem('notif_private', String(value));
  };

  const setNotificationsGroups = async (value: boolean) => {
    setNotificationsGroupsState(value);
    await AsyncStorage.setItem('notif_groups', String(value));
  };

  const setNotificationsChannels = async (value: boolean) => {
    setNotificationsChannelsState(value);
    await AsyncStorage.setItem('notif_channels', String(value));
  };

  const setVibrationEnabled = async (value: boolean) => {
    setVibrationEnabledState(value);
    await AsyncStorage.setItem('notif_vibration', String(value));
  };

  const setRingtoneEnabled = async (value: boolean) => {
    setRingtoneEnabledState(value);
    await AsyncStorage.setItem('notif_ringtone', String(value));
  };

  const setSyncContacts = async (value: boolean) => {
    setSyncContactsState(value);
    await AsyncStorage.setItem('notif_sync', String(value));
  };

  const setPreviewEnabled = async (value: boolean) => {
    setPreviewEnabledState(value);
    await AsyncStorage.setItem('notif_preview', String(value));
  };

  const setAutoDownloadMobile = async (value: boolean) => {
    setAutoDownloadMobileState(value);
    await AsyncStorage.setItem('data_mobile', String(value));
  };

  const setAutoDownloadWifi = async (value: boolean) => {
    setAutoDownloadWifiState(value);
    await AsyncStorage.setItem('data_wifi', String(value));
  };

  const setAutoDownloadRoaming = async (value: boolean) => {
    setAutoDownloadRoamingState(value);
    await AsyncStorage.setItem('data_roaming', String(value));
  };

  const setSaveToGallery = async (value: boolean) => {
    setSaveToGalleryState(value);
    await AsyncStorage.setItem('data_gallery', String(value));
  };

  const setChatFolders = async (folders: ChatFolder[]) => {
    setChatFoldersState(folders);
    await AsyncStorage.setItem('chat_folders', JSON.stringify(folders));
  };

  const setPowerSavingMode = async (value: 'always' | 'never' | 'battery') => {
    setPowerSavingModeState(value);
    await AsyncStorage.setItem('ps_mode', value);
  };

  const setPowerSavingThreshold = async (value: number) => {
    setPowerSavingThresholdState(value);
    await AsyncStorage.setItem('ps_threshold', String(value));
  };

  const setDisableAnimations = async (value: boolean) => {
    setDisableAnimationsState(value);
    await AsyncStorage.setItem('ps_disable_animations', String(value));
  };

  const setDisableStickersAutoPlay = async (value: boolean) => {
    setDisableStickersAutoPlayState(value);
    await AsyncStorage.setItem('ps_disable_stickers', String(value));
  };

  const setDisableGifsAutoPlay = async (value: boolean) => {
    setDisableGifsAutoPlayState(value);
    await AsyncStorage.setItem('ps_disable_gifs', String(value));
  };

  const setDisableVideoAutoPlay = async (value: boolean) => {
    setDisableVideoAutoPlayState(value);
    await AsyncStorage.setItem('ps_disable_videos', String(value));
  };

  const setDisableBackgroundSync = async (value: boolean) => {
    setDisableBackgroundSyncState(value);
    await AsyncStorage.setItem('ps_disable_sync', String(value));
  };

  const setIsPremium = async (value: boolean) => {
    setIsPremiumState(value);
    await AsyncStorage.setItem('is_premium', String(value));
  };

  const setIsBusiness = async (value: boolean) => {
    setIsBusinessState(value);
    await AsyncStorage.setItem('is_business', String(value));
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        language,
        sendOnEnter,
        textSize,
        chatWallpaper,
        autoPlayGifs,
        autoPlayVideos,
        showNameAndPhoto,
        useShortNames,
        blockedUsers,
        phoneNumberPrivacy,
        lastSeenPrivacy,
        profilePhotoPrivacy,
        forwardedMessagesPrivacy,
        groupsChannelsPrivacy,
        passcodeEnabled,
        twoStepVerificationEnabled,
        notificationsPrivate,
        notificationsGroups,
        notificationsChannels,
        vibrationEnabled,
        ringtoneEnabled,
        syncContacts,
        previewEnabled,
        autoDownloadMobile,
        autoDownloadWifi,
        autoDownloadRoaming,
        saveToGallery,
        chatFolders,
        powerSavingMode,
        powerSavingThreshold,
        disableAnimations,
        disableStickersAutoPlay,
        disableGifsAutoPlay,
        disableVideoAutoPlay,
        disableBackgroundSync,
        isPremium,
        isBusiness,
        toggleTheme,
        setLanguage,
        setSendOnEnter,
        setTextSize,
        setChatWallpaper,
        setAutoPlayGifs,
        setAutoPlayVideos,
        setShowNameAndPhoto,
        setUseShortNames,
        setBlockedUsers,
        setPhoneNumberPrivacy,
        setLastSeenPrivacy,
        setProfilePhotoPrivacy,
        setForwardedMessagesPrivacy,
        setGroupsChannelsPrivacy,
        setPasscodeEnabled,
        setTwoStepVerificationEnabled,
        setNotificationsPrivate,
        setNotificationsGroups,
        setNotificationsChannels,
        setVibrationEnabled,
        setRingtoneEnabled,
        setSyncContacts,
        setPreviewEnabled,
        setAutoDownloadMobile,
        setAutoDownloadWifi,
        setAutoDownloadRoaming,
        setSaveToGallery,
        setChatFolders,
        setPowerSavingMode,
        setPowerSavingThreshold,
        setDisableAnimations,
        setDisableStickersAutoPlay,
        setDisableGifsAutoPlay,
        setDisableVideoAutoPlay,
        setDisableBackgroundSync,
        setIsPremium,
        setIsBusiness,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
