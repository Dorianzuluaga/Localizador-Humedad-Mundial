export function getInitialMapSettings() {
    const isMobile = window.innerWidth <= 700;

    return {
        zoom: isMobile ? 1 : 2,
        speed: isMobile ? 0.05 : 0.1,
        curve: isMobile ? 1.45 : 4.5,
    };
}