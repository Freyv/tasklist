const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

async function decode(authHeader) {
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  if (!token) return null;

  try {
    const payload = jwt.verify(token, SECRET);
    return payload.userId || payload.userID || payload.userid || null;
  } catch (err) {
    return null;
  }
}
module.exports.getbyProjectId = async (req, res) => {
  const projectId = req.params.projectId;

  try {
    const tasks = await prisma.task.findMany({
      where: { projectId },
    });
    if (!tasks) res.status(401);
    res.status(200).json(tasks);
  } catch {}
};
module.exports.getbyassignedId = async (req, res) => {
  const userID = req.params.userID;

  try {
    const tasks = await prisma.task.findMany({
      where: { assignedToId: userID },
      select: { name: true, description: true },
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(401).json;
  }
};

module.exports.create = async (req, res) => {
  const authreader = req.headers["authorization"];
  const userId = await decode(authreader);

  if (!userId) {
    return res.status(401).json({ error: "Token inválido ou não fornecido" });
  }

  const projectId = req.params.projectId;

  // verifica se projeto existe e pega o nome
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { name: true },
  });

  // if (!project) {
  //   return res.status(404).json({ error: "Projeto não encontrado" });
  // }

  const data = req.body;

  try {
    const task = await prisma.task.create({
      data: {
        name: data.name,
        description: data.description,
        projectId: projectId,
        projectName: project.name,
        authorId: userId,
        assignedToId: data.assignedToId, // quem vai fazer a tarefa
      },
    });

    return res.status(201).json(task);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Erro ao criar task" });
  }
};
