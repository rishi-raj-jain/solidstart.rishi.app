export const themeChangeListener = () => {
  const sessionTheme = localStorage.getItem('theme')
  if (sessionTheme === 'light') {
    document.documentElement.classList.remove('dark')
  } else {
    document.documentElement.classList.add('dark')
  }
}
