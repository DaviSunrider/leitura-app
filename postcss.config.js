// postcss.config.js
module.exports = {
  plugins: {
    'postcss-import': {},      // 1️⃣ Importa @import(...) antes de qualquer outra regra
    'postcss-nesting': {},     // 2️⃣ Desenrola o CSS aninhado
    '@tailwindcss/postcss': {},// 3️⃣ Tailwind entra por último
    autoprefixer: {}
  },
}






