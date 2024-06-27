const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const { createWorker } = require('tesseract.js');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'your_secret_key'; // Substitua por uma chave secreta mais segura

const allowedOrigins = ['http://localhost:3000', 'http://192.168.0.78:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

const mongoURI = 'mongodb://localhost:27017/addengemolde';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const storage = multer.memoryStorage();
const upload = multer({ storage });

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  permissions: [String],
});

const toolSchema = new mongoose.Schema({
  toolName: String,
  description: String,
  toolId: String,
  serialNumber: { type: String, unique: true },
  status: { type: String, default: 'Em estoque' },
  problemDescription: String,
  solutionDescription: String,
  responsible: String
});

const workSchema = new mongoose.Schema({
  client: String,
  workAddress: String,
  workPeriod: String
});

const steelSchema = new mongoose.Schema({
  date: Date,
  corrida: { type: String, unique: true }, // Tornando a corrida única
  feixe: String,
  peso: String,
  type: { type: String, enum: ['entry', 'exit'], required: true } // Adicionando o tipo de registro
});

const User = mongoose.model('User', userSchema);
const Tool = mongoose.model('Tool', toolSchema);
const Work = mongoose.model('Work', workSchema);
const Steel = mongoose.model('Steel', steelSchema);

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id, permissions: user.permissions }, SECRET_KEY);
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

app.get('/users', async (req, res) => {
  const users = await User.find({}, 'username permissions');
  res.json(users);
});

app.patch('/users/:id', async (req, res) => {
  const { permissions } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { permissions }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Rotas para ferramentas
app.post('/tools', async (req, res) => {
  const { toolName, description, toolId, serialNumber, status, problemDescription, solutionDescription, responsible } = req.body;
  try {
    const existingTool = await Tool.findOne({ serialNumber });
    if (existingTool) {
      return res.status(400).json({ error: 'Número de série já existe' });
    }
    const newTool = new Tool({ toolName, description, toolId, serialNumber, status, problemDescription, solutionDescription, responsible });
    await newTool.save();
    res.json(newTool);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar a ferramenta' });
  }
});

app.get('/tools', async (req, res) => {
  try {
    const status = req.query.status;
    let query = {};
    if (status) {
      query.status = status;
    }
    const tools = await Tool.find(query);
    res.json(tools);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar as ferramentas' });
  }
});

app.get('/tools/available', async (req, res) => {
  try {
    const tools = await Tool.find({ status: 'Em estoque' });
    res.json(tools);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar as ferramentas disponíveis' });
  }
});

// Rota para atualizar ferramenta
app.patch('/tools/:id', async (req, res) => {
  const { id } = req.params;
  const { toolName, description, serialNumber, status, work, responsible, returnDate, problemDescription, solutionDescription } = req.body;
  try {
    const tool = await Tool.findByIdAndUpdate(id, { toolName, description, serialNumber, status, work, responsible, returnDate, problemDescription, solutionDescription }, { new: true });
    if (!tool) {
      return res.status(404).json({ error: 'Ferramenta não encontrada' });
    }
    res.json(tool);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar a ferramenta' });
  }
});

// Rotas para obras
app.post('/works', async (req, res) => {
  const { client, workAddress, workPeriod } = req.body;
  try {
    const newWork = new Work({ client, workAddress, workPeriod });
    await newWork.save();
    res.json(newWork);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar a obra' });
  }
});

app.get('/works', async (req, res) => {
  try {
    const works = await Work.find({});
    res.json(works);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar as obras' });
  }
});

// Rotas para aço
app.post('/steel-entry', async (req, res) => {
  const { date, corrida, feixe, peso } = req.body;
  try {
    const existingEntry = await Steel.findOne({ corrida, type: 'entry' });
    if (existingEntry) {
      return res.status(400).json({ error: 'Corrida já registrada na entrada de aço.' });
    }
    const newEntry = new Steel({ date, corrida, feixe, peso, type: 'entry' });
    await newEntry.save();
    res.json(newEntry);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar entrada de aço' });
  }
});

app.post('/steel-exit', async (req, res) => {
  const { date, corrida, feixe, peso } = req.body;
  try {
    const existingExit = await Steel.findOne({ corrida, type: 'exit' });
    if (existingExit) {
      return res.status(400).json({ error: 'Saída já registrada para esta corrida.' });
    }
    const newExit = new Steel({ date, corrida, feixe, peso, type: 'exit' });
    await newExit.save();
    res.json(newExit);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar saída de aço' });
  }
});

app.get('/steel-report', async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const reportData = await Steel.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    });
    res.json(reportData);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar o relatório de aço' });
  }
});

// Rota para envio de email
app.post('/send-email', async (req, res) => {
  const { to = 'informatica@engemolde.com.br', subject, text, toolId } = req.body; // Use o e-mail padrão se 'to' não for fornecido

  const transporter = nodemailer.createTransport({
    host: 'email-ssl.com.br',
    port: 587,
    secure: false, // true para port 465, false para outras portas
    auth: {
      user: 'leandro@engemolde.com.br', // Substitua pelo seu email
      pass: '2022@39!86#22@EnG' // Substitua pela sua senha de email
    }
  });

  const mailOptions = {
    from: 'leandro@engemolde.com.br', // Substitua pelo seu email
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.error('Erro ao enviar email:', error);
      res.status(500).json({ error: 'Erro ao enviar email' });
    } else {
      console.log('Email enviado:', info.response);
      try {
        const tool = await Tool.findByIdAndUpdate(toolId, { status: 'Aguardando peça' }, { new: true });
        if (!tool) {
          return res.status(404).json({ error: 'Ferramenta não encontrada' });
        }
        res.status(200).json({ message: 'Email enviado com sucesso e status da ferramenta atualizado para Aguardando peça' });
      } catch (updateError) {
        console.error('Erro ao atualizar status da ferramenta:', updateError);
        res.status(500).json({ error: 'Email enviado, mas houve um erro ao atualizar o status da ferramenta' });
      }
    }
  });
});

// Nova rota para buscar dados da entrada de aço por corrida
app.get('/steel-entry/:corrida', async (req, res) => {
  const { corrida } = req.params;
  try {
    const entry = await Steel.findOne({ corrida, type: 'entry' });
    if (!entry) {
      return res.status(404).json({ error: 'Entrada não encontrada' });
    }
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar a entrada' });
  }
});

app.listen(PORT, '192.168.0.78', () => {
  console.log(`Server is running on port ${PORT}`);
});
