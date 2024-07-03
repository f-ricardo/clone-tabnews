function status(resquet, response) {
  response
    .status(200)
    .json({ chave: "os alunos do curso .dev são acima da média" });
}

export default status;
