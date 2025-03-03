const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

module.exports.checkEmailExists = async (email) => {
    const browser = await puppeteer.launch({ 
        headless: true, 
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();

    try {
        await page.goto("https://accounts.google.com/signin/recovery", { waitUntil: "load" });

        await page.type("input[type='email']", email);

        // Ensure button is visible before clicking
        await page.waitForSelector("#identifierNext > div > button", { timeout: 5000 });
        await page.click("#identifierNext > div > button");

        // Wait for either navigation OR error message
        const result = await Promise.race([
            page.waitForNavigation({ waitUntil: "networkidle2" }).then(() => "exists"),
            page.waitForSelector(".dEOOab.RxsGPe > div", { timeout: 5000 }).then(() => "not_exists")
        ]);

        if (result === "not_exists") {
            console.log(`❌ Gmail email does NOT exist: ${email}`);
            return false;
        } else {
            console.log(`✅ Gmail email EXISTS: ${email}`);
            return true;
        }        
    } catch (error) {
        console.error(`⚠️ Error checking Gmail: ${error.message}`);
        return null;
    } finally {
        await browser.close();
    }
};
