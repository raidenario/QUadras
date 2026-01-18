# 📦 Como Instalar o Node.js no Windows

## O que é Node.js?

Node.js é um ambiente que permite executar JavaScript no seu computador (fora do navegador). React Native precisa dele para funcionar.

---

## Passo a Passo da Instalação

### 1. Baixar o Node.js

1. Acesse: **https://nodejs.org/**
2. Você verá dois botões de download:
   - **LTS** (Long Term Support) - RECOMENDADO ✅
   - **Current** (Versão mais recente)
3. Clique no botão **LTS** (geralmente verde)
4. O arquivo `node-vXX.XX.X-x64.msi` será baixado

### 2. Instalar o Node.js

1. Abra o arquivo baixado (`.msi`)
2. Clique em **Next** (Avançar)
3. Aceite os termos de licença
4. Clique em **Next** até chegar em "Tools for Native Modules"
5. **IMPORTANTE:** Marque a opção "Automatically install the necessary tools"
6. Continue clicando em **Next**
7. Clique em **Install** (pode pedir permissão de administrador)
8. Aguarde a instalação (pode demorar alguns minutos)
9. Clique em **Finish**

### 3. Verificar a Instalação

1. Abra o **PowerShell** ou **Prompt de Comando**
   - Pressione `Windows + R`
   - Digite `powershell`
   - Pressione Enter

2. Digite o seguinte comando e pressione Enter:
   ```bash
   node --version
   ```
   
   Deve aparecer algo como: `v20.11.0` ✅

3. Digite o seguinte comando e pressione Enter:
   ```bash
   npm --version
   ```
   
   Deve aparecer algo como: `10.2.4` ✅

Se aparecer as versões, **Node.js está instalado corretamente!** 🎉

---

## Próximos Passos

Agora que o Node.js está instalado, você pode rodar o app:

### 1. Abrir o PowerShell na pasta do projeto

1. Abra o **Explorador de Arquivos**
2. Navegue até: `C:\Users\giova\OneDrive\Documents\playtime-project`
3. Clique na barra de endereço (onde mostra o caminho)
4. Digite `powershell` e pressione Enter
5. O PowerShell abrirá na pasta do projeto

### 2. Instalar as dependências

Digite o comando:
```bash
npm install
```

**O que isso faz?** Baixa todas as bibliotecas que o app precisa (React Native, Expo, etc.)

**Quanto tempo demora?** 2-5 minutos (dependendo da internet)

### 3. Iniciar o app

Digite o comando:
```bash
npx expo start
```

**O que acontece?**
- Um servidor local é iniciado
- Um QR Code aparece no terminal
- Você pode escanear o QR Code com o app Expo Go no celular

### 4. Abrir no celular

1. Baixe o app **Expo Go** no celular:
   - **Android:** https://play.google.com/store/apps/details?id=host.exp.exponent
   - **iOS:** https://apps.apple.com/app/expo-go/id982107779

2. Abra o Expo Go

3. Escaneie o QR Code que apareceu no terminal:
   - **Android:** Use o scanner dentro do app Expo Go
   - **iOS:** Use a câmera normal do iPhone

4. Aguarde o app carregar (pode demorar na primeira vez)

5. **Pronto!** O app está rodando no seu celular! 🎉

---

## Problemas Comuns

### "npx não é reconhecido"

**Solução:** Feche e abra o PowerShell novamente (precisa recarregar as variáveis de ambiente)

### "Metro Bundler error"

**Solução:** 
```bash
npx expo start -c
```
(O `-c` limpa o cache)

### "Network response timed out"

**Solução:** Verifique se o celular e o PC estão na **mesma rede WiFi**

### "Unable to resolve module"

**Solução:**
1. Feche o servidor (Ctrl + C)
2. Delete a pasta `node_modules`
3. Rode `npm install` novamente

---

## Comandos Úteis

```bash
# Instalar dependências
npm install

# Iniciar o app
npx expo start

# Limpar cache e iniciar
npx expo start -c

# Ver versão do Node.js
node --version

# Ver versão do npm
npm --version
```

---

## Precisa de Ajuda?

- **Documentação do Expo:** https://docs.expo.dev/
- **Documentação do React Native:** https://reactnative.dev/
- **Fórum do Expo:** https://forums.expo.dev/

---

**Boa sorte com o desenvolvimento! 🚀**
