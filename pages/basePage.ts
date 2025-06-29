import { expect, Page } from "@playwright/test";

export class BasePage{
    readonly page: Page

    constructor(page){
        this.page = page
    }

    async logOut(){
        await this.page.locator('#react-burger-menu-btn').click()
        await this.page.getByRole('link', {name: 'Logout'}).click()
        expect(this.page.url()).toBe('https://www.saucedemo.com/')
        
    }
    
    async closeTab(){
        await this.page.context().close();
    }
}