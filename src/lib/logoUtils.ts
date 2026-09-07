// Logo replacement mapping
export const LOGO_PATHS = {
  OLD: '/logo-kd.png',
  NEW: '/logo-king-designer.svg',
  FAVICON: '/favicon-king.ico',
};

export const replaceLogo = () => {
  // استبدال الشعار في رأس الصفحة
  const oldLogos = document.querySelectorAll('[src*="logo-kd"]');
  oldLogos.forEach(logo => {
    logo.setAttribute('src', LOGO_PATHS.NEW);
    logo.setAttribute('alt', 'King Designer');
  });

  // تحديث favicon
  const faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
  if (faviconLink) {
    faviconLink.href = LOGO_PATHS.FAVICON;
  }
};
