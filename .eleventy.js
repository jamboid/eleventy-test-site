module.exports = function(eleventyConfig) {
  return {
    dir: {
      input: "./source", // Equivalent to Jekyll's source property
      output: "./_site" // Equivalent to Jekyll's destination property
    }
  };
};
