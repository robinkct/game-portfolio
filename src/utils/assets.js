export const getAssetUrl = (path) => {
    // If path starts with /, remove it to make it compatible with import.meta.env.BASE_URL which might end with /
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const baseUrl = import.meta.env.BASE_URL;

    // Ensure baseUrl ends with /
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

    return `${cleanBaseUrl}${cleanPath}`;
};
