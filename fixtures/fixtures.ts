import {test as base} from '@playwright/test'
import { PageManager } from '../pages/pageManager'


type Fixtures = {
    pm: PageManager
}

export const test = base.extend<Fixtures>({
  pm: async ({ page }, use) => {
    const pm = new PageManager(page);
    await page.goto('https://www.saucedemo.com/')
    await pm.loginPage().login('standard_user','secret_sauce')
    await use(pm)
  },
});