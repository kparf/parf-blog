module.exports = {
  ci: {
    collect: {
      staticDistDir: './_site',
      url: ['http://localhost'],
    },
    upload: {
      target: 'temporary-public-storage',
    },
  }
}
