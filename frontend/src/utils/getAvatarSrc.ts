const DEFAULT_AVATAR = '/images/default-avatar.png';

export const getAvatarSrc = (avatarUrl?: string | null): string => {
  return avatarUrl || DEFAULT_AVATAR;
};
