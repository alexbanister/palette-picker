const generateColor = () => {
  const red = generateColorValue();
  const green = generateColorValue();
  const blue = generateColorValue();
  return `#${red}${green}${blue}`;
};

const generateColorValue = () => {
  const value = Math.floor(Math.random() * 255).toString(16);
  return value.length === 1 ? "0" + value : value;
};

$('h1').on('click', () => {
  $('h1').text('test');
});
console.log(generateColor());
console.log(generateColor());
console.log(generateColor());
console.log(generateColor());
