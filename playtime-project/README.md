# 🎮 Playtime - Agendador de Partidas Esportivas

Aplicativo React Native para agendar partidas de futebol e vôlei com amigos!

## 📋 Pré-requisitos (IMPORTANTE!)

Antes de começar, você precisa instalar:

### 1. Node.js (Obrigatório!)

**O que é?** Node.js é o ambiente que executa JavaScript no seu computador. React Native precisa dele para funcionar.

**Como instalar:**
1. Acesse: https://nodejs.org/
2. Baixe a versão **LTS** (recomendada)
3. Execute o instalador e clique em "Next" até finalizar
4. **Reinicie o terminal/PowerShell** após instalar

**Como verificar se instalou:**
```bash
node --version
npm --version
```

Se aparecer a versão (ex: v20.11.0), está instalado! ✅

### 2. Expo Go no Celular

**O que é?** App que permite testar seu aplicativo React Native no celular sem precisar compilar.

**Como instalar:**
- **Android:** https://play.google.com/store/apps/details?id=host.exp.exponent
- **iOS:** https://apps.apple.com/app/expo-go/id982107779

---

## 🚀 Como Rodar o Projeto

### Passo 1: Instalar Dependências

Abra o terminal/PowerShell na pasta do projeto e execute:

```bash
npm install
```

**O que isso faz?** Baixa todas as bibliotecas que o app precisa (React Native, navegação, ícones, etc.)

### Passo 2: Iniciar o Servidor

```bash
npx expo start
```

**O que isso faz?** Inicia um servidor local e mostra um QR Code no terminal.

### Passo 3: Abrir no Celular

1. Abra o app **Expo Go** no celular
2. Escaneie o QR Code que apareceu no terminal
3. Aguarde o app carregar (pode demorar na primeira vez)
4. Pronto! O app está rodando! 🎉

**IMPORTANTE:** Celular e PC precisam estar na **mesma rede WiFi**!

---

## 📁 Estrutura do Projeto

```
playtime-project/
├── App.js                          # 🏠 Arquivo principal (ponto de entrada)
├── app.json                        # ⚙️ Configurações do Expo
├── package.json                    # 📦 Lista de dependências
├── src/
│   ├── components/                 # 🧩 Componentes reutilizáveis
│   │   ├── Header.js              # Cabeçalho com logo e ícones
│   │   ├── SearchBar.js           # Barra de busca
│   │   ├── MatchCard.js           # Card de partida
│   │   ├── TeamCard.js            # Card de time
│   │   ├── CourtCard.js           # Card de quadra
│   │   └── CustomButton.js        # Botão customizado
│   ├── screens/                    # 📱 Telas do app
│   │   ├── HomeScreen.js          # Tela inicial
│   │   ├── GamesScreen.js         # Tela de jogos
│   │   ├── TeamsScreen.js         # Tela de times
│   │   ├── NotificationsScreen.js # Tela de notificações
│   │   └── ProfileScreen.js       # Tela de perfil
│   ├── navigation/                 # 🧭 Configuração de navegação
│   │   └── AppNavigator.js        # Navegador com abas
│   ├── theme/                      # 🎨 Temas e estilos
│   │   ├── colors.js              # Paleta de cores
│   │   └── ThemeContext.js        # Gerenciador de tema (light/dark)
│   └── data/                       # 📊 Dados de exemplo
│       └── mockData.js            # Dados mockados para teste
└── assets/                         # 🖼️ Imagens e ícones
```

---

## 🎨 Conceitos Básicos de React Native

### O que é React Native?

React Native permite criar apps **nativos** (Android e iOS) usando JavaScript. O código é **compartilhado** entre as plataformas!

### Diferenças do HTML

| HTML | React Native | Explicação |
|------|--------------|------------|
| `<div>` | `<View>` | Container/caixa |
| `<p>`, `<span>` | `<Text>` | Texto |
| `<button>` | `<TouchableOpacity>` | Botão clicável |
| `<input>` | `<TextInput>` | Campo de texto |
| `<img>` | `<Image>` | Imagem |
| CSS | `StyleSheet` | Estilos (parecido com CSS) |

### Componentes

**O que são?** Pedaços reutilizáveis de interface. Exemplo: um botão, um card, um header.

```javascript
// Exemplo de componente simples
function MeuBotao() {
  return (
    <TouchableOpacity>
      <Text>Clique aqui</Text>
    </TouchableOpacity>
  );
}
```

### Props

**O que são?** Dados que você passa para um componente (como atributos HTML).

```javascript
// Passando props
<MeuBotao texto="Salvar" cor="azul" />

// Recebendo props
function MeuBotao({ texto, cor }) {
  return <Text style={{ color: cor }}>{texto}</Text>;
}
```

### State (Estado)

**O que é?** Dados que podem mudar e fazem o componente re-renderizar.

```javascript
import { useState } from 'react';

function Contador() {
  const [numero, setNumero] = useState(0); // Estado inicial = 0
  
  return (
    <TouchableOpacity onPress={() => setNumero(numero + 1)}>
      <Text>Cliques: {numero}</Text>
    </TouchableOpacity>
  );
}
```

---

## 🎯 Funcionalidades Implementadas

- ✅ Navegação por abas (Footer com 5 telas)
- ✅ Tema claro/escuro (Light/Dark mode)
- ✅ Header com dropdown de usuário
- ✅ Tela inicial com últimas e próximas partidas
- ✅ Cards de times e quadras
- ✅ Barra de busca
- ✅ Dados mockados para demonstração

---

## 🔧 Comandos Úteis

```bash
# Instalar dependências
npm install

# Iniciar o app
npx expo start

# Limpar cache (se der erro)
npx expo start -c

# Ver logs detalhados
npx expo start --dev-client
```

---

## 📚 Recursos para Aprender

- **Documentação Expo:** https://docs.expo.dev/
- **React Native Docs:** https://reactnative.dev/docs/getting-started
- **Curso gratuito (PT-BR):** https://www.youtube.com/watch?v=qzw3JfZV-WQ

---

## 🐛 Problemas Comuns

### "Metro Bundler error"
**Solução:** Feche o terminal e rode `npx expo start -c`

### "Network response timed out"
**Solução:** Verifique se celular e PC estão na mesma WiFi

### "Unable to resolve module"
**Solução:** Delete a pasta `node_modules` e rode `npm install` novamente

---

## 📝 Próximos Passos (Futuro)

- [ ] Integração com backend (API)
- [ ] Autenticação de usuários
- [ ] Sistema de notificações push
- [ ] Chat entre jogadores
- [ ] Mapa com localização das quadras
- [ ] Sistema de pagamento para reservas

---

## 👨‍💻 Desenvolvido com

- React Native
- Expo
- React Navigation
- Context API (gerenciamento de estado)

---

**Dúvidas?** Leia os comentários no código! Cada arquivo tem explicações detalhadas. 📖
