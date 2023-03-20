const getHello = (req, res) => {
  console.log('Sending message from server');
  res.send("Hi from server");
  }
  
module.exports = { getHello };
  