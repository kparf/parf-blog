module.exports = {
  ci: {
    collect: {
      staticDistDir: './_site',
      url: ['http://localhost/index.html'],
    },
    upload: {
      target: 'temporary-public-storage',
    },
  }
}
