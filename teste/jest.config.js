module.exports = {
  testEnvironment: 'node', // Ambiente Node.js
  setupFilesAfterEnv: ['./helpers/setup.js'], // Configuração inicial
  testMatch: ['**/helpers/integration/**/*.test.js'], // Onde estão os testes
  verbose: true, // Mostra detalhes dos testes
  forceExit: true, // Fecha o Jest ao finalizar
  clearMocks: true, // Limpa mocks entre testes
  resetMocks: false, // Mantém mocks
  restoreMocks: false, // Não restaura mocks
};
