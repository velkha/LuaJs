/**
 * Utilidades para manejo de strings
 */
class StringUtils {
    /**
     * Valida si una cadena es una URL válida
     * @param {string} url - La URL a validar
     * @returns {boolean} - true si es una URL válida, false en caso contrario
     */
    static isValidURL(url) {
        if (!url || typeof url !== 'string') {
            return false;
        }

        // Regex para validar URLs (HTTP, HTTPS, FTP, etc.)
        const urlPattern = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
        
        // Alternativa más simple pero efectiva
        try {
            const urlObj = new URL(url);
            return ['http:', 'https:', 'ftp:'].includes(urlObj.protocol);
        } catch (err) {
            return false;
        }
    }

    /**
     * Valida si una cadena es una URL de YouTube
     * @param {string} url - La URL a validar
     * @returns {boolean} - true si es una URL de YouTube válida
     */
    static isYouTubeURL(url) {
        if (!this.isValidURL(url)) return false;
        
        const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
        return youtubePattern.test(url);
    }

    /**
     * Sanitiza una cadena para evitar inyecciones
     * @param {string} str - La cadena a sanitizar
     * @returns {string} - La cadena sanitizada
     */
    static sanitize(str) {
        if (!str || typeof str !== 'string') return '';
        return str.trim().replace(/[<>]/g, '');
    }
}

module.exports = StringUtils;
