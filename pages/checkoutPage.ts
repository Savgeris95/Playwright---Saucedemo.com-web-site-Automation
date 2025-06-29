import { Page } from "@playwright/test";

export class CheckoutPage{
    private readonly page: Page

    constructor(page){
        this.page = page
    }

    async fillForm(firstName: string, lastName: string, zipCode: string){
        
        await this.page.locator('[data-test="firstName"]').fill(firstName)
        await this.page.locator('[data-test="lastName"]').fill(lastName)
        await this.page.locator('[data-test="postalCode"]').fill(zipCode)
    }

    async clickContinue(){
        await this.page.getByRole('button', {name: 'Continue'}).click()
    }
    
    async clickFinish(){
        await this.page.getByRole('button', {name: 'Finish'}).click()
    }

    async clickBackHome(){
        await this.page.getByRole('button', {name: 'Back Home'}).click()
    }
    
    
}