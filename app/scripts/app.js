'use strict';

/**
 * @ngdoc overview
 * @name passcardApp
 * @description
 * # passcardApp
 *
 * Main module of the application.
 */
angular
  .module('passcardApp', []);

var downloadPDF, drawLine, drawRoundRect, format2c, generatePasscard, joinArray2d, joinNoSeparator, overwriteArray2d, overwritePasswordArray, pwchars, random, randomChar, randomCharArray, randomCharArray2d;

sjcl.random.addEventListener("progress", function(progress) {
    return $("#seedProgressBar").css("width", "" + (100.0 * progress));
});

random = function(min, max) {
  return min + (Math.abs(sjcl.random.randomWords(1)[0]) % (max - min + 1));
};

pwchars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!§$%&/()#*.-+=';

randomChar = function() {
  return pwchars[random(0, pwchars.length - 1)];
};

randomCharArray = function(length) {
  var i, j, ref, results;
  results = [];
  for (i = j = 1, ref = length; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
    results.push(randomChar());
  }
  return results;
};

randomCharArray2d = function(xLength, yLength) {
  var i, j, ref, results;
  results = [];
  for (i = j = 1, ref = xLength; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
    results.push(randomCharArray(yLength));
  }
  return results;
};

joinNoSeparator = function(array) {
  var elem, j, len, ret;
  ret = "";
  for (j = 0, len = array.length; j < len; j++) {
    elem = array[j];
    ret += elem;
  }
  return ret;
};

joinArray2d = function(array) {
  var inner;
  return joinNoSeparator((function() {
    var j, len, results;
    results = [];
    for (j = 0, len = array.length; j < len; j++) {
      inner = array[j];
      results.push(joinNoSeparator(inner));
    }
    return results;
  })());
};

overwritePasswordArray = function(array) {
  var elem, inner, j, len, results;
  results = [];
  for (j = 0, len = array.length; j < len; j++) {
    inner = array[j];
    results.push(elem = randomChar());
  }
  return results;
};

overwriteArray2d = function(array) {
  var inner, j, len, results;
  results = [];
  for (j = 0, len = array.length; j < len; j++) {
    inner = array[j];
    results.push(overwritePasswordArray(inner));
  }
  return results;
};

drawRoundRect = function(ctx, x, y, width, height, options) {
  var bottomLeftRound, bottomRightRound, fill, oldFillStyle, oldStroke, radius, stroke, topLeftRound, topRightRound;
  if (options == null) {
    options = {};
  }
  if (typeof options !== "object") {
    throw "Options must be an object";
  }
  radius = options.radius != null ? options.radius : 5;
  stroke = options.stroke != null ? options.stroke : true;
  fill = options.fill != null ? options.fill : false;
  topLeftRound = options.topLeftRound != null ? options.topLeftRound : true;
  topRightRound = options.topRightRound != null ? options.topRightRound : true;
  bottomLeftRound = options.bottomLeftRound != null ? options.bottomLeftRound : true;
  bottomRightRound = options.bottomRightRound != null ? options.bottomRightRound : true;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  if (topRightRound) {
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  } else {
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + radius);
  }
  ctx.lineTo(x + width, y + height - radius);
  if (bottomRightRound) {
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  } else {
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + width - radius, y + height);
  }
  ctx.lineTo(x + radius, y + height);
  if (bottomLeftRound) {
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  } else {
    ctx.lineTo(x, y + height);
    ctx.lineTo(x, y + height - radius);
  }
  ctx.lineTo(x, y + radius);
  if (topLeftRound) {
    ctx.quadraticCurveTo(x, y, x + radius, y);
  } else {
    ctx.lineTo(x, y + height);
    ctx.lineTo(x, y + height - radius);
  }
  ctx.closePath();
  oldStroke = ctx.strokeStyle;
  if (typeof stroke === "string") {
    ctx.strokeStyle = stroke;
  }
  if (stroke) {
    ctx.stroke();
  }
  if (typeof stroke === "string") {
    ctx.strokeStyle = oldStroke;
  }
  oldFillStyle = ctx.fillStyle;
  if (typeof fill === "string") {
    ctx.fillStyle = fill;
  }
  if (fill) {
    ctx.fill();
  }
  if (typeof fill === "string") {
    return ctx.fillStyle = oldFillStyle;
  }
};

drawLine = function(ctx, x, y, toX, toY, color) {
  var oldStroke;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(toX, toY);
  ctx.closePath();
  oldStroke = ctx.strokeStyle;
  if (typeof color === "string") {
    ctx.strokeStyle = color;
  }
  ctx.stroke();
  if (typeof color === "string") {
    return ctx.strokeStyle = oldStroke;
  }
};

format2c = function(d) {
  if (d < 10) {
    return " " + d.toString();
  } else {
    return "" + d.toString();
  }
};

downloadPDF = function(instancesPerPage, imageData) {
  var colspacing, height, offsetX, offsetY, pdf, rowspacing, width;
  if (instancesPerPage <= 0) {
    throw "instancesPerPage must be > 0";
  }
  pdf = new jsPDF();
  width = 90;
  height = 45;
  offsetX = 10;
  offsetY = 10;
  rowspacing = 15;
  colspacing = 15;
  pdf.addImage(imageData, 'JPEG', offsetX, offsetY, width, height);
  if (instancesPerPage >= 2) {
    pdf.addImage(imageData, 'JPEG', offsetX, offsetY + height + rowspacing, width, height);
  }
  if (instancesPerPage >= 3) {
    pdf.addImage(imageData, 'JPEG', offsetX, offsetY + 2 * (height + rowspacing), width, height);
  }
  if (instancesPerPage >= 4) {
    pdf.addImage(imageData, 'JPEG', offsetX, offsetY + 3 * (height + rowspacing), width, height);
  }
  return pdf.save("Passcard.pdf");
};

