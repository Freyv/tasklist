const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const express = require("express");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET;

module.exports.getbyowerid = async (req, res) => {
  const authreader = await req.headers["authorization"];
  const tokem = authreader && authreader.split(" ")[1];
  const payload = jwt.verify(tokem, SECRET);
  const userId = payload.userId || payload.userID || payload.userId;
  try {
    const projects = await prisma.project.findMany({
      where: { ownerId: userId }, include:{tasks: true}
    });
    res.status(200).json(projects);
  } catch (e) {
    res.send(e);
  }
};

module.exports.create = async (req, res) => {
  const authreader = await req.headers["authorization"];
  const tokem = authreader && authreader.split(" ")[1];

  if (!tokem) {
    res.status(401).json({ error: " tokem nao fornecido" });
  }
  const data = req.body;

  try {
    const payload = jwt.verify(tokem, SECRET);
    const userId = payload.userId || payload.userID || payload.userId;

    await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        ownerId: userId,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(401).send(e);
  }
};

module.exports.update = async (req, res) => {
  const projectID = req.params.id;
  const data = req.body;
  try {
    await prisma.project.update({
      where: {
        id: projectID,
      },
      data,
    });
  } catch (e) {
    res.status(401).send(e);
  }
};
