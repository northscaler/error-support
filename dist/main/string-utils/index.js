'use strict';
/**
 * Converts given camel case (`likeThis`) to snake (`like_this`), optionally upper casing.
 *
 * @param {string} [camel] The camel cased string to convert.
 * @param {boolean} [upper=false] Whether to convert to upper case.
 * @return {string|*} If `camel` is falsey, returns `camel` unchanged, else returns the conversion.
 */

const toSnake = (camel, upper = false) => {
  if (!camel) return camel;
  camel = camel.toString().replace(/(^([A-Z]))/, (match, it) => `${it.toLowerCase()}`).replace(/([A-Z])/g, (match, it) => `_${it.toLowerCase()}`);
  return upper ? camel.toUpperCase() : camel;
};
/**
 * Converts given camel case (`likeThis`) to upper case snake (`LIKE_THIS`).
 *
 * @param {string} [camel] The camel cased string to convert.
 * @return {string|*} If `camel` is falsey, returns `camel` unchanged, else returns the conversion.
 */


const toUpperSnake = camel => toSnake(camel, true);
/**
 * Converts given camel case (`likeThis`) to lower case snake (`like_this`).
 *
 * @param {string} [camel] The camel cased string to convert.
 * @return {string|*} If `camel` is falsey, returns `camel` unchanged, else returns the conversion.
 */


const toLowerSnake = camel => toSnake(camel);
/**
 * Converts given snake (`like_this`) to camel case (`likeThis`), optionally upper casing the leading character.
 *
 * @param {string} [snake] The snake string to convert.
 * @param {boolean} [upper=false] Whether to upper case the leading character.
 * @return {string|*} If `snake` is falsey, returns `snake` unchanged, else returns the conversion.
 */


const toCamel = (snake, upper = true) => {
  if (!snake) return snake;
  return snake.toString().split('_').reduce((accum, next) => {
    if (!next) return accum;
    next = next.toLowerCase();

    if (upper) {
      return `${accum}${next.replace(/^([a-z])/, (match, it) => it.toUpperCase())}`;
    } else {
      upper = true;
      return next;
    }
  }, '');
};
/**
 * Converts given snake (`like_this`) to leading upper camel case (`LikeThis`).
 *
 * @param {string} [snake] The snake string to convert.
 * @return {string|*} If `snake` is falsey, returns `snake` unchanged, else returns the conversion.
 */


const toUpperCamel = snake => toCamel(snake);
/**
 * Converts given snake (`like_this`) to leading lower camel case (`likeThis`).
 *
 * @param {string} [snake] The snake string to convert.
 * @return {string|*} If `snake` is falsey, returns `snake` unchanged, else returns the conversion.
 */


const toLowerCamel = snake => toCamel(snake, false);