generatePasscard = function() {
  var canvas, col, colWidth, ctx, hashFont, hashLabel, hashLabelFont, hideHash, hr, hseparatorIndices, j, k, l, leftHeaderFont, lineX, lineY, numCols, numRows, offsetX, offsetY, passwordFont, passwordHash, passwords, pwbody, ref, ref1, ref2, row, rowHeight, scaleFactor, styleColor, topHeaderFont, vseparatorIndices, x, y;
  $("#progressBarRow").css("display", "none");
  hr = $("#headerRow");
  pwbody = $("#pwtablebody");
  canvas = document.getElementById('targetCanvas');
  ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  scaleFactor = 2.4;
  ctx.scale(scaleFactor, scaleFactor);
  vseparatorIndices = [4, 10, 15, 21];
  hseparatorIndices = [3, 6, 9, 12];
  rowHeight = 16;
  colWidth = 18;
  numRows = 13;
  numCols = 26;
  offsetX = -2;
  offsetY = 15;
  hideHash = false;
  passwords = randomCharArray2d(numRows, numCols);
  passwordHash = sjcl.codec.base64.fromBits(sjcl.hash.sha256.hash(joinArray2d(passwords)));
  topHeaderFont = 'bold 12pt monospace';
  leftHeaderFont = 'bold 12pt monospace';
  passwordFont = 'normal 12pt monospace';
  hashLabelFont = 'normal 10pt monospace';
  hashFont = 'italic 10pt monospace';
  styleColor = "#3200ff";
  drawRoundRect(ctx, offsetX + 2 * colWidth - 4, offsetY - 14, numCols * colWidth - 2, rowHeight, {
    fill: styleColor,
    stroke: styleColor,
    bottomLeftRound: false,
    bottomRightRound: false
  });
  ctx.font = topHeaderFont;
  ctx.fillStyle = '#FFF';
  for (col = j = 1, ref = numCols; 1 <= ref ? j <= ref : j >= ref; col = 1 <= ref ? ++j : --j) {
    x = offsetX + ((col + 1) * colWidth);
    y = offsetY;
    ctx.fillText(String.fromCharCode(64 + col), x, y);
    if (vseparatorIndices.indexOf(col) !== -1) {
      x = x + colWidth - 4;
      drawLine(ctx, x, y, x, y + (numRows * rowHeight), styleColor);
    }
  }
  for (row = k = 1, ref1 = numRows; 1 <= ref1 ? k <= ref1 : k >= ref1; row = 1 <= ref1 ? ++k : --k) {
    ctx.fillStyle = '#FFF';
    x = offsetX;
    y = offsetY + (row * rowHeight);
    ctx.font = leftHeaderFont;
    drawRoundRect(ctx, x + 0.5 * colWidth - 2, y - rowHeight + 3, 1.2 * colWidth, 0.85 * rowHeight, {
      fill: styleColor,
      stroke: styleColor,
      bottomRightRound: false,
      topRightRound: false
    });
    ctx.fillText(format2c(row), x + 0.5 * colWidth, y);
    ctx.font = passwordFont;
    ctx.fillStyle = '#000';
    if (vseparatorIndices.indexOf(row) !== -1) {
      lineX = offsetX + 2 * colWidth - 6;
      lineY = offsetY + ((row - 1) * rowHeight) + 2;
      drawLine(ctx, lineX, lineY, lineX + (numCols * colWidth), lineY, styleColor);
    }
    for (col = l = 1, ref2 = numCols; 1 <= ref2 ? l <= ref2 : l >= ref2; col = 1 <= ref2 ? ++l : --l) {
      x = offsetX + ((col + 1) * colWidth);
      ctx.fillText(passwords[row - 1][col - 1], x, y);
    }
  }
  if (!hideHash) {
    ctx.fillStyle = styleColor;
    x = offsetX + 3 * colWidth;
    y = offsetY + ((1 + numRows) * rowHeight) + 5;
    ctx.font = hashLabelFont;
    hashLabel = "SHA256:";
    ctx.fillText(hashLabel, x, y);
    ctx.fillStyle = "#000";
    ctx.font = hashFont;
    ctx.fillText(passwordHash, x + 60, y);
  }
  overwriteArray2d(passwords);
  $("a#downloadImgLink").attr("href", canvas.toDataURL("image/png"));
  $("a#downloadPDF1Link").click(function() {
    return downloadPDF(1, canvas.toDataURL("image/jpeg"));
  });
  $("a#downloadPDF2Link").click(function() {
    return downloadPDF(2, canvas.toDataURL("image/jpeg"));
  });
  $("a#downloadPDF3Link").click(function() {
    return downloadPDF(3, canvas.toDataURL("image/jpeg"));
  });
  return $("a#downloadPDF4Link").click(function() {
    return downloadPDF(4, canvas.toDataURL("image/jpeg"));
  });
};

sjcl.random.addEventListener("seeded", generatePasscard);

if (sjcl.random.isReady()) {
  generatePasscard();
}

sjcl.random.startCollectors();

// ---
// generated by coffee-script 1.9.2