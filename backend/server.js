const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const multer = require('multer');
const axios = require('axios');
const puppeteer = require('puppeteer');
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
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true
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
  razaoSocial: String,
  codigoProduto: String,
  descricaoProduto: String,
  pesoBruto: String,
  etiquetas: [{
    corrida: String,
    feixe: String,
    peso: String
  }]
});

const assetSchema = new mongoose.Schema({
  nome: String,
  tipo: String,
  marca: String,
  modelo: String,
  ano: String,
  dataCompra: Date,
  atribuidoA: String,
  departamento: String,
  dataAtribuicao: Date,
  cronogramaManutencao: String,
  metricasUso: String,
  condicao: String,
  metodoDepreciacao: String,
  detalhesIncidente: String,
  detalhesDescarte: String,
  detalhesAuditoria: String,
  detalhesGarantia: String,
  detalhesSeguro: String,
  detalhesTransferencia: String,
  consumoCombustivel: String,
  detalhesConformidade: String,
  detalhesCicloVida: String,
  detalhesAvaliacao: String,
  feedback: String,
  inventarioPecasReposicao: String,
  controleKm: Number,
  trocaOleo: Date,
  trocaPecas: Date,
  trocaPneu: Date,
  manutencaoPreventiva: Date,
  fleet: {
    consumoCombustivel: Number,
    kmSaida: Number,
    kmEntrada: Number,
    trocaOleoKm: Number, // Campo adicionado para a quilometragem de troca de óleo
    solicitacoesPecas: [{
      descricao: String,
      data: { type: Date, default: Date.now }
    }],
    saidas: [{
      dataSaida: Date,
      kmAtual: Number,
      motorista: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
      avarias: String
    }],
    entradas: [{
      dataEntrada: Date,
      kmAtual: Number,
      avarias: String
    }],
    emUso: { type: Boolean, default: false }
  }
});

const driverSchema = new mongoose.Schema({
  nome: String,
  cnh: String,
  validadeCnh: Date,
  dataNascimento: Date,
  endereco: String,
  telefone: String,
  email: String
});

const assetTypeSchema = new mongoose.Schema({
  typeName: { type: String, unique: true }
});

const brandSchema = new mongoose.Schema({
  name: { type: String, unique: true }
});

const modelSchema = new mongoose.Schema({
  name: { type: String, unique: true }
});

const departmentSchema = new mongoose.Schema({
  name: { type: String, unique: true }
});

const User = mongoose.model('User', userSchema);
const Tool = mongoose.model('Tool', toolSchema);
const Work = mongoose.model('Work', workSchema);
const Steel = mongoose.model('Steel', steelSchema);
const Asset = mongoose.model('Asset', assetSchema);
const Driver = mongoose.model('Driver', driverSchema);
const AssetType = mongoose.model('AssetType', assetTypeSchema);
const Brand = mongoose.model('Brand', brandSchema);
const Model = mongoose.model('Model', modelSchema);
const Department = mongoose.model('Department', departmentSchema);

// Middleware para verificar o token JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Utilize o middleware nas rotas protegidas
app.use('/assets', authenticateJWT);
app.use('/brands', authenticateJWT);
app.use('/departments', authenticateJWT);
app.use('/models', authenticateJWT);
app.use('/asset-types', authenticateJWT);


// Rota de login
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

// Aplicar o middleware `authenticateJWT` às rotas que precisam de autenticação
app.get('/users', authenticateJWT, async (req, res) => {
  const users = await User.find({}, 'username permissions');
  res.json(users);
});

