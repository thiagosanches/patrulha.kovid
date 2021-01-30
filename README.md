# patrulha.kovid

### Introdução
Simples bot que navega no 'explore' do instagram e comenta em perfis abertos. A ideia é conscientizar a galera de uma forma gentil.

### Como executar?
```bash
git clone https://github.com/thiagosanches/patrulha.kovid.git
cd patrulha.kovid
npm i puppeteer
node main.js false <usuário instagram> '<senha instagram>'
```

Você pode passar `true` (`isDraft`) ao invés de `false`, desta forma o bot entende que ele vai fazer apenas um rascunho e não comentar nas postagens.

### Próximos passos?
Adicionar análise das fotos, identificando máscaras nas pessoas (???).
