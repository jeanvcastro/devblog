export function getAvatarUrl(name: string, avatar: string | null): string {
  if (avatar) return avatar;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=FF4800&color=fff`;
}
