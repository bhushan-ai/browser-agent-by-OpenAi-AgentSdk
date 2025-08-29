import "dotenv/config";
import { aisdk } from "@openai/agents-extensions";
import { Agent, run, tool } from "@openai/agents";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import puppeteer from "puppeteer";

const browser = await puppeteer.launch({
  headless: false,
  args: ["--start-maximized"],
  defaultViewport: null,
});
const page = await browser.newPage();

const model = aisdk(google("gemini-2.5-flash"));

const openBrowser = tool({
  name: "open_browser",
  parameters: z.object({
    url: z.string(),
  }),
  async execute({ url }) {
    await new Promise((r) => setTimeout(r, 1000));
    await page.goto(url, { waitUntil: "networkidle2" });
    return `Opened ${url}`;
  },
});

const gotoRegister = tool({
  name: "goto_create_account",
  description: "wait and  navigate to the signup page by using the url",
  parameters: z.object({}),
  async execute() {
    try {
      // Wait for the signup link (adjust selector if different on site)
      await page.waitForSelector('a[href*="signup"], a[href*="register"]', {
        timeout: 5000,
      });

      const createAcc = await page.$('a[href*="signup"], a[href*="register"]');
      if (!createAcc) {
        throw new Error("Signup link not found on the page.");
      }

      // Navigation-safe click
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle2" }),
        createAcc.click(),
      ]);

      // Verify the form exists
      await page.waitForSelector("form", { timeout: 5000 });
      return "Opened create account form successfully.";
    } catch (err) {
      console.error("goto_create_account failed:", err.message);
      throw new Error(
        "Failed to navigate to signup page. Check selector or dynamic content."
      );
    }
  },
});

const takeScreenshot = tool({
  name: "take_screenshot",
  description:
    "wait 2 sec take the screenshot of the page and return the screenshot",
  parameters: z.object({
    filename: z.string().describe("The filename to save the screenshot as"),
  }),
  async execute({ filename }) {
    await new Promise((r) => setTimeout(r, 2000));
    page.screenshot({ path: `./images/` + filename });
    return `screenshot saved..`;
  },
});

const formFill = tool({
  name: "fill_form",
  description:
    "see the screenshot and fill the form according the field with first name last name email password confirm password",
  parameters: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
  }),
  async execute({ firstName, lastName, email, password, confirmPassword }) {
    // Type into fields
    await page.waitForSelector("form", { visible: true });

    if (await page.$('label[for="firstName"]')) {
      await page.type("#firstName", firstName);
    }
    if (await page.$('label[for="lastName"]')) {
      await page.type("#lastName", lastName);
    }
    if (await page.$('label[for="email"]')) {
      await page.type("#email", email);
    }
    if (await page.$('label[for="password"]')) {
      await page.type("#password", password);
    }
    if (await page.$('label[for="confirmPassword"]')) {
      await page.type("#confirmPassword", confirmPassword);
    }

    return "Form filled successfully";
  },
});

const submitForm = tool({
  name: "form_submit",
  description: "you submit the form by clicking the button",
  parameters: z.object({}),
  async execute() {
    await new Promise((r) => setTimeout(r, 2000));
    await page.click('button[type="submit"]');
  },
});

const agent = new Agent({
  name: "My Agent",
  instructions: `
You are a web automation agent.You use the tools to navigate through links and fill the forms:

Rules:
1. Open the website which is given by user.
2.After every tool call,ALWAYS call 'take_screenshot' and take the next step according to screenshot
3.search and navigate to the create account section of website using goto_create_account tool
4. fill the given information in form by using fill_form tool
   information:
   firstname:jake1,
   lastname:gynellhal,
   email:jake1@gmail.com,
   password:12345678
   confirm password:12345678
5. Submit the form by using form_submit tool
`,
  model,
  tools: [openBrowser, takeScreenshot, gotoRegister, formFill, submitForm],
});

const result = await run(
  agent,
  `goto https://ui.chaicode.com/ and fill the create account form`
);
console.log(result.finalOutput);
