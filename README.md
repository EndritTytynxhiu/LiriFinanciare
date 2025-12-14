# Liri Financiare

Një aplikacion uebi për sigurinë dhe planifikimin financiar për gratë, ndërtuar me React, TypeScript dhe Vite. Përdor OpenAI për këshilla dhe planifikim të fuqizuar nga AI.

## Karakteristikat

- Bisedë këshilltari financiar i fuqizuar nga AI
- Gjenerator plani financiar
- Gjetës burimesh për mbështetje lokale
- Bibliotekë kursesh për edukim financiar
- Mjete kursimi dhe grafikë
- Këshilla sigurie dixhitale

## Udhëzime Vendosjeje (Për Marrësit e Besuar)

Për të punuar këtë aplikacion, duhet të keni Node.js të shkarkuar dhe të instaluar në kompjuterin tuaj.

Prof per shkak se OpenAi nuk lejon vendosjen e API keyit ne github nese kishin muajtur ta futni secretkeyn ose variablen ne aactions aiKey e github per openAi key ne .env file do te punonte prototipi ashtu si duhet:

1. **Zhbllokoni dosjen e projektit** në vendndodhjen tuaj të dëshiruar.

2. **Instaloni varësitë:**
   ```bash
   npm install
   ```

3. **Drejtoni serverin e zhvillimit:**
   ```bash
   npm run dev
   ```

4. **Hapni shfletuesin tuaj** në `http://localhost:5173`

Çelësi API është tashmë i konfiguruar në `.env`, kështu që nuk është e nevojshme konfigurimi shtesë!

## Për Zhvillim/Ndarje Repozitori

Nëse jeni duke klonuar nga një repozitor ose doni të vendosni çelësin tuaj API:

1. **Klononi repozitorin:**
   ```bash
   git clone <repository-url>
   cd liri-financiare
   ```

2. **Instaloni varësitë:**
   ```bash
   npm install
   ```

3. **Vendosni variablat e mjedisit:**
   - Kopjoni `.env.example` në `.env`
   - Merrni një çelës API OpenAI nga [OpenAI Platform](https://platform.openai.com/api-keys)
   - Shtoni çelësin tuaj API në `.env`:
     ```
     API_KEY=your_openai_api_key_here
     ```

4. **Drejtoni serverin e zhvillimit:**
   ```bash
   npm run dev
   ```

5. **Hapni shfletuesin tuaj** në `http://localhost:5173`

## Ndërtoni për Prodhim

```bash
npm run build
```

Skedarët e ndërtuar do të jenë në dosjen `dist`.

## Teknologjitë e Përdorura

- React 19
- TypeScript
- Vite
- OpenAI API
- Lucide React (ikona)
- Recharts (grafikë)
- React Markdown

## Kontributi

1. Fork repozitorin
2. Krijoni një degë karakteristikash
3. Bëni ndryshimet tuaja
4. Testoni plotësisht
5. Dorëzoni një kërkesë tërheqjeje

## Licensa

Ky projekt është licencuar nën Licensën MIT.
```
