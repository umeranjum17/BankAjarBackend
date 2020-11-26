const puppeteer = require("puppeteer");
const getBalance = (req, res) => {
    res.status(200).json({
        balance: process.env.BALANCE,
    });
};

const getIbanDetails = async (req, res) => {
    // ● 400 Bad Request - for IBANs which are syntactically invalid
    // ● 404 Not Found - for IBANs which are syntactically valid, but bank doesn’t exist
    // ● 504 Gateway Timeout - for scraping timeouts
    // ● 500 Internal Server Error - for any other errors
    try {
        const browser = await puppeteer.launch({
            headless: true,
        });
        let url = "https://transferwise.com/us/iban/checker";
        const page = await browser.newPage();
        await page.goto(url, {
            waitUntil: "networkidle2",
        });
        await page.waitForSelector("[id='iban-number']");
        await page.type("[id='iban-number']", req.params.iban);
        await page.click("[type='submit']", {
            waitUntil: "networkidle2",
        });
        await page.waitForNavigation();
        const groups = await page.evaluate(() =>
            Array.from(document.getElementsByTagName("h2"), (e) => e.textContent)
        );
        if (groups[0].includes("don´t look")) {
            res.status(400).json();
        }
        else {

           
            const image = await page.evaluate(() =>
                Array.from(document.getElementsByClassName("bank-logo"), (e) => ({ logo: e.src, bank: e.alt }))
            )
            console.log(image)
            let data = image[0];
            if (!data || !data.logo) {
                return res.status(404).json();
            }
          
          
            console.log(data)
            return res.status(203).json(data);
        }
        await browser.close();
    }
    catch (e) {
        res.status(500)
    }
};

const makeTransfer = (req, res) => {
    process.env.BALANCE=process.env.BALANCE-req.body.amount;
    console.log(process.env.BALANCE);
    
    // ● 400 Bad Request - for IBANs which are not invalid (syntactically or otherwise)
    // ● 402 Payment Required - for when the amount exceeds the available balance
    // ● 409 Conflict - for currency that doesn’t match the associated IBAN country
    // ● 418 I'm a Teapot - for any other potentially problematic scenarios..?
    res.status(202).json()
};

module.exports = {
    getBalance,
    getIbanDetails,
    makeTransfer,
};
