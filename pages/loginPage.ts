import { Page } from "@playwright/test";

export class LoginPage{
    private readonly page: Page

    constructor(page){
        this.page = page
    }

    async login(username: string, password: string){
        await this.page.getByRole('textbox', {name: 'username'}).fill('standard_user')
        await this.page.getByRole('textbox', {name: 'password'}).fill('secret_sauce')
        await this.page.getByRole('button', {name: 'Login'}).click()
    }
}