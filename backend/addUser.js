const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Conecte-se ao MongoDB
mongoose.connect('mongodb://192.168.0.78:27017/addengemolde', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  permissions: [String],
});

const User = mongoose.model('User', userSchema);

const addUser = async () => {
  const username = 'teste'; // Substitua pelo nome de usuário desejado
  const password = 'teste'; // Substitua pela senha desejada
  const permissions = ['admin']; // Permissões do usuário

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    password: hashedPassword,
    permissions,
  });

  await newUser.save();
  console.log('Usuário adicionado com sucesso');
  mongoose.connection.close();
};

addUser().catch(err => console.error(err));
