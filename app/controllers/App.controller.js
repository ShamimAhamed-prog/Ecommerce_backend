module.exports = {
  index: (req, res) => {
    res.render('index', { title: 'Home Page' });
  },
  about: (req, res) => {
    res.render('about', { title: 'About Us' });
  },
  contact: (req, res) => {
    res.render('contact', { title: 'Contact Us' });
  }
};