app.patch('/users/:id', authenticateJWT, async (req, res) => {
  const { permissions } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { permissions }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

app.post('/tools', authenticateJWT, async (req, res) => {
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

app.get('/tools', authenticateJWT, async (req, res) => {
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

app.get('/tools/available', authenticateJWT, async (req, res) => {
  try {
    const tools = await Tool.find({ status: 'Em estoque' });
    res.json(tools);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar as ferramentas disponíveis' });
  }
});

app.patch('/tools/:id', authenticateJWT, async (req, res) => {
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
app.post('/works', authenticateJWT, async (req, res) => {
  const { client, workAddress, workPeriod } = req.body;
  try {
    const newWork = new Work({ client, workAddress, workPeriod });
    await newWork.save();
    res.json(newWork);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar a obra' });
  }
});

app.get('/works', authenticateJWT, async (req, res) => {
  try {
    const works = await Work.find({});
    res.json(works);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar as obras' });
  }
});

// Rotas para aço
app.post('/steel-entry', authenticateJWT, async (req, res) => {
  const { date, razaoSocial, codigoProduto, descricaoProduto, pesoBruto, etiquetas } = req.body;
  try {
    const newEntry = new Steel({ date, razaoSocial, codigoProduto, descricaoProduto, pesoBruto, etiquetas });
    await newEntry.save();
    res.json(newEntry);
  } catch (error) {
    console.error('Erro ao registrar a entrada:', error);
    res.status(500).json({ error: 'Erro ao registrar a entrada' });
  }
});

app.post('/steel-exit', authenticateJWT, async (req, res) => {
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

app.get('/steel-report', authenticateJWT, async (req, res) => {
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
app.post('/send-email', authenticateJWT, async (req, res) => {
  const { to = 'informatica@engemolde.com.br', subject, text, toolId } = req.body; // Use o e-mail padrão se 'to' não for fornecido

  const transporter = nodemailer.createTransport({
    host: 'email-ssl.com.br',
    port: 587,
    secure: false, // true para port 465, false para outras portas
    auth: {
      user: 'leandro@engemolde.com.br', // Substitua pelo seu email
      pass: '***' // Substitua pela sua senha de email
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
app.get('/steel-entry/:corrida', authenticateJWT, async (req, res) => {
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

// Rota para consulta de nota fiscal usando Puppeteer
app.post('/consulta-nota-fiscal', authenticateJWT, async (req, res) => {
  const { codigoBarras } = req.body;

  try {
    console.log('Recebendo código de barras:', codigoBarras);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const url = 'https://www.nfe.fazenda.gov.br/portal/disponibilidade.aspx';

    await page.goto(url);
    console.log('Página carregada:', url);

    // Aguardando a página carregar e o seletor estar disponível
    await page.waitForSelector('#ctl00_ContentPlaceHolder1_txtChaveAcessoResumo');
    console.log('Formulário de chave de acesso disponível');

    // Preenchendo o formulário e fazendo a busca
    await page.type('#ctl00_ContentPlaceHolder1_txtChaveAcessoResumo', codigoBarras);
    await page.click('#ctl00_ContentPlaceHolder1_btnConsultar');
    console.log('Formulário enviado com chave de acesso:', codigoBarras);

    // Aguardando a resposta ser carregada
    await page.waitForSelector('.class-do-elemento-com-dados-da-nfe', { timeout: 60000 });
    console.log('Resposta da consulta carregada');

    // Extraindo os dados da NFe
    const nfeData = await page.evaluate(() => {
      const razaoSocial = document.querySelector('.class-da-razao-social').innerText;
      const codigoProduto = document.querySelector('.class-do-codigo-produto').innerText;
      const descricaoProduto = document.querySelector('.class-da-descricao-produto').innerText;
      const pesoBruto = document.querySelector('.class-do-peso-bruto').innerText;

      return {
        razaoSocial,
        codigoProduto,
        descricaoProduto,
        pesoBruto
      };
    });

    await browser.close();
    console.log('Dados extraídos da NFe:', nfeData);

    res.json(nfeData);
  } catch (error) {
    console.error('Erro ao consultar a nota fiscal:', error);
    res.status(500).json({ message: 'Erro ao consultar a nota fiscal' });
  }
});

// Rotas para ativos
app.post('/assets', authenticateJWT, async (req, res) => {
  const asset = new Asset(req.body);
  try {
    await asset.save();
    res.status(201).json(asset);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao salvar o ativo' });
  }
});

// Exemplo de rota com CORS aplicado
app.get('/assets', authenticateJWT, async (req, res) => {
  try {
    const assets = await Asset.find({});
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os ativos' });
  }
});

app.get('/assets/available', authenticateJWT, async (req, res) => {
  try {
    const availableAssets = await Asset.find({ 'fleet.emUso': false });
    res.json(availableAssets);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os ativos disponíveis' });
  }
});

// Rota para relatório de ativos
app.get('/assets/report', authenticateJWT, async (req, res) => {
  try {
    const assets = await Asset.find({});
    res.json({ total: assets.length, assets });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o relatório de ativos' });
  }
});

// Rotas para tipos de ativos
app.post('/asset-types', authenticateJWT, async (req, res) => {
  const { typeName } = req.body;
  try {
    const newAssetType = new AssetType({ typeName });
    await newAssetType.save();
    res.status(201).json(newAssetType);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao salvar o tipo de ativo' });
  }
});

app.get('/asset-types', authenticateJWT, async (req, res) => {
  try {
    const assetTypes = await AssetType.find({});
    res.json(assetTypes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os tipos de ativos' });
  }
});

// Rotas para marcas
app.post('/brands', authenticateJWT, async (req, res) => {
  const { name } = req.body;
  try {
    const newBrand = new Brand({ name });
    await newBrand.save();
    res.status(201).json(newBrand);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao salvar a marca' });
  }
});

app.get('/brands', authenticateJWT, async (req, res) => {
  try {
    const brands = await Brand.find({});
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar as marcas' });
  }
});

// Rotas para modelos
app.post('/models', authenticateJWT, async (req, res) => {
  const { name } = req.body;
  try {
    const newModel = new Model({ name });
    await newModel.save();
    res.status(201).json(newModel);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao salvar o modelo' });
  }
});

app.get('/models', authenticateJWT, async (req, res) => {
  try {
    const models = await Model.find({});
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os modelos' });
  }
});

// Rotas para departamentos
app.post('/departments', authenticateJWT, async (req, res) => {
  const { name } = req.body;
  try {
    const newDepartment = new Department({ name });
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao salvar o departamento' });
  }
});

app.get('/departments', authenticateJWT, async (req, res) => {
  try {
    const departments = await Department.find({});
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os departamentos' });
  }
});

// Rotas para motoristas
app.post('/drivers', authenticateJWT, async (req, res) => {
  const { nome, cnh, validadeCnh, dataNascimento, endereco, telefone, email } = req.body;
  try {
    const newDriver = new Driver({ nome, cnh, validadeCnh, dataNascimento, endereco, telefone, email });
    await newDriver.save();
    res.status(201).json(newDriver);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao salvar o motorista' });
  }
});

app.get('/drivers', authenticateJWT, async (req, res) => {
  try {
    const drivers = await Driver.find({});
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os motoristas' });
  }
});

// Nova rota para registrar a saída do veículo
app.post('/fleet/saida', authenticateJWT, async (req, res) => {
  const { assetId, kmAtual, motoristaId, avarias } = req.body;

  try {
    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ error: 'Ativo não encontrado' });
    }

    const motorista = await Driver.findById(motoristaId);
    if (!motorista) {
      return res.status(404).json({ error: 'Motorista não encontrado' });
    }

    asset.fleet.saidas.push({
      dataSaida: new Date(),
      kmAtual,
      motorista: motoristaId,
      avarias
    });

    asset.fleet.kmSaida = kmAtual; // Atualiza a quilometragem de saída
    asset.fleet.emUso = true; // Atualiza o status para "em uso"

    // Verificar se a quilometragem atual atingiu a quilometragem para troca de óleo
    const kmRestanteTrocaOleo = asset.fleet.trocaOleoKm - (kmAtual - (asset.fleet.saidas[0]?.kmAtual || 0));
    if (kmRestanteTrocaOleo <= 500) { // Se a quilometragem restante for menor ou igual a 500 km
      const transporter = nodemailer.createTransport({
        host: 'email-ssl.com.br',
        port: 587,
        secure: false, // true para port 465, false para outras portas
        auth: {
          user: 'leandro@engemolde.com.br',
          pass: '2022@39!86#22@EnG'
        }
      });

      const mailOptions = {
        from: 'leandro@engemolde.com.br',
        to: 'informatica@engemolde.com.br', // Substitua pelo e-mail do setor de manutenção
        subject: 'Aviso de Troca de Óleo',
        text: `O veículo ${asset.nome} está a ${kmRestanteTrocaOleo} km da quilometragem para troca de óleo.`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Erro ao enviar email:', error);
        } else {
          console.log('Email enviado:', info.response);
        }
      });
    }

    await asset.save();
    res.json(asset.fleet);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar a saída do veículo' });
  }
});

// Nova rota para registrar a entrada do veículo
app.post('/fleet/entrada', authenticateJWT, async (req, res) => {
  const { assetId, kmAtual, avarias } = req.body;

  try {
    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ error: 'Ativo não encontrado' });
    }

    asset.fleet.entradas.push({
      dataEntrada: new Date(),
      kmAtual,
      avarias
    });

    asset.fleet.kmEntrada = kmAtual; // Atualiza a quilometragem de entrada
    asset.fleet.emUso = false; // Atualiza o status para "não em uso"

    await asset.save();
    res.json(asset.fleet);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar a entrada do veículo' });
  }
});

// Nova rota para obter detalhes dos veículos (para o Dashboard)
app.get('/assets/details', authenticateJWT, async (req, res) => {
  try {
    const assets = await Asset.find({}).populate('fleet.saidas.motorista');
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os detalhes dos veículos' });
  }
});

// Rota de pesquisa
app.get('/assets/search', authenticateJWT, async (req, res) => {
  const { query } = req.query;
  try {
    const regex = new RegExp(query, 'i'); // 'i' para tornar a pesquisa case-insensitive
    const assets = await Asset.find({ nome: regex });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os ativos' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
