const {test, expect} =  require('@playwright/test')

test('Firsttest', async ({browser, page})=>{
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/')
});