module.exports = {
  toSnake,
  toUpperSnake,
  toLowerSnake,
  toCamel,
  toUpperCamel,
  toLowerCamel
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tYWluL3N0cmluZy11dGlscy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ0b1NuYWtlIiwiY2FtZWwiLCJ1cHBlciIsInRvU3RyaW5nIiwicmVwbGFjZSIsIm1hdGNoIiwiaXQiLCJ0b0xvd2VyQ2FzZSIsInRvVXBwZXJDYXNlIiwidG9VcHBlclNuYWtlIiwidG9Mb3dlclNuYWtlIiwidG9DYW1lbCIsInNuYWtlIiwic3BsaXQiLCJyZWR1Y2UiLCJhY2N1bSIsIm5leHQiLCJ0b1VwcGVyQ2FtZWwiLCJ0b0xvd2VyQ2FtZWwiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUVBOzs7Ozs7OztBQU9BLE1BQU1BLE9BQU8sR0FBRyxDQUFDQyxLQUFELEVBQVFDLEtBQUssR0FBRyxLQUFoQixLQUEwQjtBQUN4QyxNQUFJLENBQUNELEtBQUwsRUFBWSxPQUFPQSxLQUFQO0FBRVpBLEVBQUFBLEtBQUssR0FBR0EsS0FBSyxDQUNWRSxRQURLLEdBRUxDLE9BRkssQ0FFRyxZQUZILEVBRWlCLENBQUNDLEtBQUQsRUFBUUMsRUFBUixLQUFnQixHQUFFQSxFQUFFLENBQUNDLFdBQUgsRUFBaUIsRUFGcEQsRUFHTEgsT0FISyxDQUdHLFVBSEgsRUFHZSxDQUFDQyxLQUFELEVBQVFDLEVBQVIsS0FBZ0IsSUFBR0EsRUFBRSxDQUFDQyxXQUFILEVBQWlCLEVBSG5ELENBQVI7QUFLQSxTQUFPTCxLQUFLLEdBQUdELEtBQUssQ0FBQ08sV0FBTixFQUFILEdBQXlCUCxLQUFyQztBQUNELENBVEQ7QUFXQTs7Ozs7Ozs7QUFNQSxNQUFNUSxZQUFZLEdBQUdSLEtBQUssSUFBSUQsT0FBTyxDQUFDQyxLQUFELEVBQVEsSUFBUixDQUFyQztBQUVBOzs7Ozs7OztBQU1BLE1BQU1TLFlBQVksR0FBR1QsS0FBSyxJQUFJRCxPQUFPLENBQUNDLEtBQUQsQ0FBckM7QUFFQTs7Ozs7Ozs7O0FBT0EsTUFBTVUsT0FBTyxHQUFHLENBQUNDLEtBQUQsRUFBUVYsS0FBSyxHQUFHLElBQWhCLEtBQXlCO0FBQ3ZDLE1BQUksQ0FBQ1UsS0FBTCxFQUFZLE9BQU9BLEtBQVA7QUFFWixTQUFPQSxLQUFLLENBQ1RULFFBREksR0FFSlUsS0FGSSxDQUVFLEdBRkYsRUFHSkMsTUFISSxDQUdHLENBQUNDLEtBQUQsRUFBUUMsSUFBUixLQUFpQjtBQUN2QixRQUFJLENBQUNBLElBQUwsRUFBVyxPQUFPRCxLQUFQO0FBRVhDLElBQUFBLElBQUksR0FBR0EsSUFBSSxDQUFDVCxXQUFMLEVBQVA7O0FBRUEsUUFBSUwsS0FBSixFQUFXO0FBQ1QsYUFBUSxHQUFFYSxLQUFNLEdBQUVDLElBQUksQ0FBQ1osT0FBTCxDQUFhLFVBQWIsRUFBeUIsQ0FBQ0MsS0FBRCxFQUFRQyxFQUFSLEtBQWVBLEVBQUUsQ0FBQ0UsV0FBSCxFQUF4QyxDQUEwRCxFQUE1RTtBQUNELEtBRkQsTUFFTztBQUNMTixNQUFBQSxLQUFLLEdBQUcsSUFBUjtBQUNBLGFBQU9jLElBQVA7QUFDRDtBQUNGLEdBZEksRUFjRixFQWRFLENBQVA7QUFlRCxDQWxCRDtBQW9CQTs7Ozs7Ozs7QUFNQSxNQUFNQyxZQUFZLEdBQUdMLEtBQUssSUFBSUQsT0FBTyxDQUFDQyxLQUFELENBQXJDO0FBRUE7Ozs7Ozs7O0FBTUEsTUFBTU0sWUFBWSxHQUFHTixLQUFLLElBQUlELE9BQU8sQ0FBQ0MsS0FBRCxFQUFRLEtBQVIsQ0FBckM7O0FBRUFPLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQjtBQUNmcEIsRUFBQUEsT0FEZTtBQUVmUyxFQUFBQSxZQUZlO0FBR2ZDLEVBQUFBLFlBSGU7QUFJZkMsRUFBQUEsT0FKZTtBQUtmTSxFQUFBQSxZQUxlO0FBTWZDLEVBQUFBO0FBTmUsQ0FBakIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBDb252ZXJ0cyBnaXZlbiBjYW1lbCBjYXNlIChgbGlrZVRoaXNgKSB0byBzbmFrZSAoYGxpa2VfdGhpc2ApLCBvcHRpb25hbGx5IHVwcGVyIGNhc2luZy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NhbWVsXSBUaGUgY2FtZWwgY2FzZWQgc3RyaW5nIHRvIGNvbnZlcnQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFt1cHBlcj1mYWxzZV0gV2hldGhlciB0byBjb252ZXJ0IHRvIHVwcGVyIGNhc2UuXG4gKiBAcmV0dXJuIHtzdHJpbmd8Kn0gSWYgYGNhbWVsYCBpcyBmYWxzZXksIHJldHVybnMgYGNhbWVsYCB1bmNoYW5nZWQsIGVsc2UgcmV0dXJucyB0aGUgY29udmVyc2lvbi5cbiAqL1xuY29uc3QgdG9TbmFrZSA9IChjYW1lbCwgdXBwZXIgPSBmYWxzZSkgPT4ge1xuICBpZiAoIWNhbWVsKSByZXR1cm4gY2FtZWxcblxuICBjYW1lbCA9IGNhbWVsXG4gICAgLnRvU3RyaW5nKClcbiAgICAucmVwbGFjZSgvKF4oW0EtWl0pKS8sIChtYXRjaCwgaXQpID0+IGAke2l0LnRvTG93ZXJDYXNlKCl9YClcbiAgICAucmVwbGFjZSgvKFtBLVpdKS9nLCAobWF0Y2gsIGl0KSA9PiBgXyR7aXQudG9Mb3dlckNhc2UoKX1gKVxuXG4gIHJldHVybiB1cHBlciA/IGNhbWVsLnRvVXBwZXJDYXNlKCkgOiBjYW1lbFxufVxuXG4vKipcbiAqIENvbnZlcnRzIGdpdmVuIGNhbWVsIGNhc2UgKGBsaWtlVGhpc2ApIHRvIHVwcGVyIGNhc2Ugc25ha2UgKGBMSUtFX1RISVNgKS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NhbWVsXSBUaGUgY2FtZWwgY2FzZWQgc3RyaW5nIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJuIHtzdHJpbmd8Kn0gSWYgYGNhbWVsYCBpcyBmYWxzZXksIHJldHVybnMgYGNhbWVsYCB1bmNoYW5nZWQsIGVsc2UgcmV0dXJucyB0aGUgY29udmVyc2lvbi5cbiAqL1xuY29uc3QgdG9VcHBlclNuYWtlID0gY2FtZWwgPT4gdG9TbmFrZShjYW1lbCwgdHJ1ZSlcblxuLyoqXG4gKiBDb252ZXJ0cyBnaXZlbiBjYW1lbCBjYXNlIChgbGlrZVRoaXNgKSB0byBsb3dlciBjYXNlIHNuYWtlIChgbGlrZV90aGlzYCkuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IFtjYW1lbF0gVGhlIGNhbWVsIGNhc2VkIHN0cmluZyB0byBjb252ZXJ0LlxuICogQHJldHVybiB7c3RyaW5nfCp9IElmIGBjYW1lbGAgaXMgZmFsc2V5LCByZXR1cm5zIGBjYW1lbGAgdW5jaGFuZ2VkLCBlbHNlIHJldHVybnMgdGhlIGNvbnZlcnNpb24uXG4gKi9cbmNvbnN0IHRvTG93ZXJTbmFrZSA9IGNhbWVsID0+IHRvU25ha2UoY2FtZWwpXG5cbi8qKlxuICogQ29udmVydHMgZ2l2ZW4gc25ha2UgKGBsaWtlX3RoaXNgKSB0byBjYW1lbCBjYXNlIChgbGlrZVRoaXNgKSwgb3B0aW9uYWxseSB1cHBlciBjYXNpbmcgdGhlIGxlYWRpbmcgY2hhcmFjdGVyLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc25ha2VdIFRoZSBzbmFrZSBzdHJpbmcgdG8gY29udmVydC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW3VwcGVyPWZhbHNlXSBXaGV0aGVyIHRvIHVwcGVyIGNhc2UgdGhlIGxlYWRpbmcgY2hhcmFjdGVyLlxuICogQHJldHVybiB7c3RyaW5nfCp9IElmIGBzbmFrZWAgaXMgZmFsc2V5LCByZXR1cm5zIGBzbmFrZWAgdW5jaGFuZ2VkLCBlbHNlIHJldHVybnMgdGhlIGNvbnZlcnNpb24uXG4gKi9cbmNvbnN0IHRvQ2FtZWwgPSAoc25ha2UsIHVwcGVyID0gdHJ1ZSkgPT4ge1xuICBpZiAoIXNuYWtlKSByZXR1cm4gc25ha2VcblxuICByZXR1cm4gc25ha2VcbiAgICAudG9TdHJpbmcoKVxuICAgIC5zcGxpdCgnXycpXG4gICAgLnJlZHVjZSgoYWNjdW0sIG5leHQpID0+IHtcbiAgICAgIGlmICghbmV4dCkgcmV0dXJuIGFjY3VtXG5cbiAgICAgIG5leHQgPSBuZXh0LnRvTG93ZXJDYXNlKClcblxuICAgICAgaWYgKHVwcGVyKSB7XG4gICAgICAgIHJldHVybiBgJHthY2N1bX0ke25leHQucmVwbGFjZSgvXihbYS16XSkvLCAobWF0Y2gsIGl0KSA9PiBpdC50b1VwcGVyQ2FzZSgpKX1gXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cHBlciA9IHRydWVcbiAgICAgICAgcmV0dXJuIG5leHRcbiAgICAgIH1cbiAgICB9LCAnJylcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBnaXZlbiBzbmFrZSAoYGxpa2VfdGhpc2ApIHRvIGxlYWRpbmcgdXBwZXIgY2FtZWwgY2FzZSAoYExpa2VUaGlzYCkuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IFtzbmFrZV0gVGhlIHNuYWtlIHN0cmluZyB0byBjb252ZXJ0LlxuICogQHJldHVybiB7c3RyaW5nfCp9IElmIGBzbmFrZWAgaXMgZmFsc2V5LCByZXR1cm5zIGBzbmFrZWAgdW5jaGFuZ2VkLCBlbHNlIHJldHVybnMgdGhlIGNvbnZlcnNpb24uXG4gKi9cbmNvbnN0IHRvVXBwZXJDYW1lbCA9IHNuYWtlID0+IHRvQ2FtZWwoc25ha2UpXG5cbi8qKlxuICogQ29udmVydHMgZ2l2ZW4gc25ha2UgKGBsaWtlX3RoaXNgKSB0byBsZWFkaW5nIGxvd2VyIGNhbWVsIGNhc2UgKGBsaWtlVGhpc2ApLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBbc25ha2VdIFRoZSBzbmFrZSBzdHJpbmcgdG8gY29udmVydC5cbiAqIEByZXR1cm4ge3N0cmluZ3wqfSBJZiBgc25ha2VgIGlzIGZhbHNleSwgcmV0dXJucyBgc25ha2VgIHVuY2hhbmdlZCwgZWxzZSByZXR1cm5zIHRoZSBjb252ZXJzaW9uLlxuICovXG5jb25zdCB0b0xvd2VyQ2FtZWwgPSBzbmFrZSA9PiB0b0NhbWVsKHNuYWtlLCBmYWxzZSlcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHRvU25ha2UsXG4gIHRvVXBwZXJTbmFrZSxcbiAgdG9Mb3dlclNuYWtlLFxuICB0b0NhbWVsLFxuICB0b1VwcGVyQ2FtZWwsXG4gIHRvTG93ZXJDYW1lbFxufVxuIl19