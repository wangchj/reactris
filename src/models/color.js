var htmlCodes = [
  '#ff9800', // orange
  '#fc1e70', // pink red
  '#e6dc6d', // yellow
  '#60d9f1', // blue
  '#a4e405', // lime
  '#af7dff', // purple
];

/**
 * This constructor should not be call directly. Use Color.getRandomColor instead.
 *
 * @param code {integer} an integer code that represents a color.
 */ 
function Color(code) {
  this.colorCode = code;
}

Color.prototype = {
  toHtmlCode: function() {
    if (this.colorCode == undefined || this.colorCode < 0 || this.colorCode >= htmlCodes.length)
      return htmlCodes[0];
    return htmlCodes[this.colorCode];
  }
};

Color.getRandomColor = function() {
  return new Color(Math.floor(Math.random() * htmlCodes.length));
};

export default Color;