# 🐧 Como Rodar o Playtime no WSL (Ubuntu)

## ⚠️ Problema Detectado

Você tem Node.js v12.22.9 no WSL, mas o Expo precisa de **Node.js v18 ou superior**.

---

## 🔧 Solução: Atualizar Node.js no WSL

### Opção 1: Usar NVM (Recomendado - Mais Fácil)

**NVM** (Node Version Manager) permite instalar e gerenciar várias versões do Node.js facilmente.

#### Passo 1: Abrir o WSL

Abra o terminal WSL (Ubuntu) que você mostrou na imagem.

#### Passo 2: Instalar o NVM

Cole este comando no terminal WSL:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

Pressione Enter e aguarde a instalação.

#### Passo 3: Recarregar o Terminal

```bash
source ~/.bashrc
```

#### Passo 4: Instalar Node.js v20 (LTS)

```bash
nvm install 20
```

#### Passo 5: Definir como Padrão

```bash
nvm use 20
nvm alias default 20
```

#### Passo 6: Verificar a Instalação

```bash
node --version
```

Deve mostrar: `v20.x.x` ✅

```bash
npm --version
```

Deve mostrar: `10.x.x` ✅

---

### Opção 2: Atualizar Manualmente (Mais Complexo)

Se preferir não usar NVM:

```bash
# Atualizar repositórios
sudo apt update

# Instalar curl (se não tiver)
sudo apt install -y curl

# Adicionar repositório do Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Instalar Node.js
sudo apt install -y nodejs

# Verificar versão
node --version
```

---

## 🚀 Depois de Atualizar o Node.js

### 1. Navegar para a Pasta do Projeto

No terminal WSL:

```bash
cd /mnt/c/Users/giova/OneDrive/Documents/playtime-project
```

### 2. Instalar Dependências

```bash
npm install
```

**Tempo estimado:** 2-5 minutos

### 3. Iniciar o Servidor Expo

```bash
npx expo start
```

**O que vai acontecer:**
- Um servidor será iniciado
- Um QR Code aparecerá no terminal
- Você verá opções para abrir no navegador ou celular

### 4. Testar no Celular

1. **Baixe o Expo Go** no celular:
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

2. **Abra o Expo Go**

3. **Escaneie o QR Code** que apareceu no terminal WSL:
   - Android: Use o scanner dentro do Expo Go
   - iOS: Use a câmera do iPhone

4. **Aguarde carregar** (pode demorar na primeira vez)

5. **Pronto!** O app está rodando! 🎉

---

## 🎯 Comandos Rápidos (Copie e Cole)

### Instalar NVM e Node.js 20

```bash
# Instalar NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recarregar terminal
source ~/.bashrc

# Instalar Node.js 20
nvm install 20
nvm use 20
nvm alias default 20

# Verificar
node --version
npm --version
```

### Rodar o Projeto

```bash
# Ir para a pasta
cd /mnt/c/Users/giova/OneDrive/Documents/playtime-project

# Instalar dependências
npm install

# Iniciar o app
npx expo start
```

---

## 🐛 Problemas Comuns

### "command not found: nvm"

**Solução:** Feche e abra o terminal WSL novamente, ou rode:
```bash
source ~/.bashrc
```

### "EACCES: permission denied"

**Solução:** Não use `sudo` com npm. Se der erro, rode:
```bash
sudo chown -R $USER ~/.npm
```

### "Metro Bundler error"

**Solução:**
```bash
npx expo start -c
```

### "Network response timed out"

**Solução:** Verifique se celular e PC estão na mesma WiFi

---

## 💡 Dica: Usar VS Code com WSL

Você pode abrir o projeto no VS Code direto do WSL:

```bash
cd /mnt/c/Users/giova/OneDrive/Documents/playtime-project
code .
```

Isso abre o VS Code com integração WSL (muito melhor para desenvolvimento!)

---

## 📊 Resumo Visual

```
┌─────────────────────────────────────┐
│  1. Atualizar Node.js no WSL        │
│     (v12 → v20 com NVM)             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  2. Navegar para pasta do projeto   │
│     cd /mnt/c/Users/.../playtime... │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  3. Instalar dependências           │
│     npm install                     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  4. Iniciar servidor                │
│     npx expo start                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  5. Escanear QR Code no celular     │
│     (com app Expo Go)               │
└─────────────────────────────────────┘
```

---

## ✅ Checklist

- [ ] Atualizar Node.js para v20 no WSL
- [ ] Verificar versão: `node --version` (deve ser v20+)
- [ ] Navegar para pasta do projeto
- [ ] Rodar `npm install`
- [ ] Rodar `npx expo start`
- [ ] Baixar Expo Go no celular
- [ ] Escanear QR Code
- [ ] Testar o app!

---

**Boa sorte! Qualquer dúvida, me avise! 🚀**
