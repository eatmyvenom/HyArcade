module.exports = function isValidIGN(txt) {
  return (
    txt.length < 17 &&
    txt.length > 2 &&
    !txt.includes("!") &&
    !txt.includes("?") &&
    !txt.includes("<") &&
    !txt.includes(":") &&
    !txt.includes(";") &&
    !txt.includes('"') &&
    !txt.includes("(") &&
    !txt.includes(")") &&
    txt != "liar" &&
    txt != "pog" &&
    txt != "fuck" &&
    txt != "yes" &&
    txt != "knew" &&
    txt != "hot" &&
    txt != "ofc" &&
    txt != "get" &&
    txt != "are" &&
    txt != "gamer" &&
    txt != "yea" &&
    txt != "okay" &&
    txt != "hypixel" &&
    txt != "uh" &&
    txt != "what" &&
    txt != "help" &&
    txt != "verify" &&
    txt != "bruh" &&
    txt != "how" &&
    txt != "no" &&
    txt != "so" &&
    txt != "dream" &&
    txt != "technoblade" &&
    txt != "tommyinit" &&
    txt != "dreamwastaken" &&
    txt != "hypixel" &&
    txt != "txt"
  );
};
