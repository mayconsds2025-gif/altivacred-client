import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function loginC6(usuario, senha) {
  try {
    console.log("🔧 Chromium path:", await chromium.executablePath());

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: await chromium.executablePath(),
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    page.on("pageerror", (err) => {
      console.log("⚠️ Erro dentro da página:", err.message);
    });

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.log("⚠️ Console error da página:", msg.text());
      }
    });

    // 🌐 Acessa o site
    await page.goto("https://c6.c6consig.com.br/", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // 📝 Preenche dados
    await page.type("#EUsuario_CAMPO", usuario, { delay: 40 });
    await page.type("#ESenha_CAMPO", senha, { delay: 40 });

    // ▶️ Clica no botão ENTRAR
    await Promise.all([
      page.click("#lnkEntrar"),
      page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 }),
    ]);

    // 🔍 Verifica se logou
    let loginValido = true;
    try {
      await page.waitForSelector("#lnkSair", { timeout: 8000 });
    } catch {
      loginValido = false;
    }

    if (!loginValido) {
      await browser.close();
      return {
        sucesso: false,
        erro: "Usuário ou senha incorretos.",
      };
    }

    // 🍪 Pega cookies + HTML
    const cookies = await page.cookies();
    const html = await page.content();

    await browser.close();

    return {
      sucesso: true,
      cookies,
      html,
    };
  } catch (e) {
    console.error("❌ Erro no login C6:", e);
    return {
      sucesso: false,
      erro: e.message || "Falha desconhecida ao tentar login.",
    };
  }
}
