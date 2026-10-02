import { defineConfig, devices } from "@playwright/test";
import { SMTP_PORT } from "./e2e/mailbox";

const PORT = 3100;
const DEV_PORT = 3101;

// Overrides .env.local so the e2e run never reaches a real mailbox; servers are never reused for the same reason.
const smtpEnv = {
    SMTP_HOST: "127.0.0.1",
    SMTP_PORT: String(SMTP_PORT),
    SMTP_USER: "e2e",
    SMTP_PASS: "e2e",
    SMTP_EMAIL_FROM: "landing@e2e.test",
};

export default defineConfig({
    testDir: "e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? "github" : "list",
    globalSetup: "./e2e/global-setup.ts",
    use: {
        trace: "on-first-retry",
        reducedMotion: "reduce",
    },
    projects: [
        {
            name: "desktop",
            testIgnore: /simulation/,
            use: { ...devices["Desktop Chrome"], baseURL: `http://localhost:${PORT}` },
        },
        {
            name: "mobile",
            testIgnore: /simulation/,
            use: { ...devices["Pixel 7"], baseURL: `http://localhost:${PORT}` },
        },
        {
            name: "simulation",
            testMatch: /simulation/,
            timeout: 60_000,
            use: { ...devices["Desktop Chrome"], baseURL: `http://localhost:${DEV_PORT}` },
        },
    ],
    webServer: [
        {
            command: `pnpm build && pnpm exec next start -p ${PORT}`,
            url: `http://localhost:${PORT}`,
            env: smtpEnv,
            timeout: 240_000,
            reuseExistingServer: false,
        },
        {
            command: `pnpm exec next dev -p ${DEV_PORT}`,
            url: `http://localhost:${DEV_PORT}`,
            env: smtpEnv,
            timeout: 120_000,
            reuseExistingServer: false,
        },
    ],
});
