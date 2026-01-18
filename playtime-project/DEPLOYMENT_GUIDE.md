# 🚀 Guia de Lançamento (Deployment) do App Playtime

Você perguntou como lançar o app. Como estamos usando **Expo**, o processo é muito simplificado através do **EAS (Expo Application Services)**.

Sim, o **Expo** é um framework construído **em cima do React Native**. Ele age como uma "camada facilitadora", cuidando de toda a configuração chata nativa (Android Studio/Xcode) para que você possa focar apenas em escrever código JavaScript/React.

---

## 📦 Passos para Gerar o App (APK/AAB/IPA)

Para colocar o app nas lojas (Google Play e App Store) ou instalar no seu celular sem o Expo Go, você precisa "conluir" (buildar) o app.

### 1. Instalar a Ferramenta de Build (EAS CLI)
Primeiro, instale a ferramenta de linha de comando do Expo globalmente:

```bash
npm install -g eas-cli
```

### 2. Logar na sua conta Expo
Você precisa de uma conta no site [expo.dev](https://expo.dev). Depois de criar:

```bash
eas login
```

### 3. Configurar o Projeto
Isso vai criar um arquivo `eas.json` no seu projeto:

```bash
eas build:configure
```

### 4. Gerar o Aplicativo

#### 🤖 Para Android (Play Store)
Para gerar um arquivo `.aab` (padrão atual da Play Store):
```bash
eas build --platform android
```
*Se você quiser apenas um APK para testar direto no celular:*
```bash
eas build -p android --profile preview
```

#### 🍎 Para iOS (App Store)
*Nota: Você precisa de uma conta de desenvolvedor Apple ($99/ano).*
```bash
eas build --platform ios
```

---

## 🚀 Publicando nas Lojas

Depois de gerar os arquivos (Build), você pode enviá-los automaticamente:

### Google Play Store
```bash
eas submit -p android
```

### Apple App Store
```bash
eas submit -p ios
```

---

## 🔄 E as atualizações? (OTA Updates)

Uma das maiores mágicas do Expo é o **Expo Updates**.
Se você mexer apenas em código JavaScript (lógica, telas, cores) e não instalar novas bibliotecas nativas, você pode atualizar o app de todos os seus usuários **sem passar pela loja**:

```bash
eas update --branch production --message "Corrigindo bug do perfil"
```
O usuário abre o app e a atualização baixa sozinha! 🤯

---

## 📝 Resumo da Relação Expo vs React Native

*   **React Native**: É a tecnologia base (o motor). Permite criar apps nativos usando JS.
*   **Expo**: É a "carroceria" e o "painel de controle". Ele traz o motor pronto, com rodas, volante e ar-condicionado (câmera, mapas, notificações) já configurados.

Hoje em dia, a própria equipe do React Native (Meta/Facebook) recomenda começar novos projetos usando Expo!
